---
layout: archive
permalink: /
#title: "About Me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<style>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
  font-family: Arial, sans-serif;
  color: #333;
}

.about-page section {
  margin-bottom: 30px;
  margin-top: 0;
}

.about-page h2 {
  font-size: 1.4em;
  color: #04588C;
  border-bottom: 2px solid #04588C;
  padding-bottom: 5px;
  margin-top: 0;
  margin-bottom: 10px;
}

.about-page p {
  line-height: 1.4;
  font-size: 0.95em;
  margin-top: 5px;
  text-align: justify;
  margin-right: 1px;
}

.about-page ul {
  list-style-type: disc;
  padding-left: 20px;
}

.about-page ul li {
  font-size: 0.9em;
  line-height: 1.3;
  margin-bottom: 10px;
}

.about-page a {
  color: #0669BF;
  text-decoration: none;
}

.about-page a:hover {
  text-decoration: underline;
}

/* Two-column layout for titles */
.horizontal-titles {
  display: grid;
  grid-template-columns: 0.93fr 1.07fr; /* Two equal columns for titles */
  gap: 35px;
  align-items: center; /* Align titles vertically */
}

.horizontal-titles h2 {
  text-align: left; /* Center-align the titles horizontally */
  border-bottom: 2px solid #04588C; /* Remove the underline from these titles */
  margin-bottom: 1px; /* Reduce the gap below these titles */
}

/* Two-column grid for content */
.two-column-grid {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr; /* Two equal columns for content */
  gap: 30px;
  margin-bottom: 10px;
}

.link-more {
  margin-top: 1.2rem;
  font-size: 0.9rem;
}

/* Smaller, high-contrast pill */
.link-button {
  display: inline-block;
  padding: 0.15rem 0.5rem;      /* smaller padding */
  margin-left: 0.1rem;
  border-radius: 10px;
  border: 1px solid #4a6cff;
  background-color: #f5f7ff;     /* light background */
  color: #2643a0;                /* dark blue text */
  text-decoration: none;
  font-size: 0.85rem;            /* slightly smaller text */
  font-weight: 600;
  line-height: 1.5;
}

.link-button:hover {
  background-color: #4a6cff;     /* solid blue on hover */
  color: #ffffff;                /* white text */
}




.edu-list {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  margin-left: 0.0rem;
}

.edu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
  margin-left: 0.0rem;
}

/* Fixed-size square box for all logos */
.edu-logo-wrap {
  width: 50px;              /* you can try 24–32px */
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Logo scales inside the box */
.edu-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
</style>

<div class="about-page">

  <!-- About Me Section -->
  <section class="about-me">
    <h2>About Me</h2>
    <p>
        I am a Ph.D. student at UC Irvine, where I work under the supervision of <a href="https://scholar.google.com/citations?user=ibAcKWwAAAAJ&hl=en" target="_blank">Professor Lee Swindlehurst</a>.
        My research centers on advancing wireless communication systems through signal processing, optimization techniques, AI/machine learning, and hands-on experimental implementations.
    </p>
  </section>

  <!-- Horizontal Titles Section -->
  <div class="horizontal-titles">
    <h2>Research Interests</h2>
    <h2>Education</h2>
  </div>

  <!-- Research Interests and Education Content -->
  <div class="two-column-grid">
    <!-- Research Interests -->
    <div>
      <ul>
        <li>Wireless Communication Systems</li>
        <li>Integrated Sensing and Communication</li>
        <li>Cell‑Free / Distributed Massive MIMO</li>
        <li>AI / Machine Learning for Wireless Networks</li>
        <li>Distributed / Decentralized Optimization</li>
      </ul>
    </div>
    <!-- Education -->
    <div>
      <ul class="edu-list">
        <li class="edu-item">
          <div class="edu-logo-wrap">
            <img src="/images/my_images/UCI_Seal_Logo.png" alt="UC Irvine logo" class="edu-logo">
          </div>
          <span>
            <strong>Ph.D.</strong>, Electrical Engineering and Computer Science, UC Irvine, 2028 (expected)
          </span>
        </li>
        <li class="edu-item">
          <div class="edu-logo-wrap">
            <img src="/images/my_images/Rice_Shield_Logo.png" alt="Rice University logo" class="edu-logo">
          </div>
          <span>
            <strong>M.S.</strong>, Electrical and Computer Engineering, Rice University, 2024
          </span>
        </li>
        <li class="edu-item">
          <div class="edu-logo-wrap">
            <img src="/images/my_images/UT_Logo.png" alt="University of Tehran logo" class="edu-logo">
          </div>
          <span>
            <strong>B.S.</strong>, Electrical and Computer Engineering, University of Tehran, 2019
          </span>
        </li>
      </ul>
    </div>
  </div>
  <!-- Recent Publications Section -->
  <section class="recent-publications">
    <h2>Recent Publications</h2>
    <ul>
        <li><strong> An Analytical and Experimental Study of Distributed Uplink Beamforming in the Presence of Carrier Frequency Offsets</strong> - <em>Published at IEEE TVT Journal, Jan 2026.</em></li>
        <li><strong> ASSENT: Learning-Based Association Optimization for Distributed Cell-Free ISAC</strong> - <em>Accepted to the IEEE ICC, Jan 2026.</em></li>
        <li><strong> ASSENT-CellFree-ISAC: Simulation Framework</strong> - <em>GitHub Repository, Nov 2025.</em></li>
        <li><strong> Coordinated Decentralized Resource Optimization for Cell-Free ISAC Systems</strong> - <em>Asilomar, 2025.</em></li>
        <li><strong> Distributed Cell-Free ISAC Simulation Framework</strong> - <em>GitHub Repository, 2025.</em></li>
        <li><strong> ADMM for Downlink Beamforming in Cell‑Free Massive MIMO Systems</strong> - <em>Asilomar, 2024.</em></li>
    </ul>
    <p class="link-more">
      For a full list of my publications, visit the
      <a href="/publications/" class="link-button">Publications</a>
      page.
    </p>
  </section>

  <!-- Recent News Section -->
  <section class="recent-news">
    <h2>Recent News</h2>
    <ul>
        <li><strong>[Jan. 2026]:</strong> I will be presenting at the UCI Grad Slam Semi Finals!</li>
        <li><strong>[Jan. 2026]:</strong> My experimental paper is published at the IEEE TVT journal (see publications).</li>
        <li><strong>[Jan. 2026]:</strong> My ASSENT paper is accepted at the IEEE ICC 2026.</li>
        <li><strong>[Dec. 2025]:</strong> Released a GitHub repository for our GenAI-based wildfire prediction project.</li>
        <li><strong>[Nov. 2025]:</strong> Published a preprint of the ASSENT paper and its GitHub repository.</li>
        <li><strong>[Oct. 2025]:</strong> Lecture presentation at the 59th Asilomar Conference.</li>
        <li><strong>[Oct. 2025]:</strong> Poster presentation at the Student Paper Contest (SPC) of Asilomar Conference.</li>
        <li><strong>[Oct. 2025]:</strong> Attended the IEEE MILCOM 2025 conference in LA, CA.</li>
        <li><strong>[Aug. 2025]:</strong> My submission to Asilomar 2025 has been shortlisted for the Best Paper Award contest.</li>
        <li><strong>[Apr. 2025]:</strong> Released a simulation framework for distributed cell-free ISAC systems on GitHub.</li>
        <li><strong>[Nov. 2024]:</strong> Posted two short tutorial videos on YouTube.</li>
        <li><strong>[Oct. 2024]:</strong> Presented a lecture of my recent paper at the 58th Asilomar Conference.</li>
        <li><strong>[Jul. 2024]:</strong> Received the Graduate Dean’s Recruitment Fellowship Award from UC Irvine.</li>
    </ul>
    <p class="link-more">
      For a full list of news and activities, visit the
      <a href="/year-archive/" class="link-button">News & Posts</a>
      page.
    </p>
  </section>
</div>