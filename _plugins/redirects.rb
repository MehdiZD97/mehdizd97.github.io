# frozen_string_literal: true

# Redirects into page sections (PLAN 4.5). jekyll-redirect-from's
# `redirect_from` cannot add a #fragment, so every entry in
# _data/redirects.yml (from, to) becomes a page with `redirect_to`, which
# jekyll-redirect-from then turns into a redirect stub (and lists in
# redirects.json). Runs before that plugin's generator.
module SiteRedirects
  class Generator < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      Array(site.data["redirects"]).each do |entry|
        from = entry["from"].to_s
        to = entry["to"].to_s
        raise ArgumentError, "_data/redirects.yml: an entry needs `from` and `to`" if from.empty? || to.empty?

        page = Jekyll::PageWithoutAFile.new(site, site.source, from, "index.html")
        page.data["permalink"] = from
        page.data["redirect_to"] = to
        page.data["sitemap"] = false
        site.pages << page
      end
    end
  end
end
