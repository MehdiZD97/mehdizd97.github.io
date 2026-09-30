---
title: "TiamiTwin: A Digital Twin for Bistatic ISAC Drone Sensing, Validated Against Measurements"
authors: ["M. Zafari", "S. Enayati", "A. L. Swindlehurst", "A. Mukherjee"]
type: conference
status: accepted
venue: IEEE MILCOM Workshop   # TODO(mehdi): use the full name from the arXiv comment, "IEEE MILCOM 2026 Workshop on Integrated Sensing and Communication for Critical Infrastructure Protection (ISAC4CIP)"?
venue_short: MILCOM 2026 Workshop
date: 2026-07-01              # CV: accepted July 2026
arxiv: 2609.22709             # TODO(mehdi): confirm this preprint (found on arXiv on 2026-09-30, posted 2026-09-19)
featured: true                # TODO(mehdi): confirm the featured list (Stage 4 proposal: the seven papers shown in the style guide)
topics: [digital-twin, experimental, isac]
bibtex: |
  @misc{zafari2026tiamitwin,
    author        = {Zafari, Mehdi and Enayati, Saeede and Swindlehurst, A. Lee and Mukherjee, Amitav},
    title         = {{TiamiTwin}: A Digital Twin for Bistatic {ISAC} Drone Sensing, Validated Against Measurements},
    year          = {2026},
    eprint        = {2609.22709},
    archivePrefix = {arXiv},
    primaryClass  = {eess.SP},
    url           = {https://arxiv.org/abs/2609.22709}
  }
---
Monitoring lower airspace over critical infrastructure using cellular signals of opportunity is highly practical because transmitters are pre-deployed, licensed, and continuously active.
Digital twins can evaluate the feasibility of such integrated sensing and communication (ISAC) architectures, but their predictive accuracy must be validated against real-world data.
This paper reports validation results for TiamiTwin, a digital twin developed for bistatic ISAC drone sensing, using empirical measurements from an operational 5G deployment featuring a commercial band n41 gNB and a receiver separated by 572.8 m over a non-line-of-sight (NLOS) channel.
TiamiTwin incorporates three parallel channel representations evaluated on a 240-subcarrier grid: the 3GPP TR 38.901 (Release 19) bistatic ISAC model, a ray-traced site model, and the captured field measurements.
Empirical results demonstrate that both statistical and ray-tracing models under-predict the measured root-mean-square (RMS) delay spread by approximately a factor of three.
Furthermore, target reflections sit 68 dB below static clutter in power, making target detection entirely dependent on Doppler separation to isolate the drone from zero-Doppler background returns.
Despite this severe clutter environment, the target remains separable along 88% of the flight path in the delay, Doppler, or joint delay-Doppler domains.
