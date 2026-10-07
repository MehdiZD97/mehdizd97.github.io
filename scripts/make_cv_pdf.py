#!/usr/bin/env python3
"""Print the CV page (/cv/) to the PDF that the Download CV buttons link to.

Usage (from the repo root):
    .venv/bin/python scripts/make_cv_pdf.py

Builds the site for production into a temporary folder, serves it on a free
local port (never 4000), opens /cv/ in the installed Google Chrome through
Playwright, and saves the print version as a US Letter PDF with page numbers
at the path in `cv_pdf` (_data/profile.yml), normally
files/Mehdi_Zafari_CV.pdf. The print styles (_sass/shared/_print.scss) hide
the site's header, footer, buttons, and bio, and put the name and contact
block (_includes/print-identity.html) on top.

Run it after changing anything the CV shows (_data/profile.yml, _data/cv/,
awards, talks, publications), then commit the new PDF. A running
`jekyll serve` picks the file up on its own.
Requires Playwright and PyYAML in .venv, Bundler, and the installed Chrome.
"""

import functools
import http.server
import os
import subprocess
import sys
import tempfile
import threading
from pathlib import Path

import yaml
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
FOOTER = (
    '<div style="width: 100%; margin: 0 0.6in; display: flex; justify-content: space-between; '
    "font: 8px -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #5a6478;\">"
    '<span>{name}, CV</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>'
)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):  # keep the terminal clean
        pass


def main() -> int:
    profile = yaml.safe_load((ROOT / "_data" / "profile.yml").read_text(encoding="utf-8"))
    out = ROOT / profile["cv_pdf"].lstrip("/")

    with tempfile.TemporaryDirectory() as site:
        print("building the site (production) ...")
        env = dict(os.environ, JEKYLL_ENV="production")
        subprocess.run(["bundle", "exec", "jekyll", "build", "--quiet", "--destination", site], cwd=ROOT, env=env, check=True)

        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=site))
        port = server.server_address[1]
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(channel="chrome", headless=True)
                page = browser.new_page()
                page.goto(f"http://127.0.0.1:{port}/cv/", wait_until="networkidle")
                # Lazy images (the university logos) load only when needed; print them all.
                page.evaluate("() => document.querySelectorAll('img[loading=\"lazy\"]').forEach((img) => { img.loading = 'eager'; })")
                page.wait_for_function("() => [...document.images].every((img) => img.complete)")
                page.evaluate("() => document.fonts.ready.then(() => true)")
                page.emulate_media(media="print")
                out.parent.mkdir(parents=True, exist_ok=True)
                page.pdf(
                    path=str(out),
                    format="Letter",
                    print_background=True,
                    display_header_footer=True,
                    header_template="<span></span>",
                    footer_template=FOOTER.format(name=profile["name"]),
                    margin={"top": "0.55in", "bottom": "0.6in", "left": "0.6in", "right": "0.6in"},
                )
                browser.close()
        finally:
            server.shutdown()

    print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
