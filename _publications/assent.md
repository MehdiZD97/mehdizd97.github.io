---
title: "ASSENT: Learning-Based Association Optimization for Distributed Cell-Free ISAC"
authors: ["M. Zafari", "A. L. Swindlehurst"]
type: conference
status: published
venue: IEEE International Conference on Communications (ICC)
venue_short: ICC 2026
date: 2026-01-01              # CV: January 2026 (the IEEE record dates the conference May 24, 2026)
doi: 10.1109/icc59461.2026.11588026   # TODO(mehdi): confirm this DOI (found on Crossref on 2026-09-30; title and authors match)
arxiv: 2511.09992
code: https://github.com/LS-Wireless/ASSENT-CellFree-ISAC
featured: true
topics: [cell-free-isac, machine-learning]
bibtex: |
  @inproceedings{zafari2026assent,
    author    = {Zafari, Mehdi and Swindlehurst, A. Lee},
    title     = {{ASSENT}: Learning-Based Association Optimization for Distributed Cell-Free {ISAC}},
    booktitle = {ICC 2026 - IEEE International Conference on Communications},
    year      = {2026},
    month     = may,
    pages     = {1--6},
    publisher = {IEEE},
    doi       = {10.1109/icc59461.2026.11588026},
    url       = {https://doi.org/10.1109/icc59461.2026.11588026}
  }
redirect_from:
  - /publication/2025-11-C-5/
---
Integrated Sensing and Communication (ISAC) is a key emerging 6G technology.
Despite progress, ISAC still lacks scalable methods for joint AP clustering and user/target scheduling in distributed deployments under fronthaul limits.
Moreover, existing ISAC solutions largely rely on centralized processing and full channel state information, limiting scalability.
This paper addresses joint access point (AP) clustering, user and target scheduling, and AP mode selection in distributed cell-free ISAC systems operating with constrained fronthaul capacity.
We formulate the problem as a mixed-integer linear program (MILP) that jointly captures interference coupling, RF-chain limits, and sensing requirements, providing optimal but computationally demanding solutions.
To enable real-time and scalable operation, we propose ASSENT (ASSociation and ENTity selection), a graph neural network (GNN) framework trained on MILP solutions to efficiently learn association and mode-selection policies directly from lightweight link statistics.
Simulations show that ASSENT achieves near-optimal utility while accurately learning the underlying associations.
Additionally, its single forward pass inference reduces decision latency compared to optimization-based methods.
An open-source Python/PyTorch implementation with full datasets is provided to facilitate reproducible and extensible research in cell-free ISAC.
