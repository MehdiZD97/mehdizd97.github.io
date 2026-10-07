# Updating the website: a step-by-step guide

This guide explains how to add or change anything on the site: a publication, a news item, a talk, a video, an award, the CV, a story with photos, and the CV PDF.

The site is built by Jekyll from plain text files.
You never edit the page templates to add content: every fact lives in a data file (YAML) or a Markdown file, and the pages are built from them.
This file itself is not published.

## Contents

1. [Where things live](#1-where-things-live)
2. [Before you start: preview and the rules of YAML](#2-before-you-start-preview-and-the-rules-of-yaml)
3. [Add a news item](#3-add-a-news-item)
4. [Add a publication](#4-add-a-publication)
5. [Update a publication (accepted, published, new links)](#5-update-a-publication-accepted-published-new-links)
6. [Add a dataset or a software release](#6-add-a-dataset-or-a-software-release)
7. [Add a talk](#7-add-a-talk)
8. [Add a video](#8-add-a-video)
9. [Add an award](#9-add-an-award)
10. [Update the CV](#10-update-the-cv)
11. [Update the CV PDF](#11-update-the-cv-pdf)
12. [Update your profile, links, and photo](#12-update-your-profile-links-and-photo)
13. [Add a story with photos](#13-add-a-story-with-photos)
14. [Change what the home page shows](#14-change-what-the-home-page-shows)
15. [Check your change and publish it](#15-check-your-change-and-publish-it)

---

## 1. Where things live

| What | File | Shown on |
|---|---|---|
| News | `_data/news.yml` | Home (newest 5) and the News page, `/news/` (all, by year) |
| Publications, datasets, software | `_publications/<slug>.md` (one file each) | Home's "Selected publications" (featured ones), Publications, the CV, and a page for each |
| Talks | `_data/talks.yml` | Home (newest 3) and the CV |
| Videos | `_data/videos.yml` | Home (newest 6) and the Videos page |
| Honors and awards | `_data/awards.yml` | Home (those with `home: true`) and the CV |
| Name, title, intro, bio, links | `_data/profile.yml` | Everywhere (hero, footer, CV) |
| Education | `_data/cv/education.yml` | Home and the CV |
| Experience | `_data/cv/experience.yml` | Home (the one-line summaries) and the CV (all bullets) |
| Skills, service, teaching, coursework, conferences | `_data/cv/skills.yml`, `service.yml`, `teaching.yml`, `coursework.yml`, `conferences.yml` | The CV (teaching also on Home) |
| Publication topics | `_data/topics.yml` | Publications (topic filters) |
| Stories (posts with photos) | `_posts/YYYY-MM-DD-<name>.md` | Their own pages, listed at the end of `/news/` and linked from news and talks |
| Original photos | `_assets-src/images/` and `_assets-src/images.yml` | Turned into web images by a script |
| The CV PDF | `files/Mehdi_Zafari_CV.pdf` | The "Download CV (PDF)" buttons |
| Menu | `_data/navigation.yml` | The header |
| Site settings (how many items Home shows, style) | `_config.yml` | |

---

## 2. Before you start: preview and the rules of YAML

### Preview while you edit

In a terminal, from the repository folder:

```bash
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000. Pages refresh by themselves when you save a file.
Stop the server with Ctrl+C. Restart it after you change `_config.yml` or anything in `_plugins/`.

The page http://localhost:4000/dev/content/ shows every data file and every publication field in tables, which is handy for checking your edits. It exists only on your computer, never on the live site.

### The rules of YAML (the `.yml` files and the top of each `.md` file)

- Indent with **two spaces**, never tabs. Items of a list start with `- `.
- Dates are written `YYYY-MM-DD`. When you know only the month, use day `01` (for example `2026-10-01`); the site shows month and year.
- Put text in double quotes when it contains a colon followed by a space (`title: "CORDIS: A Scalable ..."`) or starts with a special character such as `@`, `*`, `[`, or `{`.
- A line that starts with `#` is a comment: the site ignores it. Comments are a good place for notes to yourself.
- In news text and in experience bullets you can use Markdown: `**bold**`, `*italic*`, and links `[text](https://...)`.
- Internal links start with `/` (for example `/publications/assent/`); external links start with `https://`.
- Lists are shown in the order of the file, newest first. Add new entries **at the top** (right below the header comments).

If the preview stops updating or shows an error in the terminal, the message usually names the file and line with the problem (often a missing space after a colon, a tab, or a missing quote).

---

## 3. Add a news item

1. Open `_data/news.yml`.
2. Add a new entry at the top of the list (below the comments), newest first:

   ```yaml
   - date: 2026-10-01
     type: paper
     text: Our paper **Example** was accepted to IEEE ICC 2027.
     pub: example-slug
   ```

3. Choose the `type`; it sets the icon: `paper`, `award`, `talk`, `career`, `video`, `release`, `service`, or `milestone`.
4. Optional links (the site adds a short link after the text):
   - `pub: <slug>`: the publication's page ("Read the paper"). The slug is the publication's file name without `.md`.
   - `story: /posts/2026/10/my-story/`: a story ("Read the story").
   - `url: https://...` and `url_label: Watch the video`: any other link.
   - `talk: <talk id>`: used only when there is no other link; it points to the talk in the CV.
5. Optional: `pin: true` keeps the item on Home even after newer items push it down.
6. Save and check Home (it shows the newest 5 items) and `/news/` (it shows all of them, grouped by year).

---

## 4. Add a publication

Each publication is one file in `_publications/`. Its file name is its **slug**, which becomes its address: `_publications/cordis.md` is shown at `/publications/cordis/`.

1. Pick a slug: short, lowercase, words joined by hyphens, for example `cordis` or `robust-wildfire-forecasting`. For a paper under review, leave the venue out of the slug (the venue may change). Do not rename a published slug later; if you ever must, add the old address under `redirect_from` (see step 4).
2. Create `_publications/<slug>.md` by copying an existing file of the same kind (for example `cordis.md` for a journal paper under review, `assent.md` for a published conference paper), or start from this template:

   ```yaml
   ---
   title: "Paper Title in Its Published Case"
   authors: ["M. Zafari", "B. Ottersten", "A. L. Swindlehurst"]
   type: journal
   status: under-review
   venue: IEEE Transactions on Wireless Communications
   venue_short: IEEE TWC
   date: 2026-10-01
   arxiv: 2610.12345
   code: https://github.com/LS-Wireless/Example
   featured: true
   topics: [cell-free-isac, distributed-optimization]
   bibtex: |
     @misc{zafari2026example,
       author        = {Zafari, Mehdi and Ottersten, Bj{\"o}rn and Swindlehurst, A. Lee},
       title         = {Paper Title in Its Published Case},
       year          = {2026},
       eprint        = {2610.12345},
       archivePrefix = {arXiv},
       primaryClass  = {eess.SP},
       url           = {https://arxiv.org/abs/2610.12345}
     }
   ---
   The abstract, in Markdown. One sentence per line makes later edits easy.
   ```

3. Fill in the fields:

   | Field | What to write |
   |---|---|
   | `title` | The title exactly as published (keep its capitalization), in double quotes. |
   | `authors` | A list in CV style: initials, then the last name. Your name (`M. Zafari`) is set in bold automatically. |
   | `type` | `journal`, `magazine`, `conference`, `dataset`, or `software`. This decides the group it appears in. |
   | `status` | `published`, `accepted`, `under-review`, or `preprint`. Under review shows "Submitted to (venue)" and an "Under review" badge; accepted shows an "Accepted" badge. |
   | `venue` | The full venue name, for example `IEEE International Conference on Communications (ICC)`. |
   | `venue_short` | A short label for the chip, for example `ICC 2027` or `IEEE TWC`. |
   | `date` | Used for sorting. Published items show the year only; the others show the month and year. |
   | `doi` | Optional. The DOI only, for example `10.1109/TVT.2026.3656108`. The button label comes from the DOI: IEEE DOIs show "IEEE Xplore", IEEE DataPort DOIs show "IEEE DataPort", any other shows "DOI". |
   | `arxiv` | Optional. The arXiv ID only, for example `2609.12195`. |
   | `code`, `pdf`, `slides`, `poster`, `dataset` | Optional links. `pdf`, `slides`, and `poster` can be files you put in `files/` (for example `/files/slides/example.pdf`) or full URLs. |
   | `video` | Optional. A YouTube video ID (the part after `watch?v=`). |
   | `award` | Optional, for example `Best Paper Award Finalist`. Shows a badge. |
   | `featured` | `true` shows the paper in Home's "Selected publications". |
   | `topics` | Ids from `_data/topics.yml`. To add a topic, add an `id` and `label` there. |
   | `bibtex` | The citation. Indent every line of it by two spaces under `bibtex: |`. |

   The link buttons always appear in the same order (PDF, arXiv, IEEE Xplore or DOI, Code, Slides, Video, Poster, Dataset), and only for the fields you fill in.

4. Getting the BibTeX:
   - Published paper with a DOI: run `curl -LH "Accept: application/x-bibtex" https://doi.org/<doi>` in a terminal and paste the result. Tidy it the way the other files do (one field per line, page ranges written `100--110`).
   - Preprint: arXiv's "Export BibTeX citation" link on the paper's page gives an entry like the one in the template.
5. Write the abstract below the second `---` line.
6. Optional: add a news item for it (section 3) with `pub: <slug>`.
7. Save, then check `/publications/`, the new page `/publications/<slug>/`, and Home if it is featured.

---

## 5. Update a publication (accepted, published, new links)

Open the publication's file in `_publications/` and change only what changed:

- **Accepted:** set `status: accepted`, update `venue` and `venue_short`, and set `date` to the acceptance month.
- **Published:** set `status: published`, add the `doi`, update `venue`, `venue_short`, and `date`, and replace the `bibtex` with the publisher's (section 4, step 4).
- **New link** (code, slides, video): add the field.
- **Award:** add `award: Best Paper Award` (and add it to `_data/awards.yml` too, section 9).
- **Stop featuring it on Home:** set `featured: false` or delete the line.

Add a news item if the change is news (section 3).

---

## 6. Add a dataset or a software release

Same steps as a publication (section 4), with:

```yaml
---
title: "Name of the Dataset or Repository"
authors: ["M. Zafari"]
type: software           # or dataset
status: published
venue: GitHub repository # or IEEE DataPort
venue_short: GitHub
date: 2026-10-01
code: https://github.com/MehdiZD97/example   # for software; datasets use doi or dataset
topics: [cell-free-isac]
---
One or two sentences about it. You can link its paper: [Paper title](/publications/<slug>/).
```

A `bibtex` field is optional for software.

---

## 7. Add a talk

1. Open `_data/talks.yml`. (Drafts for your MILCOM 2026, ICC 2026, and Showcase talks are near the top, commented out: remove the `# ` at the start of their lines and fill in the blanks.)
2. Add an entry at the top of the list, newest first:

   ```yaml
   - id: icc-2027
     date: 2027-06-01
     title: "ASSENT: Learning-Based Association Optimization for Distributed Cell-Free ISAC"
     kind: Lecture
     event: IEEE International Conference on Communications (ICC 2027)
     location: Montreal, Canada
     event_url: https://...
     pub: assent
   ```

3. Fields:
   - `id`: unique, lowercase with hyphens (it becomes the anchor `/cv/#icc-2027`).
   - `kind`: `Lecture`, `Poster`, `Invited talk`, `Workshop talk`, `Competition talk`, `Project presentation`, or `Demo`.
   - Optional: `pub` (publication slug: shows a Paper button), `slides` (`/files/slides/<file>.pdf` or a URL), `video` (YouTube ID) and `video_start` (seconds into the video where your part starts), `story` (a story's address), `note` (one short line, for example "Best Paper Award finalist.").
4. Only presentations go here. A conference you attended without presenting can be a news item (`type: milestone`) and a line in `_data/cv/conferences.yml`.
5. Home shows the newest 3 talks; the CV shows all.

---

## 8. Add a video

1. Open `_data/videos.yml`.
2. Add an entry at the top of `videos:` (newest first, by upload date). Note the indentation: entries under `videos:` are indented by two spaces.

   ```yaml
     - id: AbCdEfGhIjK
       title: "Exact title on YouTube"
       date: 2026-10-05
       duration: PT12M34S
       note: Tutorial
       description: One or two sentences about the video.
   ```

3. Fields:
   - `id`: the part after `watch?v=` in the video's address.
   - `date`: the upload date YouTube shows.
   - `duration` (optional): `PT12M34S` means 12 minutes 34 seconds; `PT1H2M41S` means 1 hour 2 minutes 41 seconds. It shows on the thumbnail.
   - `note`: the short line under the title on the card.
   - Optional: `language: fa` for a video not in English; `host: { name: Danesh Academy, url: "https://www.youtube.com/@Daaneshacademy" }` when the video is on someone else's channel (the card says "published on ..."); `start: 3727` when your part starts later in a longer video (in seconds), with `source_title` set to that video's title.
4. Optional: add a news item (`type: video`, `url: /videos/`).
5. Home shows the newest 6 videos; the Videos page shows all.

---

## 9. Add an award

1. Open `_data/awards.yml`.
2. Add an entry in the right place (newest first):

   ```yaml
   - year: 2027
     date: 2027-03-01
     title: Name of the Award
     org: Who gave it
     home: true
   ```

3. Fields:
   - `home: true` also shows it in the CV section on Home (leave it out to show it only on the full CV).
   - Optional: `detail` (one line under it), `pub` (a publication slug: the title links to the paper), `talk` (a talk id), `url` (any link), and `years: 2022, 2023` for an award received more than once.
4. Optional: add a news item (`type: award`).

---

## 10. Update the CV

All CV sections are in `_data/cv/` (and the research interests in `_data/profile.yml`). The full CV page is `/cv/`; Home shows a summary.

- **Education** (`education.yml`): `degree`, `field`, `school`, `school_short`, `location`, `start`, `end`, `expected: true` while in progress, `gpa`, `advisor` or `thesis`, and `logo` (the name of the logo image, for example `uci`).
- **Experience** (`experience.yml`), in the order you want it shown:

  ```yaml
  - title: Job Title
    org: Organization
    unit: Department or lab (optional)
    location: City, ST
    where: Short label, City
    start: 2027-01-01
    end:                     # leave empty while it is your current role ("present")
    summary: One line for Home, in the words of your CV.
    bullets:
      - What you did, as on your CV
      - Another bullet
    extra:                   # optional bullets shown only on the web CV
      - A detail
    supervisor: Prof. Name   # optional
  ```

  A role without a `summary` appears only on the full CV, not on Home.
- **Skills** (`skills.yml`): each `group` has a list of `items`.
- **Service** (`service.yml`): your reviewing; add a venue with `- { name: IEEE ..., short: ... }`.
- **Teaching** (`teaching.yml`): `course`, optional `code` (for example `EECS 160A/LA`), `term`, `institution`, `role`.
- **Coursework** (`coursework.yml`): `term`, `course`, `grade`, `institution`.
- **Conferences attended** (`conferences.yml`): `event`, `dates` (a list), `location`.

After any CV change, refresh the CV PDF (section 11).

---

## 11. Update the CV PDF

The "Download CV (PDF)" buttons link to `files/Mehdi_Zafari_CV.pdf`, which is the `/cv/` page printed to PDF. After you change anything the CV shows (the files in `_data/cv/`, awards, talks, publications, or the profile), make a new PDF:

```bash
.venv/bin/python scripts/make_cv_pdf.py
```

The script builds the site, prints `/cv/` in Chrome (US Letter, with page numbers, without the site's menu, buttons, and bio, and with your name and contacts on top), and replaces the PDF. Open it to check it, then commit it with your other changes.

The scripts need the Python environment in `.venv/` (already set up on your Mac). On a new computer: `python3 -m venv .venv`, then `.venv/bin/pip install pillow pyyaml playwright`. Google Chrome must be installed.

---

## 12. Update your profile, links, and photo

Open `_data/profile.yml`:

- `title`, `affiliation_short`, `headline`, `intro` (the hero sentence, first person), and `bio` (two paragraphs, third person, on the CV page).
- `interests`: the research interests groups on the CV.
- `links`: the profile icons in the hero and footer, in this order. Each has an `id` (it picks the icon: `google-scholar`, `orcid`, `github`, `linkedin`, `researchgate`, `youtube`), a `label`, and a `url`. Add `footer_only: true` to show a link only in the footer (ResearchGate has it), not in the hero or on the printed CV.
- To change the portrait: put the new original in `_assets-src/images/` (at least 1200 px on the short side), point `profile/mehdi-zafari` in `_assets-src/images.yml` to it with `src:`, and run the image script (section 13, step 3).

---

## 13. Add a story with photos

Stories are longer write-ups with photos, linked from news items and talks.

1. **Photos:** copy the originals into `_assets-src/images/stories/` (create the folder if needed). Originals are never published; the site uses smaller copies.
2. **Describe each photo** in `_assets-src/images.yml` (at the end of the file):

   ```yaml
   stories/my-event-2027:
     src: images/stories/IMG_1234.jpg
     widths: [480, 800, 1200, 1600]
     fallback: 800
   ```

   Use `widths: [320, 480, 640]` and `fallback: 480` for a portrait photo shown next to a landscape one.
3. **Make the web images:**

   ```bash
   .venv/bin/python scripts/optimize_images.py
   ```

   It writes AVIF, WebP, and JPEG copies to `assets/img/stories/` and removes the photo's location data.
4. **Write the story:** create `_posts/2027-03-15-my-event.md`:

   ```markdown
   ---
   title: Lecture presentation at Example 2027
   date: 2027-03-15
   permalink: /posts/2027/03/my-event/
   description: "One sentence of 140 to 160 characters that summarizes the story for search results and link previews; count the characters before you save it."
   image: /assets/img/stories/my-event-2027-1200.jpg
   image_alt: What the photo shows
   ---

   The first paragraph.

   <figure>
     {% include responsive-image.html name="stories/my-event-2027" alt="What the photo shows" sizes="(min-width: 48rem) 42rem, calc(100vw - 2rem)" %}
   </figure>

   More text. One sentence per line is fine.

   ## Related links

   - Conference paper: [Paper title](/publications/<slug>/)
   ```

   For two photos side by side (a portrait and a landscape):

   ```html
   <div class="figure-row">
     {% include responsive-image.html name="stories/photo-portrait" alt="..." sizes="(min-width: 48rem) 15rem, 36vw" %}
     {% include responsive-image.html name="stories/photo-landscape" alt="..." sizes="(min-width: 48rem) 27rem, 64vw" %}
   </div>
   ```

5. Link it: add `story: /posts/2027/03/my-event/` to the matching news item or talk. Every story is also listed under "Stories" at the end of `/news/`.

---

## 14. Change what the home page shows

- **How many** news items, talks, and videos: `home:` in `_config.yml` (`news: 5`, `talks: 3`, `videos: 6`). Restart the preview server after editing `_config.yml`.
- **Which publications** ("Selected publications"): `featured: true` in a publication's file. The "View publications" button in the hero scrolls there; "Full list of publications" opens `/publications/`.
- **Which awards:** `home: true` in `_data/awards.yml`.
- **Which roles:** roles with a `summary` in `_data/cv/experience.yml`.
- **Keep an older news item on Home:** `pin: true` on it.
- **The site's style:** `design: cooperative` (blue, the current style) or `design: instrument` (navy and amber) in `_config.yml`.

---

## 15. Check your change and publish it

1. Look at the pages you changed in the preview (http://localhost:4000), on a narrow window too. The table page http://localhost:4000/dev/content/ shows every data field.
2. Optional, a full check of the built site:

   ```bash
   JEKYLL_ENV=production bundle exec jekyll build
   ```

   It should finish without errors or warnings.
3. Commit your changes (for example `chore: add ICC 2027 paper and news`) on your working branch, then merge into `master`. GitHub Actions builds the site from `master` and publishes it in a few minutes; the Actions tab on GitHub shows the progress and any error.
