# Collects the TODO(mehdi) markers (YAML, HTML, and Liquid comments) in the
# site's content and templates into site.data["todos"], for the content
# review page at /dev/content/ (PLAN Stage 4). Each entry has the file (a
# path from the repo root), the line number, and the marker's text.
# Development builds only: /dev/ is not part of production builds.

module TodoCollector
  SOURCES = [
    "_config.yml",
    "_data/**/*.yml",
    "_publications/*.md",
    "_posts/*.md",
    "_pages/*",
    "_includes/**/*.html",
    "_layouts/*.html",
    "_assets-src/*.yml",
  ].freeze
  SKIP = %r{\A_includes/styleguide/}

  class Generator < Jekyll::Generator
    safe true
    priority :highest

    def generate(site)
      return if Jekyll.env == "production"

      todos = []
      SOURCES.each do |pattern|
        Dir.glob(File.join(site.source, pattern)).sort.each do |path|
          next unless File.file?(path)

          file = path.delete_prefix("#{site.source}/")
          next if file.match?(SKIP)

          File.foreach(path, encoding: "UTF-8").with_index(1) do |line, number|
            next unless line.include?("TODO(mehdi)")

            text = line[/TODO\(mehdi\):?\s*(.*)$/, 1].to_s.sub(/\s*(-->|%\}|\}\})\s*\z/, "").strip
            todos << { "file" => file, "line" => number, "text" => text }
          end
        end
      end
      site.data["todos"] = todos
    end
  end
end
