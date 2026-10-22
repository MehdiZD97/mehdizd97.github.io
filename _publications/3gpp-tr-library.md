---
title: "3gpp-tr-library: Hand-verified, section-level 3GPP Technical Reports as queryable Markdown, CSV and YAML"
authors: ["M. Zafari"]
type: software
status: published
venue: GitHub repository and the tr3gpp Python package on PyPI, archived on Zenodo
venue_short: GitHub
date: 2026-08-04              # v0.2.0, the first release on PyPI and Zenodo (v0.1.0 was on GitHub, 2026-07-23)
doi: 10.5281/zenodo.21501655   # Zenodo's concept DOI: every version, resolving to the newest
code: https://github.com/MehdiZD97/3gpp-tr-library
package: https://pypi.org/project/tr3gpp/
topics: [channel-modeling, isac]
featured: false   # true shows it in Home's Selected publications
bibtex: |
  @misc{zafari20263gpp,
    author    = {Zafari, Mehdi},
    title     = {3gpp-tr-library: Hand-verified, section-level 3GPP Technical Reports as queryable Markdown, CSV and YAML},
    year      = {2026},
    publisher = {Zenodo},
    doi       = {10.5281/zenodo.21501655},
    url       = {https://doi.org/10.5281/zenodo.21501655}
  }
---
Hand-curated, section-level extracts of 3GPP Technical Reports, cross-checked against multiple independent source formats and published as coordinated Markdown, CSV and YAML plus a typed Python API (tr3gpp).
Covers TR 38.901 v19.4.0 clauses 7.4 (pathloss, LOS probability, O2I penetration), 7.5 (fast fading), 7.6 (additional modelling components) and 7.9 (ISAC), and TR 36.777 v15.0.0 Annex B (aerial-UE channel model).
The Python package installs with `pip install tr3gpp`.
