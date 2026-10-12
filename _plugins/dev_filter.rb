# frozen_string_literal: true

# Keeps development pages out of the live site (PLAN 3.9): production builds
# (JEKYLL_ENV=production, as in CI) drop every page and file under /dev/,
# such as the style guide. Development builds keep them.
Jekyll::Hooks.register :site, :post_read do |site|
  next unless Jekyll.env == "production"

  under_dev = ->(item) { item.url.start_with?("/dev/") }
  site.pages.reject!(&under_dev)
  site.static_files.reject!(&under_dev)
end
