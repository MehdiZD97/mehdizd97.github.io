---
title: "CORDIS: A Scalable Coordinated Resource Allocation Framework for Distributed Cell-Free ISAC"
authors: ["M. Zafari", "B. Ottersten", "A. L. Swindlehurst"]
type: journal
status: under-review
venue: IEEE Transactions on Wireless Communications
venue_short: IEEE TWC
date: 2026-07-01              # CV: submitted July 2026
arxiv: 2609.12195
code: https://github.com/LS-Wireless/CORDIS
featured: true
topics: [cell-free-isac, distributed-optimization]
bibtex: |
  @misc{zafari2026cordis,
    author        = {Zafari, Mehdi and Ottersten, Bj{\"o}rn and Swindlehurst, A. Lee},
    title         = {{CORDIS}: A Scalable Coordinated Resource Allocation Framework for Distributed Cell-Free {ISAC}},
    year          = {2026},
    eprint        = {2609.12195},
    archivePrefix = {arXiv},
    primaryClass  = {eess.SP},
    url           = {https://arxiv.org/abs/2609.12195}
  }
---
Integrated Sensing and Communication (ISAC) is envisioned as a key technology for 6G wireless networks, enabling the joint use of spectrum and hardware for sensing and communication.
In multi-static cell-free architectures, coordinating beamforming and power resources across distributed access points (APs) is critical in order to mitigate severe communication-sensing interference.
Most existing ISAC resource allocation solutions rely on centralized architectures with full network knowledge, which limits their scalability and practicality in distributed cell-free deployments with imperfect channel state information (CSI).
In this paper, we introduce a framework for COordinated Resource allocation for Distributed ISAC Systems (CORDIS) that optimizes network sensing while suppressing clutter and maintaining per-user communication performance constraints.
Two algorithms are developed: CORDIS-Split, a low-overhead scheme that pairs fixed local beamformers with centralized power allocation, and CORDIS-ADMM, which jointly optimizes beamforming and power through the consensus Alternating Direction Method of Multipliers (ADMM).
By localizing high-dimensional matrix operations, both algorithms ensure fronthaul overhead and per-AP computation remain independent of antenna and AP counts.
Simulations demonstrate that CORDIS-ADMM approaches the centralized performance bound and degrades gracefully under CSI estimation error, remaining effective even with locally rank-deficient channels, while CORDIS-Split offers a minimal-overhead alternative.
These results confirm that CORDIS is a scalable and communication-efficient foundation for robust ISAC in decentralized wireless networks.
