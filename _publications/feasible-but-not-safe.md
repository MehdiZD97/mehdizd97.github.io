---
title: "Feasible but Not Safe: Constraint Violations and Report-Channel Attacks in Learned Cell-Free ISAC Association"
authors: ["M. Zafari", "I. Mohammadi", "A. L. Swindlehurst"]
type: conference
status: published
venue: "17th ACM Workshop on Wireless of the Students, by the Students, for the Students (S3 '26), co-located with ACM MobiCom 2026"
venue_short: MobiCom 2026 S3
date: 2026-10-26              # the ACM proceedings record's date (the workshop was on 2026-10-30)
doi: 10.1145/3842433.3843753
arxiv: "2609.03147"
code: https://github.com/LS-Wireless/ASSENT-Security-Analysis
topics: [cell-free-isac, machine-learning, security]
award: Best Paper Award
featured: false   # true shows it in Home's Selected publications
bibtex: |
  @inproceedings{zafari2026feasible,
    author    = {Zafari, Mehdi and Mohammadi, Iman and Swindlehurst, A. Lee},
    title     = {Feasible but Not Safe: Constraint Violations and Report-Channel Attacks in Learned Cell-Free {ISAC} Association},
    booktitle = {Proceedings of the 17th ACM Workshop on Wireless of the Students, by the Students, for the Students},
    year      = {2026},
    month     = oct,
    pages     = {8--11},
    publisher = {ACM},
    doi       = {10.1145/3842433.3843753},
    url       = {https://doi.org/10.1145/3842433.3843753}
  }
---
Learning-based schedulers have been proposed to provide real-time user, target, and access point (AP) association in distributed cell-free integrated sensing and communication systems.
In a typical approach, a graph neural network (GNN), trained on labels from a mixed-integer linear program, maps lightweight per-AP statistics to decisions on AP clustering, user and target scheduling, and mode selection in one forward pass.
Such solutions assume that hard constraints, enforced only as soft training penalties, hold at inference, and that the self-reported statistics are truthful.
Using our ASSENT algorithm as an example, we find that despite high F<sub>1</sub> scores, many solutions violate at least one hard constraint, demonstrating that high prediction accuracy does not ensure joint feasibility.
Projecting the GNN output onto a feasible solution restores constraint satisfaction with low utility loss, even with a simple greedy repair procedure.
We further show that feasibility alone does not guarantee robustness to false data injection attacks.
A single malicious AP that reports false information cannot substantially increase its user associations, but can greatly increase the rate of infeasible solutions.
The effect of such attacks depends on the type of information being falsified.
Misreporting information that affects the objective can largely be mitigated through feasibility projection, whereas falsifying information that affects the constraints cannot.
The latter can, however, be detected using a low-complexity cross-AP consistency check.
These results show that learned ISAC schedulers should be evaluated using constraint-aware feasibility metrics in addition to conventional accuracy measures.
