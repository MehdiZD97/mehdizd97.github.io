---
title: "An Analytical and Experimental Study of Distributed Uplink Beamforming in the Presence of Carrier Frequency Offsets"
authors: ["M. Zafari", "D. Pandey", "R. Doost-Mohammady"]
type: journal
status: published
venue: IEEE Transactions on Vehicular Technology
venue_short: IEEE TVT
date: 2026-01-01              # CV: January 2026 (the print issue is July 2026, vol. 75, no. 7)
doi: 10.1109/TVT.2026.3656108
arxiv: 2508.08506
featured: true
topics: [experimental, distributed-beamforming]
bibtex: |
  @article{zafari2026analytical,
    author  = {Zafari, Mehdi and Pandey, Divyanshu and Doost-Mohammady, Rahman},
    title   = {An Analytical and Experimental Study of Distributed Uplink Beamforming in the Presence of Carrier Frequency Offsets},
    journal = {IEEE Transactions on Vehicular Technology},
    year    = {2026},
    month   = jul,
    volume  = {75},
    number  = {7},
    pages   = {13194--13209},
    doi     = {10.1109/TVT.2026.3656108},
    url     = {https://doi.org/10.1109/TVT.2026.3656108}
  }
redirect_from:
  - /publication/2024-09-J-1/
---
Realizing distributed multi-user beamforming (D-MUBF) in time division duplex (TDD)-based multi-user MIMO (MU-MIMO) systems faces significant challenges.
One of the most fundamental challenges is achieving accurate over-the-air (OTA) timing and frequency synchronization among distributed access points (APs), particularly due to residual frequency offsets caused by local oscillator (LO) drifts.
Despite decades of research on synchronization for MU-MIMO, there are only a few experimental studies that evaluate D-MUBF techniques under imperfect frequency synchronization among distributed antennas.
This paper presents an analytical and experimental assessment of D-MUBF methods in the presence of frequency synchronization errors.
We provide closed-form expressions for signal-to-interference-plus-noise ratio (SINR) as a function of channel characteristics and statistical properties of carrier frequency offset (CFO) among AP antennas.
In addition, through experimental evaluations conducted with the RENEW massive MIMO testbed, we collected comprehensive datasets across various experimental scenarios.
These datasets comprise uplink pilot samples for channel and CFO estimation, in addition to uplink multi-user data intended for analyzing D-MUBF techniques.
By examining these datasets, we assess the performance of D-MUBF in the presence of CFO and compare the analytical predictions with empirical measurements.
Furthermore, we make the datasets publicly available and provide insights on utilizing them for future research endeavors.
