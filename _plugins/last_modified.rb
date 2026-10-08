# frozen_string_literal: true

require "open3"
require "set"
require "time"

# Sets `last_modified_at` on pages, publications, and stories from Git: the
# date of the last commit that touched the file or any file its front matter
# lists in `last_modified_from` (globs, for pages built from data files).
# jekyll-sitemap turns it into <lastmod>, and stories use it as their
# dateModified (PLAN 4.8 and 9.5). Files with uncommitted changes count as
# changed now. Skipped without Git or in a shallow clone (CI checks out the
# full history for this).
module LastModified
  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      @source = site.source
      @dates = commit_dates
      return if @dates.empty?

      @dirty = changed_files
      items = site.pages + site.collections.values.flat_map(&:docs)
      items.each do |item|
        next if item.data.key?("last_modified_at") || item.data["redirect_to"]

        paths = [item.relative_path] + Array(item.data["last_modified_from"]).flat_map { |glob| expand(glob) }
        times = paths.map { |path| @dirty.include?(path) ? Time.now : @dates[path] }.compact
        item.data["last_modified_at"] = times.max unless times.empty?
      end
    end

    private

    def git(*args)
      out, status = Open3.capture2("git", "-C", @source, *args)
      status.success? ? out : nil
    rescue SystemCallError
      nil
    end

    # Newest first, so the first date seen for a file is its latest.
    def commit_dates
      return {} if git("rev-parse", "--is-shallow-repository").to_s.strip != "false"

      dates = {}
      current = nil
      git("log", "--format=@%cI", "--name-only").to_s.each_line do |line|
        line = line.strip
        next if line.empty?

        if line.start_with?("@")
          current = Time.parse(line[1..])
        else
          dates[line] ||= current
        end
      end
      dates
    end

    def changed_files
      git("status", "--porcelain").to_s.each_line.map { |line| line[3..].to_s.strip.split(" -> ").last }.to_set
    end

    def expand(glob)
      Dir.glob(glob, base: @source)
    end
  end
end
