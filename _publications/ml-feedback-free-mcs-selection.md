---
title: "ML-Based Feedback-Free Adaptive MCS Selection for Massive Multi-User MIMO"
authors: ["Q. An", "M. Zafari", "C. Dick", "S. Segarra", "A. Sabharwal", "R. Doost-Mohammady"]
type: conference
status: published
venue: 57th Asilomar Conference on Signals, Systems, and Computers
venue_short: Asilomar 2023
date: 2023-10-29              # conference date in the IEEE record (the CV gives the year only)
doi: 10.1109/IEEECONF59524.2023.10476866
arxiv: 2310.13830
topics: [machine-learning, experimental]
bibtex: |
  @inproceedings{an2023mlbased,
    author    = {An, Qing and Zafari, Mehdi and Dick, Chris and Segarra, Santiago and Sabharwal, Ashutosh and Doost-Mohammady, Rahman},
    title     = {{ML}-Based Feedback-Free Adaptive {MCS} Selection for Massive Multi-User {MIMO}},
    booktitle = {2023 57th Asilomar Conference on Signals, Systems, and Computers},
    year      = {2023},
    month     = oct,
    pages     = {157--161},
    publisher = {IEEE},
    doi       = {10.1109/IEEECONF59524.2023.10476866},
    url       = {https://doi.org/10.1109/IEEECONF59524.2023.10476866}
  }
redirect_from:
  - /publication/2023-10-C-2/
---
As wireless communication systems strive to improve spectral efficiency, there has been a growing interest in employing machine learning (ML)-based approaches for adaptive modulation and coding scheme (MCS) selection.
In this paper, we introduce a new adaptive MCS selection framework for massive MIMO systems that operates without any feedback from users by solely relying on instantaneous uplink channel estimates.
Our proposed method can effectively operate in multi-user scenarios where user feedback imposes excessive delay and bandwidth overhead.
To learn the mapping between the user channel matrices and the optimal MCS level of each user, we develop a Convolutional Neural Network (CNN)-Long Short-Term Memory Network (LSTM)-based model and compare the performance with the state-of-the-art methods.
Finally, we validate the effectiveness of our algorithm by evaluating it experimentally using real-world datasets collected from the RENEW massive MIMO platform.
