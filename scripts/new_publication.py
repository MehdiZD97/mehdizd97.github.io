#!/usr/bin/env python3
"""Start a publication file from its arXiv ID or DOI (PLAN 10.2).

Usage (from the repo root):
    python3 scripts/new_publication.py --arxiv 2609.12195
    python3 scripts/new_publication.py --doi 10.1109/TVT.2026.3656108
Options:
    --slug NAME   the file name and address (default: made from the title)
    --dry-run     print the file instead of writing it

Reads the paper's metadata from arXiv (title, authors, date, abstract,
category, any DOI or code link) or from Crossref (title, authors, venue,
date, abstract) plus the publisher's BibTeX, then writes
_publications/<slug>.md with every field of the site's schema: authors in
CV style ("M. Zafari"), the arXiv ID in quotes, and BibTeX laid out like the
other files. What it cannot know (the type of a preprint, the venue's short
name, the topics) gets a placeholder and a TODO(mehdi) note: the preview
builds with them, and the production build stops until they are answered.
Standard library only. See GUIDE.md, "Add a publication with the script".
"""

import argparse
import html
import json
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AGENT = "mehdizd97.github.io new_publication.py (Python urllib)"
ATOM = "{http://www.w3.org/2005/Atom}"
ARXIV = "{http://arxiv.org/schemas/atom}"
STOPWORDS = {"a", "an", "the", "of", "for", "in", "on", "and", "with", "to", "via", "from", "under", "by", "at", "its", "is", "are", "toward", "towards"}
PARTICLES = {"van", "von", "der", "den", "de", "del", "da", "di", "la", "le", "bin", "al"}


def fetch(url: str, accept: str = "", missing_ok: bool = False) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": AGENT, **({"Accept": accept} if accept else {})})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        if missing_ok and error.code == 404:
            return ""
        raise SystemExit(f"error: could not read {url} ({error}); check the ID and the internet connection")
    except (urllib.error.URLError, TimeoutError) as error:
        raise SystemExit(f"error: could not read {url} ({error}); check the ID and the internet connection")


def clean(text: str) -> str:
    return " ".join(html.unescape(text or "").split())


def ascii_fold(text: str) -> str:
    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()


def cv_name(given: str, family: str) -> str:
    """'A. Lee', 'Swindlehurst' -> 'A. L. Swindlehurst'; 'Jean-Pierre' -> 'J.-P.'."""
    initials = []
    for part in given.replace(".", ". ").split():
        pieces = [p for p in part.split("-") if p]
        initials.append("-".join(f"{p[0].upper()}." for p in pieces))
    return " ".join(initials + [family]).strip()


def split_name(full: str) -> tuple[str, str]:
    """'Mehdi Zafari' -> ('Mehdi', 'Zafari'); 'Kobus van der Merwe' -> ('Kobus', 'van der Merwe')."""
    words = full.split()
    if len(words) == 1:
        return "", words[0]
    cut = len(words) - 1
    while cut > 1 and words[cut - 1].lower() in PARTICLES:
        cut -= 1
    return " ".join(words[:cut]), " ".join(words[cut:])


def slug_from(title: str) -> str:
    head = title.split(":", 1)[0].strip()
    if ":" in title and len(head.split()) == 1:  # "CORDIS: A Scalable ..." -> cordis
        return re.sub(r"[^a-z0-9]+", "-", ascii_fold(head).lower()).strip("-")
    words = [w for w in re.findall(r"[a-z0-9]+", ascii_fold(title).lower()) if w not in STOPWORDS]
    return "-".join(words[:5])


def brace_acronyms(title: str) -> str:
    """Protects capitals from BibTeX styles: MIMO -> {MIMO}, Cell-Free stays."""
    return re.sub(r"\b([A-Za-z]*[A-Z][A-Za-z]*[A-Z][A-Za-z0-9]*)\b", r"{\1}", title)


ORDER = ["author", "title", "booktitle", "journal", "year", "month", "volume", "number", "pages", "publisher",
         "eprint", "archivePrefix", "primaryClass", "doi", "url"]
MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]


def month_macro(value: str) -> str:
    value = value.strip().lower()
    if value.isdigit() and 1 <= int(value) <= 12:
        return MONTHS[int(value) - 1]
    return value[:3] if value[:3] in MONTHS else ""


def bibtex(kind: str, key: str, fields: list[tuple[str, str]]) -> str:
    """The house layout: one field per line, aligned, in ORDER; month as a macro (jun)."""
    fields = sorted([(n, v) for n, v in fields if v], key=lambda f: ORDER.index(f[0]) if f[0] in ORDER else len(ORDER))
    width = max(len(name) for name, _ in fields)
    lines = []
    for name, value in fields:
        if name == "month":
            if month_macro(value):
                lines.append(f"  {name.ljust(width)} = {month_macro(value)}")
        else:
            if name == "pages":
                value = re.sub(r"(\d)\s*[-\u2013\u2014]+\s*(\d)", r"\1--\2", value)
            lines.append(f"  {name.ljust(width)} = {{{value}}}")
    return f"@{kind}{{{key},\n" + ",\n".join(lines) + "\n}"


def tidy_bibtex(raw: str) -> tuple[str, list[tuple[str, str]]]:
    """Reads a one-line BibTeX entry (as doi.org sends it) into its type and fields."""
    match = re.match(r"\s*@(\w+)\s*\{\s*([^,]*),(.*)\}\s*$", raw, re.S)
    if not match:
        return "", []
    kind, body = match.group(1).lower(), match.group(3)
    fields, i = [], 0
    while i < len(body):
        m = re.match(r"\s*,?\s*(\w+)\s*=\s*", body[i:])
        if not m:
            break
        name = m.group(1).lower()
        i += m.end()
        if i < len(body) and body[i] == "{":
            depth, start = 0, i
            while i < len(body):
                depth += {"{": 1, "}": -1}.get(body[i], 0)
                i += 1
                if depth == 0:
                    break
            value = body[start + 1:i - 1]
        else:
            m2 = re.match(r"\"([^\"]*)\"|([^,]+)", body[i:])
            value = (m2.group(1) or m2.group(2) or "").strip() if m2 else ""
            i += m2.end() if m2 else 1
        fields.append((name, " ".join(value.split())))
    return kind, fields


def key_for(authors: list[tuple[str, str]], year: str, title: str) -> str:
    """zafari2026cordis: the first author's family name, the year, and the title's first word."""
    family = re.sub(r"[^a-z]", "", ascii_fold(authors[0][1]).lower()) if authors else "paper"
    words = [w for w in re.findall(r"[a-z0-9]+", ascii_fold(title).lower()) if w not in STOPWORDS]
    return f"{family}{year}{words[0] if words else ''}"


def from_arxiv(arxiv_id: str) -> dict:
    feed = ET.fromstring(fetch(f"https://export.arxiv.org/api/query?id_list={urllib.parse.quote(arxiv_id)}"))
    entry = feed.find(f"{ATOM}entry")
    if entry is None or entry.find(f"{ATOM}title") is None or "Error" in (entry.findtext(f"{ATOM}title") or ""):
        raise SystemExit(f"error: arXiv has no paper {arxiv_id}")
    title = clean(entry.findtext(f"{ATOM}title"))
    names = [split_name(clean(a.findtext(f"{ATOM}name"))) for a in entry.findall(f"{ATOM}author")]
    published = entry.findtext(f"{ATOM}published")[:10]
    abstract = clean(entry.findtext(f"{ATOM}summary"))
    category = (entry.find(f"{ARXIV}primary_category").get("term") if entry.find(f"{ARXIV}primary_category") is not None else "")
    doi = clean(entry.findtext(f"{ARXIV}doi") or "")
    journal = clean(entry.findtext(f"{ARXIV}journal_ref") or "")
    comment = clean(entry.findtext(f"{ARXIV}comment") or "")
    code = next(iter(re.findall(r"https?://github\.com/[\w.-]+/[\w.-]+", f"{abstract} {comment}")), "")
    year = published[:4]
    bib = bibtex("misc", key_for(names, year, title), [
        ("author", " and ".join(f"{family}, {given}".strip(", ") for given, family in names)),
        ("title", brace_acronyms(title)),
        ("year", year),
        ("eprint", arxiv_id),
        ("archivePrefix", "arXiv"),
        ("primaryClass", category),
        ("url", f"https://arxiv.org/abs/{arxiv_id}"),
    ])
    return {
        "title": title,
        "authors": [cv_name(given, family) for given, family in names],
        "type": ("journal", "journal, magazine, conference, or software?"),
        "status": ("preprint", "preprint, under-review (then venue is where it is submitted), accepted, or published?"
                   + (f" arXiv lists DOI {doi}: running the script with --doi {doi} gives the publisher's details" if doi else "")),
        "venue": (journal or "arXiv", "the journal or conference" if not journal else "check the venue name"),
        "venue_short": ("", "a short label for the chip, such as IEEE TWC or ICC 2027"),
        "date": published,
        "doi": doi,
        "arxiv": arxiv_id,
        "code": code,
        "bibtex": bib,
        "abstract": abstract,
    }


def from_doi(doi: str) -> dict:
    """Crossref for papers; DataCite for DOIs Crossref does not know (datasets such as IEEE DataPort)."""
    date_note = ""
    crossref = fetch(f"https://api.crossref.org/works/{urllib.parse.quote(doi, safe='/')}", missing_ok=True)
    if crossref:
        work = json.loads(crossref)["message"]
        title = clean((work.get("title") or [""])[0])
        names = [(clean(a.get("given", "")), clean(a.get("family", ""))) for a in work.get("author", []) if a.get("family")]
        parts = next((work[k]["date-parts"][0] for k in ("published-print", "published-online", "issued") if work.get(k, {}).get("date-parts")), [])
        day = date(parts[0], parts[1] if len(parts) > 1 else 1, parts[2] if len(parts) > 2 else 1).isoformat() if parts else ""
        kind = {"journal-article": "journal", "proceedings-article": "conference", "dataset": "dataset", "posted-content": "journal"}.get(work.get("type"), "journal")
        venue = clean((work.get("container-title") or [""])[0]) or clean(work.get("publisher", ""))
        short = clean((work.get("short-container-title") or [""])[0])
        abstract = re.sub(r"^Abstract\s+", "", clean(re.sub(r"<[^>]+>", " ", work.get("abstract", ""))))
    else:
        record = fetch(f"https://api.datacite.org/dois/{urllib.parse.quote(doi, safe='/')}", missing_ok=True)
        if not record:
            raise SystemExit(f"error: neither Crossref nor DataCite knows the DOI {doi}")
        work = json.loads(record)["data"]["attributes"]
        title = clean((work.get("titles") or [{}])[0].get("title", ""))
        names = []
        for creator in work.get("creators", []):
            given, family = clean(creator.get("givenName", "")), clean(creator.get("familyName", ""))
            if not family:
                given, family = split_name(clean(creator.get("name", "")).replace(",", ""))
            if given.split() and given.split()[-1] == family:  # some records repeat the family name: "Mehdi Zafari", "Zafari"
                given = " ".join(given.split()[:-1])
            names.append((given, family))
        issued = next((d["date"] for d in work.get("dates", []) if d.get("dateType") in ("Issued", "Available", "Created")), "")
        day = issued[:10] if re.match(r"\d{4}-\d{2}-\d{2}", issued) else f"{work.get('publicationYear', '')}-01-01"
        if not re.match(r"\d{4}-\d{2}-\d{2}", issued):
            date_note = "the record gives only the year; use the publication date"
        kind = "dataset" if (work.get("types") or {}).get("resourceTypeGeneral") == "Dataset" else "software" if (work.get("types") or {}).get("resourceTypeGeneral") == "Software" else "journal"
        publisher = work.get("publisher")
        venue = clean(publisher.get("name", "") if isinstance(publisher, dict) else publisher or "")
        short = venue
        abstract = clean(re.sub(r"<[^>]+>", " ", next((d.get("description", "") for d in work.get("descriptions", []) if d.get("descriptionType") == "Abstract"), "")))
    raw = fetch(f"https://doi.org/{urllib.parse.quote(doi, safe='/')}", accept="application/x-bibtex", missing_ok=True)
    bib_kind, fields = tidy_bibtex(raw)
    keep = {"author", "title", "booktitle", "journal", "volume", "number", "pages", "year", "month", "publisher"}
    fields = [(n, v) for n, v in fields if n in keep and n != "author"] + [("doi", doi), ("url", f"https://doi.org/{doi}")]
    fields.append(("author", " and ".join(f"{family}, {given}".strip(", ") for given, family in names)))
    if kind == "dataset":
        fields = [(n, brace_acronyms(v) if n == "title" else v) for n, v in fields if n in {"author", "title", "publisher", "year", "doi", "url"}]
    year = day[:4]
    default_kind = {"conference": "inproceedings", "dataset": "misc", "software": "misc"}.get(kind, "article")
    bib = bibtex("misc" if kind == "dataset" else (bib_kind or default_kind), key_for(names, year, title), fields) if raw else ""
    return {
        "title": title,
        "authors": [cv_name(given, family) for given, family in names],
        "type": (kind, "journal, magazine, conference, dataset, or software? (from the DOI record)"),
        "status": ("published", ""),
        "venue": (venue, "check the venue name (for a conference, the CV's wording)" if kind == "conference" else ""),
        "venue_short": (short, "" if short else "a short label for the chip, such as IEEE TWC or ICC 2027"),
        "date": day,
        "date_note": date_note,
        "doi": doi,
        "arxiv": "",
        "code": "",
        "bibtex": bib,
        "abstract": abstract,
    }


def one_sentence_per_line(text: str) -> str:
    text = re.sub(r"(?<=[a-z0-9)])\.(?=[A-Z][a-z])", ". ", text.strip())  # "transmission.Dataset" -> two sentences
    return "\n".join(re.split(r"(?<=[.!?])\s+(?=[A-Z])", text))


def topic_ids() -> list[str]:
    text = (ROOT / "_data" / "topics.yml").read_text(encoding="utf-8")
    return re.findall(r"^-\s*id:\s*([\w-]+)", text, re.M)


def quote(text: str) -> str:
    return json.dumps(text, ensure_ascii=False)


def render(meta: dict) -> str:
    def field(name, value, note=""):
        line = f"{name}: {value}" if value != "" else f"{name}:"
        return f"{line}   # TODO(mehdi): {note}" if note else line

    kind, kind_note = meta["type"]
    status, status_note = meta["status"]
    venue, venue_note = meta["venue"]
    short, short_note = meta["venue_short"]
    lines = ["---",
             f"title: {quote(meta['title'])}",
             f"authors: [{', '.join(quote(a) for a in meta['authors'])}]",
             field("type", kind, kind_note),
             field("status", status, status_note),
             field("venue", quote(venue) if venue else "", venue_note),
             field("venue_short", quote(short) if short else "", short_note),
             field("date", meta["date"], meta.get("date_note", ""))]
    if meta["doi"]:
        lines.append(f"doi: {meta['doi']}")
    if meta["arxiv"]:
        lines.append(f"arxiv: {quote(meta['arxiv'])}")
    if meta["code"]:
        lines.append(f"code: {meta['code']}   # TODO(mehdi): found in the abstract; check it")
    lines.append(f"topics: []   # TODO(mehdi): ids from _data/topics.yml: {', '.join(topic_ids())}")
    lines.append("featured: false   # true shows it in Home's Selected publications")
    if meta["bibtex"]:
        lines.append("bibtex: |")
        lines += [f"  {line}" for line in meta["bibtex"].splitlines()]
    lines.append("---")
    lines.append(one_sentence_per_line(meta["abstract"]) if meta["abstract"] else "TODO(mehdi): the abstract, in Markdown (one sentence per line).")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--arxiv", help="the arXiv ID, such as 2609.12195")
    source.add_argument("--doi", help="the DOI, such as 10.1109/TVT.2026.3656108")
    parser.add_argument("--slug", help="the file name and address (lowercase words joined by hyphens)")
    parser.add_argument("--dry-run", action="store_true", help="print the file instead of writing it")
    args = parser.parse_args()

    if args.arxiv:
        arxiv_id = re.sub(r"^(https?://arxiv\.org/(abs|pdf)/|arxiv:)", "", args.arxiv.strip(), flags=re.I).removesuffix(".pdf")
        meta = from_arxiv(arxiv_id)
    else:
        doi = re.sub(r"^(https?://(dx\.)?doi\.org/|doi:)", "", args.doi.strip(), flags=re.I)
        meta = from_doi(doi)

    slug = args.slug or slug_from(meta["title"])
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug):
        raise SystemExit(f"error: the slug {slug!r} must be lowercase words joined by hyphens")
    path = ROOT / "_publications" / f"{slug}.md"
    text = render(meta)
    if args.dry_run:
        print(f"# would write {path.relative_to(ROOT)}\n")
        print(text, end="")
        return 0
    if path.exists():
        raise SystemExit(f"error: {path.relative_to(ROOT)} already exists; pick another name with --slug")
    path.write_text(text, encoding="utf-8")
    todos = text.count("TODO(mehdi)")
    print(f"wrote {path.relative_to(ROOT)} ({len(meta['authors'])} authors, {todos} TODO(mehdi) notes to answer)")
    print("next: answer the TODO(mehdi) notes, choose topics, check the BibTeX, and add a news item (GUIDE.md, section 3)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
