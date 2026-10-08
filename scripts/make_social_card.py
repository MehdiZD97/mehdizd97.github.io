#!/usr/bin/env python3
"""Render the default social card: the preview image when a page of the site
is shared (PLAN 9.4).

Usage (from the repo root):
    .venv/bin/python scripts/make_social_card.py

Fills the template _assets-src/social-card.svg with the name, title,
affiliation, and headline in _data/profile.yml and the site's address in
_config.yml, embeds the portrait (profile/mehdi-zafari, the largest JPEG the
image script made), renders it with the site's font (Bricolage Grotesque) in
the installed Google Chrome through Playwright, and saves
assets/img/social-card.jpg (1200 by 630). Run it again after changing the
template, the portrait, or those profile fields, then commit the image.
Requires Playwright, PyYAML, and Pillow in .venv, and Google Chrome.
"""

import base64
import html
import io
import sys
from pathlib import Path

import yaml
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "_assets-src" / "social-card.svg"
FONT = ROOT / "assets" / "fonts" / "bricolage-grotesque-latin-opsz-normal.woff2"
OUT = ROOT / "assets" / "img" / "social-card.jpg"


def split_headline(text: str, limit: int = 34) -> tuple[str, str]:
    """Two lines of about `limit` characters, broken between words."""
    words, first = text.split(), ""
    while words and len(f"{first} {words[0]}".strip()) <= limit:
        first = f"{first} {words.pop(0)}".strip()
    return first, " ".join(words)


def main() -> int:
    profile = yaml.safe_load((ROOT / "_data" / "profile.yml").read_text(encoding="utf-8"))
    config = yaml.safe_load((ROOT / "_config.yml").read_text(encoding="utf-8"))
    images = yaml.safe_load((ROOT / "_data" / "images.yml").read_text(encoding="utf-8"))

    portrait_name = profile["photo_image"]
    largest = images[portrait_name]["variants"][-1]["size"]
    portrait = ROOT / "assets" / "img" / f"{portrait_name}-{largest}.jpg"
    portrait_uri = "data:image/jpeg;base64," + base64.b64encode(portrait.read_bytes()).decode()
    font_uri = "data:font/woff2;base64," + base64.b64encode(FONT.read_bytes()).decode()

    line1, line2 = split_headline(profile["headline"])
    fields = {
        "{{PORTRAIT}}": portrait_uri,
        "{{NAME}}": html.escape(profile["name"]),
        "{{TITLE}}": html.escape(f"{profile['title']}, {profile['affiliation_short']}"),
        "{{HEADLINE_1}}": html.escape(line1),
        "{{HEADLINE_2}}": html.escape(line2),
        "{{URL}}": html.escape(config["url"].removeprefix("https://").removeprefix("http://")),
    }
    svg = TEMPLATE.read_text(encoding="utf-8")
    for key, value in fields.items():
        svg = svg.replace(key, value)
    page_html = (
        "<!doctype html><meta charset='utf-8'><style>"
        f"@font-face {{ font-family: 'Bricolage Grotesque'; src: url({font_uri}) format('woff2'); font-weight: 200 800; }}"
        "html, body { margin: 0; } svg { display: block; }"
        f"</style>{svg}"
    )

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        page.set_content(page_html)
        page.evaluate("() => document.fonts.ready.then(() => true)")
        page.wait_for_timeout(200)
        png = page.screenshot(clip={"x": 0, "y": 0, "width": 1200, "height": 630})
        browser.close()

    image = Image.open(io.BytesIO(png)).convert("RGB")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
