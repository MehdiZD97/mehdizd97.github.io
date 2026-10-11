# mehdizd97.github.io

The academic website of Mehdi Zafari, Ph.D. Candidate, UC Irvine: news, publications, CV, and videos on signal processing and AI/ML for next-generation (5G/6G) wireless systems.

Live site: https://mehdizd97.github.io

## How it is built

- [Jekyll](https://jekyllrb.com/) 4.4 on Ruby 3.4.8 (pinned in `.ruby-version`), with Dart Sass and the plugins jekyll-feed, jekyll-sitemap, and jekyll-redirect-from. Small plugins in `_plugins/` check the content at every build, date the pages from Git for the sitemap, turn `_data/redirects.yml` into redirects, and keep the development pages (`/dev/`) out of the live site.
- Facts live in data files, never in templates: `_data/` (profile, news, talks, awards, videos, the CV sections), `_publications/` (one file per paper, dataset, or software release), and `_posts/` (stories).
- Two complete visual styles share all markup: Cooperative (the live one) and Instrument. `design` in `_config.yml` picks one; `/dev/styleguide/` shows both.
- GitHub Actions builds every push to `master` and `developer`, checks links and images with html-proofer, and deploys `master` to GitHub Pages. Each build first reads the YouTube channel's newest uploads into the Videos list, and a weekly scheduled build keeps them current.

## Local development

1. Install Ruby 3.4.8 (for example with `rbenv install 3.4.8`) and Bundler.
2. Install the gems:

   ```bash
   bundle install
   ```

3. Start the preview and open http://localhost:4000:

   ```bash
   bundle exec jekyll serve --livereload
   ```

The local-only pages `/dev/content/` (every data field in tables) and `/dev/styleguide/` (the design system) help when editing.

## Updating the site

[GUIDE.md](GUIDE.md) has step-by-step recipes for every kind of update: news, publications, datasets and software, talks, videos, awards, the CV and its PDF, the profile, stories, and what to do when the build stops.

## Scripts

| Script | What it does |
|---|---|
| `scripts/new_publication.py` | Starts a publication file from an arXiv ID or a DOI (standard library only). |
| `scripts/fetch_videos.py` | Lists the YouTube channel's newest uploads in `_data/youtube.yml`, which Git ignores (standard library only; GitHub runs it before every build). |
| `scripts/optimize_images.py` | Makes the web images (AVIF, WebP, JPEG, PNG) from the originals in `_assets-src/images/`. |
| `scripts/make_cv_pdf.py` | Prints `/cv/` to `files/Mehdi_Zafari_CV.pdf`. |
| `scripts/make_social_card.py` | Renders the preview image shown when a page is shared. |

The other scripts need a Python virtual environment in `.venv/` with Pillow, PyYAML, and Playwright, and Google Chrome (GUIDE.md, section 11).

## License

The code (templates, styles, scripts, plugins, and configuration) is under the MIT License. The content (text, data, publications, the CV, photos, and the monogram) is copyright Mehdi Zafari, all rights reserved. Details in [LICENSE](LICENSE); fonts, icons, and logos from others are listed in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
