---
title: "Coordinated Decentralized Resource Optimization for Cell-Free ISAC Systems"
authors: ["M. Zafari", "R. Liu", "A. L. Swindlehurst"]
type: conference
status: published
venue: 59th Asilomar Conference on Signals, Systems, and Computers
venue_short: Asilomar 2025
date: 2025-10-26              # conference date in the IEEE record (the CV gives the year only)
doi: 10.1109/ieeeconf67917.2025.11443385
arxiv: 2508.01044
code: https://github.com/MehdiZD97/distributed-cellfree-isac
award: Best Paper Award Finalist
featured: true
topics: [cell-free-isac, distributed-optimization]
bibtex: |
  @inproceedings{zafari2025coordinated,
    author    = {Zafari, Mehdi and Liu, Rang and Swindlehurst, A. Lee},
    title     = {Coordinated Decentralized Resource Optimization for Cell-Free {ISAC} Systems},
    booktitle = {2025 59th Asilomar Conference on Signals, Systems, and Computers},
    year      = {2025},
    month     = oct,
    pages     = {912--917},
    publisher = {IEEE},
    doi       = {10.1109/ieeeconf67917.2025.11443385},
    url       = {https://doi.org/10.1109/ieeeconf67917.2025.11443385}
  }
redirect_from:
  - /publication/2025-08-C-4/
---
Integrated Sensing and Communication (ISAC) is emerging as a key enabler for 6G wireless networks, allowing the joint use of spectrum and infrastructure for both communication and sensing.
While prior ISAC solutions have addressed resource optimization, including power allocation, beamforming, and waveform design, they often rely on centralized architectures with full network knowledge, limiting their scalability in distributed systems.
In this paper, we propose two coordinated decentralized optimization algorithms for beamforming and power allocation tailored to cell-free ISAC networks.
The first algorithm employs locally designed fixed beamformers at access points (APs), combined with a centralized power allocation scheme computed at a central server (CS).
The second algorithm jointly optimizes beamforming and power control through a fully decentralized consensus ADMM framework.
Both approaches rely on local information at APs and limited coordination with the CS.
Simulation results obtained using our proposed Python-based simulation framework evaluate their fronthaul overhead and system-level performance, demonstrating their practicality for scalable ISAC deployment in decentralized, cell-free architectures.
