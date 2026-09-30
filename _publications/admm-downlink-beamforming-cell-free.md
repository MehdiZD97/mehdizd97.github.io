---
title: "ADMM for Downlink Beamforming in Cell-Free Massive MIMO Systems"
authors: ["M. Zafari", "D. Pandey", "R. Doost-Mohammady", "C. A. Uribe"]
type: conference
status: published
venue: 58th Asilomar Conference on Signals, Systems, and Computers
venue_short: Asilomar 2024
date: 2024-10-27              # conference date in the IEEE record (the CV gives the year only)
doi: 10.1109/IEEECONF60004.2024.10943106
arxiv: 2409.06106
topics: [distributed-optimization, cell-free]
bibtex: |
  @inproceedings{zafari2024admm,
    author    = {Zafari, Mehdi and Pandey, Divyanshu and Doost-Mohammady, Rahman and Uribe, C{\'e}sar A.},
    title     = {{ADMM} for Downlink Beamforming in Cell-Free Massive {MIMO} Systems},
    booktitle = {2024 58th Asilomar Conference on Signals, Systems, and Computers},
    year      = {2024},
    month     = oct,
    pages     = {623--628},
    publisher = {IEEE},
    doi       = {10.1109/IEEECONF60004.2024.10943106},
    url       = {https://doi.org/10.1109/IEEECONF60004.2024.10943106}
  }
redirect_from:
  - /publication/2024-05-C-3/
---
In cell-free massive MIMO systems with multiple distributed access points (APs) serving multiple users over the same time-frequency resources, downlink beamforming is done through spatial precoding.
Precoding vectors can be optimally designed to use the minimum downlink transmit power while satisfying a quality-of-service requirement for each user.
However, existing centralized solutions to beamforming optimization pose challenges such as high communication overhead and processing delay.
On the other hand, distributed approaches either require data exchange over the network that scales with the number of antennas or solve the problem for cellular systems where every user is served by only one AP.
In this paper, we formulate a multi-user beamforming optimization problem to minimize the total transmit power subject to per-user SINR requirements and propose a distributed optimization algorithm based on the alternating direction method of multipliers (ADMM) to solve it.
In our method, every AP solves an iterative optimization problem using its local channel state information.
APs only need to share a real-valued vector of interference terms with the size of the number of users.
Through simulation results, we demonstrate that our proposed algorithm solves the optimization problem within tens of ADMM iterations and can effectively satisfy per-user SINR constraints.
