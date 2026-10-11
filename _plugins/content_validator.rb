# frozen_string_literal: true

require "date"
require "set"

# Checks the site's content at build time (PLAN 10.1), so a mistake in a data
# file or in front matter becomes a clear message instead of a broken page.
#
# - Errors stop the build: a missing required field, a value the templates
#   cannot use (a date, a type, a link, a YouTube ID), a duplicate id, or a
#   reference to a publication, talk, story, topic, or image that does not
#   exist.
# - Warnings are printed and the build goes on: a field the site does not
#   know (often a typo), entries out of order, a description outside 140 to
#   160 characters, a news item still marked `proposed`.
# - Production builds (CI) also stop on any TODO(mehdi) marker and on any
#   /dev/ page.
#
# Every message names the file and the entry. GUIDE.md ("When the build
# stops") explains them.
module ContentValidator
  NEWS_TYPES = %w[paper award talk career video release service milestone].freeze
  TALK_KINDS = ["Lecture", "Poster", "Invited talk", "Workshop talk", "Competition talk", "Project presentation", "Demo"].freeze
  PUB_TYPES = %w[journal magazine conference dataset software].freeze
  PUB_STATUSES = %w[published accepted under-review preprint].freeze
  LINK_ICONS = %w[google-scholar orcid github linkedin researchgate youtube arxiv ieee].freeze
  # Keys Jekyll itself adds to documents (not written by hand).
  JEKYLL_KEYS = %w[layout permalink categories tags excerpt slug ext draft title date collection output last_modified_at].freeze

  class Validator
    def initialize(site)
      @site = site
      @errors = []
      @warnings = []
      @pub_slugs = site.collections.fetch("publications", nil)&.docs.to_a.map { |doc| File.basename(doc.relative_path, ".*") }.to_set
      @talk_ids = Array(site.data["talks"]).filter_map { |talk| talk["id"] if talk.is_a?(Hash) }.to_set
      @topic_ids = Array(site.data["topics"]).filter_map { |topic| topic["id"] if topic.is_a?(Hash) }.to_set
      @story_urls = site.posts.docs.map(&:url).to_set
      @images = (site.data["images"] || {}).keys.to_set
    end

    # ----- checks on single values: each returns nil when fine, else a problem

    def problem(kind, value)
      case kind
      when :text then "must be text" unless value.is_a?(String) && !value.strip.empty?
      when :date then "must be a date written YYYY-MM-DD (day 01 when only the month is known)" unless date?(value)
      when :bool then "must be true or false" unless [true, false].include?(value)
      when :int then "must be a whole number" unless value.is_a?(Integer) && value >= 0
      when :year then "must be a year such as 2026" unless value.is_a?(Integer) && value.between?(1900, 2100)
      when :url then "must be a full web address starting with https://" unless url?(value)
      when :link then "must be a full web address (https://...) or a path on this site (/...)" unless url?(value) || path?(value)
      when :path then "must be a path on this site, starting with /" unless path?(value)
      when :slug then "must be lowercase words joined by hyphens, such as cell-free-isac" unless value.is_a?(String) && value.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)
      when :email then "must be an email address" unless value.is_a?(String) && value.match?(/\A[^@\s]+@[^@\s]+\.[^@\s]+\z/)
      when :youtube then "must be a YouTube video ID (the 11 characters after watch?v=)" unless value.is_a?(String) && value.match?(/\A[A-Za-z0-9_-]{11}\z/)
      when :duration then "must be a duration such as PT12M34S or PT1H2M41S" unless value.is_a?(String) && value.match?(/\APT(?=\d)(\d+H)?(\d+M)?(\d+S)?\z/)
      when :doi then "must be a DOI only, such as 10.1109/TVT.2026.3656108 (no https://doi.org/)" unless value.is_a?(String) && value.match?(%r{\A10\.\d{4,9}/\S+\z})
      when :arxiv
        if value.is_a?(Numeric)
          "must be in quotes, such as arxiv: \"2609.12195\" (without quotes, YAML reads the ID as a number and drops a trailing zero, which breaks the link)"
        elsif !(value.is_a?(String) && value.match?(/\A\d{4}\.\d{4,5}(v\d+)?\z/))
          "must be an arXiv ID only, in quotes, such as \"2609.12195\""
        end
      when :texts then "must be a list of text items" unless value.is_a?(Array) && !value.empty? && value.all? { |item| item.is_a?(String) && !item.strip.empty? }
      when :dates then "must be a list of dates (YYYY-MM-DD)" unless value.is_a?(Array) && !value.empty? && value.all? { |item| date?(item) }
      when :pub then "names no publication (no file _publications/#{value}.md)" unless @pub_slugs.include?(value.to_s)
      when :pubs then (missing = Array(value).reject { |slug| @pub_slugs.include?(slug.to_s) }).empty? ? nil : "names publications that do not exist: #{missing.join(', ')}"
      when :talk then "names no talk (no id `#{value}` in _data/talks.yml)" unless @talk_ids.include?(value.to_s)
      when :story then "is not the address of a story (for example /posts/2025/10/blog-post-5/)" unless @story_urls.include?(value.to_s)
      when :topics then (missing = Array(value).reject { |id| @topic_ids.include?(id.to_s) }).empty? ? nil : "names topics that are not in _data/topics.yml: #{missing.join(', ')}"
      when :image then "names no image in _data/images.yml (add it to _assets-src/images.yml and run scripts/optimize_images.py)" unless @images.include?(value.to_s)
      when :file then "names a file that does not exist" unless path?(value) && File.exist?(File.join(@site.source, value))
      when Array then "is \"#{value}\"; use one of: #{kind.join(', ')}" unless kind.include?(value)
      when Proc then kind.call(value)
      end
    end

    def date?(value)
      return true if value.is_a?(Date) || value.is_a?(Time)
      return false unless value.is_a?(String) && value.match?(/\A\d{4}-\d{2}-\d{2}\z/)

      Date.iso8601(value)
      true
    rescue ArgumentError
      false
    end

    def url?(value) = value.is_a?(String) && value.match?(%r{\Ahttps?://\S+\z})
    def path?(value) = value.is_a?(String) && value.start_with?("/") && !value.include?(" ")

    def to_date(value)
      return value.to_date if value.respond_to?(:to_date)

      Date.iso8601(value.to_s)
    rescue ArgumentError
      nil
    end

    # ----- checks on entries

    # Checks one entry (a Hash) against required and optional fields.
    def entry(where, item, required: {}, optional: {}, ignore: [])
      unless item.is_a?(Hash)
        @errors << "#{where}: should be a set of fields (name: value), found #{item.inspect[0, 60]}"
        return
      end
      required.each do |field, kind|
        value = item[field]
        if value.nil? || (value.respond_to?(:empty?) && value.empty?)
          @errors << "#{where}: `#{field}` is missing"
        elsif (issue = problem(kind, value))
          @errors << "#{where}: `#{field}` #{issue}"
        end
      end
      optional.each do |field, kind|
        value = item[field]
        next if value.nil? || value == ""

        issue = problem(kind, value)
        @errors << "#{where}: `#{field}` #{issue}" if issue
      end
      unknown = item.keys - required.keys - optional.keys - ignore
      unknown.each { |field| @warnings << "#{where}: unknown field `#{field}` (a typo?); the site ignores it" }
    end

    def list(file, items, label, **spec)
      unless items.is_a?(Array)
        @errors << "#{file}: should be a list of entries, each starting with \"- \"" unless items.nil?
        return []
      end
      items.each_with_index do |item, i|
        name = item.is_a?(Hash) ? label.call(item) : nil
        entry("#{file}, entry #{i + 1}#{name ? " (#{name})" : ''}", item, **spec)
      end
      items
    end

    def unique(file, items, field)
      seen = Hash.new(0)
      Array(items).each { |item| seen[item[field]] += 1 if item.is_a?(Hash) && item[field] }
      seen.each { |value, count| @errors << "#{file}: `#{field}` #{value} is used #{count} times; it must be unique" if count > 1 }
    end

    def newest_first(file, items, field, what)
      dates = Array(items).map { |item| item.is_a?(Hash) ? to_date(item[field]) : nil }
      dates.each_cons(2).with_index do |(newer, older), i|
        next unless newer && older && older > newer

        @warnings << "#{file}: entry #{i + 2} (#{older}) is newer than entry #{i + 1} (#{newer}); #{what} appear in file order, newest first"
      end
    end

    def short(text, size = 40)
      text = text.to_s.gsub(/[*_`]/, "").strip
      text.length > size ? "#{text[0, size]}..." : text
    end

    # ----- the files

    def run
      profile
      navigation
      news
      talks
      awards
      videos
      topics
      cv
      redirects
      publications
      stories
      self
    end

    def profile
      file = "_data/profile.yml"
      data = @site.data["profile"]
      return @errors << "#{file}: missing" unless data

      entry(file, data,
            required: { "name" => :text, "title" => :text, "affiliation" => :text, "affiliation_short" => :text,
                        "headline" => :text, "intro" => :text, "bio" => :text, "email" => :email, "links" => ->(v) { "must be a list of links" unless v.is_a?(Array) },
                        "interests" => ->(v) { "must be a list of groups" unless v.is_a?(Array) } },
            optional: { "department" => :text, "location" => :text, "photo" => :file, "photo_image" => :image, "cv_pdf" => :path,
                        "social_card" => :file, "social_card_alt" => :text, "advisor" => ->(v) { "needs `name` (and an optional `url`)" unless v.is_a?(Hash) && v["name"] } })
      Array(data["links"]).each_with_index do |link, i|
        entry("#{file}, links, entry #{i + 1}", link,
              required: { "id" => :slug, "label" => :text, "url" => :url }, optional: { "footer_only" => :bool })
        @warnings << "#{file}, links, entry #{i + 1}: no icon for id `#{link['id']}` (known: #{LINK_ICONS.join(', ')})" if link.is_a?(Hash) && link["id"] && !LINK_ICONS.include?(link["id"])
      end
      Array(data["interests"]).each_with_index do |group, i|
        entry("#{file}, interests, entry #{i + 1}", group, required: { "group" => :text, "items" => :texts })
      end
    end

    def navigation
      list("_data/navigation.yml", @site.data["navigation"], ->(n) { n["label"] },
           required: { "label" => :text, "url" => :path, "section" => :text }, optional: { "match" => :texts })
    end

    def news
      file = "_data/news.yml"
      items = list(file, @site.data["news"], ->(n) { "#{n['date']}, \"#{short(n['text'])}\"" },
                   required: { "date" => :date, "type" => NEWS_TYPES, "text" => :text },
                   optional: { "pub" => :pub, "talk" => :talk, "story" => :story, "url" => :link, "url_label" => :text, "pin" => :bool, "proposed" => :bool })
      items.each_with_index do |item, i|
        next unless item.is_a?(Hash)

        @warnings << "#{file}, entry #{i + 1}: `url_label` without a `url`" if item["url_label"] && !item["url"]
        @warnings << "#{file}, entry #{i + 1}: still marked `proposed: true`; remove the line once it is confirmed" if item["proposed"]
      end
      newest_first(file, items, "date", "news items")
    end

    def talks
      file = "_data/talks.yml"
      items = list(file, @site.data["talks"], ->(t) { t["id"] },
                   required: { "id" => :slug, "date" => :date, "title" => :text, "kind" => TALK_KINDS, "event" => :text },
                   optional: { "location" => :text, "event_url" => :url, "pub" => :pub, "slides" => :link, "video" => :youtube,
                               "video_start" => :int, "story" => :story, "note" => :text })
      unique(file, items, "id")
      items.each_with_index do |item, i|
        @errors << "#{file}, entry #{i + 1} (#{item['id']}): `video_start` needs a `video`" if item.is_a?(Hash) && item["video_start"] && !item["video"]
      end
      newest_first(file, items, "date", "talks")
    end

    def awards
      list("_data/awards.yml", @site.data["awards"], ->(a) { short(a["title"]) },
           required: { "year" => :year, "title" => :text },
           optional: { "date" => :date, "years" => ->(v) { "must be text such as \"2022, 2023\"" unless v.is_a?(String) || v.is_a?(Integer) },
                       "org" => :text, "detail" => :text, "pub" => :pub, "talk" => :talk, "url" => :link, "home" => :bool })
    end

    def videos
      file = "_data/videos.yml"
      data = @site.data["videos"]
      return @errors << "#{file}: missing" unless data.is_a?(Hash)

      entry("#{file}, channel", data["channel"], required: { "name" => :text, "url" => :url },
            optional: { "handle" => :text, "description" => :text,
                        "id" => ->(v) { "must be the channel's ID: 24 characters starting with UC (on YouTube: the channel's About panel, Share channel, Copy channel ID)" unless v.is_a?(String) && v.match?(/\AUC[A-Za-z0-9_-]{22}\z/) } })
      (data.keys - %w[channel skip videos]).each { |key| @warnings << "#{file}: unknown field `#{key}` (a typo?); the site ignores it" }
      skip = data["skip"]
      if !skip.nil? && !skip.is_a?(Array)
        @errors << "#{file}: `skip` must be a list of YouTube video IDs, one per line starting with \"- \" (or [] for none)"
      else
        Array(skip).each_with_index do |id, i|
          issue = problem(:youtube, id)
          @errors << "#{file}, skip, entry #{i + 1}: #{issue}" if issue
        end
      end
      items = list(file, data["videos"], ->(v) { v["id"] },
                   required: { "id" => :youtube, "title" => :text, "date" => :date },
                   optional: { "description" => :text, "language" => ->(v) { "must be a language code such as fa" unless v.to_s.match?(/\A[a-z]{2}(-[A-Z]{2})?\z/) },
                               "duration" => :duration, "start" => :int, "note" => :text, "pub" => :pub, "source_title" => :text,
                               "host" => ->(v) { "needs `name` and `url`" unless v.is_a?(Hash) && v["name"] && url?(v["url"]) } })
      unique(file, items, "id")
      items.each_with_index do |item, i|
        @warnings << "#{file}, entry #{i + 1} (#{item['id']}): `start` without `source_title` (the longer video's title)" if item.is_a?(Hash) && item["start"] && !item["source_title"]
        @warnings << "#{file}, entry #{i + 1} (#{item['id']}): also under `skip`, which only hides uploads found in the channel's feed; this entry still shows" if item.is_a?(Hash) && Array(skip).include?(item["id"])
      end
      newest_first(file, items, "date", "videos")
    end

    def topics
      items = list("_data/topics.yml", @site.data["topics"], ->(t) { t["id"] }, required: { "id" => :slug, "label" => :text })
      unique("_data/topics.yml", items, "id")
    end

    def cv
      cv = @site.data["cv"] || {}
      logo = ->(v) { "names no logo image (expected logos/logo-#{v} in _data/images.yml)" unless @images.include?("logos/logo-#{v}") }
      list("_data/cv/education.yml", cv["education"], ->(e) { "#{e['degree']}, #{e['school']}" },
           required: { "degree" => :text, "field" => :text, "school" => :text, "start" => :date, "end" => :date },
           optional: { "school_short" => :text, "location" => :text, "expected" => :bool, "gpa" => :text, "thesis" => :text, "advisor" => :text, "logo" => logo })
      list("_data/cv/experience.yml", cv["experience"], ->(e) { "#{e['title']}, #{e['org']}" },
           required: { "title" => :text, "org" => :text, "start" => :date },
           optional: { "unit" => :text, "location" => :text, "where" => :text, "end" => :date, "summary" => :text,
                       "bullets" => ->(v) { "must be a list of text items (or [] for none)" unless v.is_a?(Array) && v.all? { |b| b.is_a?(String) && !b.strip.empty? } },
                       "extra" => :texts, "supervisor" => :text })
      list("_data/cv/skills.yml", cv["skills"], ->(s) { s["group"] }, required: { "group" => :text, "items" => :texts })
      list("_data/cv/service.yml", cv["service"], ->(s) { s["role"] },
           required: { "role" => :text, "years" => :text,
                       "venues" => ->(v) { "must be a list of { name: ..., short: ... }" unless v.is_a?(Array) && v.all? { |x| x.is_a?(Hash) && x["name"] } } })
      list("_data/cv/teaching.yml", cv["teaching"], ->(t) { "#{t['course']}, #{t['term']}" },
           required: { "course" => :text, "term" => :text, "institution" => :text, "role" => :text }, optional: { "code" => :text })
      list("_data/cv/coursework.yml", cv["coursework"], ->(c) { c["course"] },
           required: { "term" => :text, "course" => :text, "institution" => :text }, optional: { "grade" => :text })
      list("_data/cv/conferences.yml", cv["conferences"], ->(c) { c["event"] },
           required: { "event" => :text, "dates" => :dates }, optional: { "location" => :text })
    end

    def redirects
      file = "_data/redirects.yml"
      items = list(file, @site.data["redirects"], ->(r) { r["from"] }, required: { "from" => :path, "to" => :link })
      unique(file, items, "from")
      pages = @site.pages.map(&:url).to_set
      items.each_with_index do |item, i|
        @errors << "#{file}, entry #{i + 1}: #{item['from']} is a page of the site; a redirect cannot replace it" if item.is_a?(Hash) && pages.include?(item["from"])
      end
    end

    def publications
      docs = @site.collections.fetch("publications", nil)&.docs.to_a
      docs.each do |doc|
        file = doc.relative_path
        slug = File.basename(file, ".*")
        @errors << "#{file}: the file name (the slug) must be lowercase words joined by hyphens" unless slug.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)
        data = doc.data
        entry(file, data,
              required: { "title" => :text, "authors" => :texts, "type" => PUB_TYPES, "status" => PUB_STATUSES, "venue" => :text, "date" => :date },
              optional: { "venue_short" => :text, "doi" => :doi, "arxiv" => :arxiv, "code" => :url, "pdf" => :link, "slides" => :link,
                          "video" => :youtube, "poster" => :link, "dataset" => :url, "award" => :text, "featured" => :bool, "topics" => :topics,
                          "figure" => :image, "figure_alt" => :text, "figure_caption" => :text, "description" => :text,
                          "bibtex" => ->(v) { "must start with @ (a BibTeX entry such as @article{...})" unless v.to_s.strip.start_with?("@") },
                          "redirect_from" => ->(v) { "must be a list of old paths starting with /" unless Array(v).all? { |p| path?(p) } } },
              ignore: JEKYLL_KEYS)
        @errors << "#{file}: `figure` needs a `figure_alt` (a description of the image)" if data["figure"] && !data["figure_alt"]
        @warnings << "#{file}: no `topics`, so the topic filters on /publications/ cannot find it" if Array(data["topics"]).empty?
        @warnings << "#{file}: no `bibtex`, so it has no BibTeX button" if %w[journal magazine conference].include?(data["type"]) && !data["bibtex"]
        description_length(file, data["description"])
      end
    end

    def stories
      @site.posts.docs.each do |doc|
        file = doc.relative_path
        data = doc.data
        entry(file, data,
              required: { "title" => :text, "date" => :date, "description" => :text },
              optional: { "image" => :file, "image_alt" => :text, "pubs" => :pubs, "video" => :youtube,
                          "links" => ->(v) { "must be a list of { label: ..., url: ... }" unless v.is_a?(Array) && v.all? { |l| l.is_a?(Hash) && l["label"] && url?(l["url"]) } } },
              ignore: JEKYLL_KEYS)
        @errors << "#{file}: `image` needs an `image_alt` (a description of the photo)" if data["image"] && !data["image_alt"]
        description_length(file, data["description"])
      end
    end

    def description_length(file, text)
      return unless text.is_a?(String)

      @warnings << "#{file}: `description` is #{text.length} characters; search results show 140 to 160" unless text.length.between?(140, 160)
    end

    # Production only: no TODO(mehdi) markers and no /dev/ pages.
    def production
      TodoCollector::SOURCES.each do |pattern|
        Dir.glob(File.join(@site.source, pattern)).sort.each do |path|
          next unless File.file?(path)

          file = path.delete_prefix("#{@site.source}/")
          next if file.match?(TodoCollector::SKIP)

          File.foreach(path, encoding: "UTF-8").with_index(1) do |line, number|
            @errors << "#{file}, line #{number}: TODO(mehdi) marker; answer it (or remove it) before publishing" if line.include?("TODO(mehdi)")
          end
        end
      end
      @site.pages.select { |page| page.url.start_with?("/dev/") }.each { |page| @errors << "#{page.relative_path}: a /dev/ page is in the production build" }
      self
    end

    def report!
      @warnings.each { |message| Jekyll.logger.warn "Content:", message }
      return if @errors.empty?

      @errors.each { |message| Jekyll.logger.error "Content:", message }
      raise Jekyll::Errors::FatalException,
            "#{@errors.size} content #{@errors.size == 1 ? 'error' : 'errors'} (listed above); fix #{@errors.size == 1 ? 'it' : 'them'} and build again (GUIDE.md, \"When the build stops\")"
    end
  end

  # Data and front matter, as soon as they are read.
  Jekyll::Hooks.register :site, :post_read do |site|
    Validator.new(site).run.report!
  end

  # After the /dev/ pages are dropped (dev_filter.rb), production builds also
  # check for leftover TODO(mehdi) markers and /dev/ pages.
  Jekyll::Hooks.register :site, :pre_render do |site|
    Validator.new(site).production.report! if Jekyll.env == "production"
  end
end
