#!/usr/bin/env python3
"""List the newest uploads on the YouTube channel for the site (PLAN 10.3).

Usage (from the repo root):
    python3 scripts/fetch_videos.py
Options:
    --dry-run     print the file instead of writing it
    --feed FILE   read a saved copy of the feed instead of downloading it

Reads the channel's ID (`id` under `channel:` in _data/videos.yml), downloads
the channel's public feed (its 15 newest uploads; no key or account needed),
and writes them to _data/youtube.yml, which Git does not track. The site
shows them along with the videos in _data/videos.yml: an entry there wins
over the feed's (so its note and start time show), `skip:` there hides an
upload, and Shorts are left out. Dates are in the site's time zone, as
YouTube shows them to Mehdi; titles in Arabic script are marked as Persian.

GitHub runs it before every build and once a week, so a new upload reaches
the live site within a week. It never stops a build: when the feed cannot be
read, it says so, leaves the file as it was, and the site shows the videos
in _data/videos.yml. Standard library only. See GUIDE.md, "Add a video".
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "_data" / "videos.yml"
OUTPUT = ROOT / "_data" / "youtube.yml"
FEED = "https://www.youtube.com/feeds/videos.xml?channel_id={}"
AGENT = "mehdizd97.github.io fetch_videos.py (Python urllib)"
NS = {"atom": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015", "media": "http://search.yahoo.com/mrss/"}
ARABIC_SCRIPT = re.compile("[؀-ۿݐ-ݿﭐ-﷿ﹰ-ﻼ]")


def warn(message: str) -> None:
    # On GitHub, a ::warning:: line shows as a note on the workflow run.
    print(("::warning title=Latest videos::" if os.environ.get("GITHUB_ACTIONS") else "warning: ") + message)


def channel_id() -> str | None:
    text = VIDEOS.read_text(encoding="utf-8")
    block = re.search(r"^channel:[ \t]*(?:#.*)?\n((?:[ \t]+.*\n|[ \t]*\n)*)", text, re.M)
    found = block and re.search(r"^[ \t]+id:[ \t]*[\"']?(UC[A-Za-z0-9_-]{22})[\"']?[ \t]*(?:#.*)?$", block.group(1), re.M)
    return found.group(1) if found else None


def site_zone():
    found = re.search(r"^timezone:[ \t]*[\"']?([A-Za-z0-9_/+-]+)", (ROOT / "_config.yml").read_text(encoding="utf-8"), re.M)
    try:
        return ZoneInfo(found.group(1)) if found else timezone.utc
    except (ZoneInfoNotFoundError, ValueError):
        return timezone.utc


# YouTube's feed now and then answers 404 for a while (it did at the launch
# build on 2026-10-12), so the waits between tries cover about a minute.
WAITS = (5, 15, 40)


def download(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": AGENT})
    for attempt in range(len(WAITS) + 1):
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            problem = error
            if attempt < len(WAITS):
                time.sleep(WAITS[attempt])
    raise RuntimeError(f"could not download it after {len(WAITS) + 1} tries: {problem}")


def printable(ch: str) -> bool:
    # The characters YAML allows (YAML 1.1, as Jekyll reads it), minus the byte order mark.
    c = ord(ch)
    return c in (0x09, 0x0A, 0x0D) or 0x20 <= c <= 0x7E or 0xA0 <= c <= 0xD7FF or (0xE000 <= c <= 0xFFFD and c != 0xFEFF) or c >= 0x10000


def clean(text: str) -> str:
    """One line of text that YAML accepts between double quotes."""
    return " ".join("".join(ch for ch in text or "" if printable(ch)).split())


def summary(description: str, limit: int = 300) -> str:
    """The description's first line, cut at a word to at most `limit` characters."""
    first = next((clean(line) for line in (description or "").splitlines() if clean(line)), "")
    if len(first) <= limit:
        return first
    return first[: limit - 1].rsplit(" ", 1)[0].rstrip(",;:") + "…"


def parse(data: bytes, zone) -> tuple[list[dict], int]:
    if b"<!DOCTYPE" in data or b"<!ENTITY" in data:
        raise ValueError("the feed declares a DOCTYPE, which a YouTube feed never does")
    root = ET.fromstring(data)
    if root.tag != f"{{{NS['atom']}}}feed":
        raise ValueError("the reply is not an Atom feed")
    videos, shorts = [], 0
    for entry in root.findall("atom:entry", NS):
        vid = (entry.findtext("yt:videoId", "", NS) or "").strip()
        title = clean(entry.findtext("atom:title", "", NS))
        link = entry.find("atom:link[@rel='alternate']", NS)
        if link is not None and "/shorts/" in link.get("href", ""):
            shorts += 1  # Shorts are vertical; the site's cards are 16:9
            continue
        try:
            published = datetime.fromisoformat((entry.findtext("atom:published", "", NS) or "").strip())
        except ValueError:
            continue
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", vid) or not title:
            continue
        if published.tzinfo is None:
            published = published.replace(tzinfo=timezone.utc)
        video = {"id": vid, "title": title, "date": published.astimezone(zone).date()}
        if ARABIC_SCRIPT.search(title):
            video["language"] = "fa"
        text = summary(entry.findtext("media:group/media:description", "", NS))
        if text:
            video["description"] = text
        videos.append(video)
    return videos, shorts


def quote(text: str) -> str:
    # A JSON string is a valid YAML double-quoted string once clean() has run.
    return json.dumps(text, ensure_ascii=False)


def render(videos: list[dict], fetched) -> str:
    lines = [
        "# The channel's newest uploads, written by scripts/fetch_videos.py from its",
        "# public feed before every GitHub build. Git does not track this file, and",
        "# the script replaces it: to change how a video shows, add it to",
        "# _data/videos.yml (that entry wins), or list its id under `skip:` there.",
        f"fetched: {fetched.isoformat()}",
        "videos:" + ("" if videos else " []"),
    ]
    for video in videos:
        lines += [f"  - id: {quote(video['id'])}", f"    title: {quote(video['title'])}", f"    date: {video['date'].isoformat()}"]
        if "language" in video:
            lines.append(f"    language: {video['language']}")
        if "description" in video:
            lines.append(f"    description: {quote(video['description'])}")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="print the file instead of writing it")
    parser.add_argument("--feed", metavar="FILE", help="read a saved copy of the feed instead of downloading it")
    args = parser.parse_args()

    channel = channel_id()
    if not channel:
        warn("no channel `id` under `channel:` in _data/videos.yml, so only the videos listed there show")
        return 0
    zone = site_zone()
    try:
        data = Path(args.feed).read_bytes() if args.feed else download(FEED.format(channel))
        videos, shorts = parse(data, zone)
    except Exception as error:  # whatever happens, the build goes on with the curated videos
        warn(f"could not read the channel's feed ({error}); the site shows the videos in _data/videos.yml only")
        return 0

    text = render(videos, datetime.now(zone).date())
    if args.dry_run:
        print(text, end="")
        return 0
    temporary = OUTPUT.with_name(".youtube.yml.tmp")  # a dot file: Jekyll never reads it half-written
    temporary.write_text(text, encoding="utf-8")
    os.replace(temporary, OUTPUT)
    print(f"wrote {OUTPUT.relative_to(ROOT)}: {len(videos)} uploads" + (f" ({shorts} Shorts left out)" if shorts else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
