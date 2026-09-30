---
title: "Robust Wildfire Forecasting under Partial Observability: From Reconstruction to Prediction"
authors: ["C. Yang", "M. Zafari", "Z. Duan", "A. L. Swindlehurst"]
type: journal
status: under-review
venue: IEEE Transactions on Geoscience and Remote Sensing
venue_short: IEEE TGRS
date: 2026-03-01              # CV: submitted March 2026
arxiv: 2603.09042
code: https://github.com/LS-Wireless/Robust-Wildfire-Forecasting
featured: true
topics: [generative-ai, machine-learning]
bibtex: |
  @misc{yang2026robust,
    author        = {Yang, Chen and Zafari, Mehdi and Duan, Ziheng and Swindlehurst, A. Lee},
    title         = {Robust Wildfire Forecasting under Partial Observability: From Reconstruction to Prediction},
    year          = {2026},
    eprint        = {2603.09042},
    archivePrefix = {arXiv},
    primaryClass  = {eess.IV},
    url           = {https://arxiv.org/abs/2603.09042}
  }
redirect_from:
  - /publication/2026-03-J-3/
---
Satellite-derived fire observations are the primary input for learning-based wildfire spread prediction, yet they are inherently incomplete due to cloud cover, smoke obscuration, and sensor artifacts.
This partial observability introduces a domain gap between the clean data used to train forecasting models and the degraded inputs encountered during deployment, often leading to unreliable predictions.
To address this challenge, we formulate wildfire forecasting under partial observability using a two-stage probabilistic framework that decouples observation recovery from spatiotemporal prediction.
Stage-I reconstructs plausible fire maps from corrupted observations via conditional inpainting, while Stage-II models wildfire dynamics on the recovered sequences using a spatiotemporal forecasting network.
We consider four network architectures for the reconstruction module: a Residual U-Net (MaskUNet), a Conditional VAE (MaskCVAE), a cross-attention Vision Transformer (MaskViT), and a discrete diffusion model (MaskD3PM), spanning CNN-based, latent-variable, attention-based, and diffusion-based approaches.
We evaluate the performance of the two-stage approach on the WildfireSpreadTS (WSTS) dataset under various settings, including pixel-wise and block-wise masking, eight corruption levels (10%–80%), four fire scenarios, and leave-one-year-out cross-validation.
Results show that all learning-based recovery models substantially outperform non-learning baselines, with MaskCVAE and MaskUNet achieving the strongest overall performance.
Importantly, inserting the reconstruction stage before forecasting significantly mitigates the domain gap, restoring next-day prediction accuracy to near-clean-input levels even under severe information loss.
