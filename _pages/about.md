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
  grid-template-columns: 1fr 1fr; /* Two equal columns for titles */
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
  grid-template-columns: 1fr 1fr; /* Two equal columns for content */
  gap: 30px;
  margin-bottom: 10px;
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
        <li>Integrated Sensing and Communication (ISAC)</li>
        <li>Cell‑Free / Distributed Massive MIMO</li>
        <li>AI/ML and Optimization for Wireless Networks</li>
      </ul>
    </div>

    <!-- Education -->
    <div>
      <ul>
        <li><strong>Ph.D.</strong>, Electrical Engineering and Computer Science, UC Irvine, 2028 (expected)</li>
        <li><strong>M.S.</strong>, Electrical and Computer Engineering, Rice University, 2024</li>
        <li><strong>B.S.</strong>, Electrical and Computer Engineering, University of Tehran, 2019</li>
      </ul>
    </div>
  </div>

  <!-- Recent Publications Section -->
  <section class="recent-publications">
    <h2>Recent Publications</h2>
    <ul>
        <li><strong> Coordinated Decentralized Resource Optimization for Cell-Free ISAC Systems</strong> - <em>Asilomar, 2025.</em></li>
        <li><strong> Distributed Cell-Free ISAC Simulation Framework</strong> - <em>GitHub Repository, 2025.</em></li>
        <li><strong> ADMM for Downlink Beamforming in Cell‑Free Massive MIMO Systems</strong> - <em>Asilomar, 2024.</em></li>
        <li><strong> An Analytical and Experimental Study of Distributed Uplink Beamforming in the Presence of Carrier Frequency Offsets</strong> - <em>Submitted to IEEE TVT Journal, 2024.</em></li>
        <li><strong> Distributed Multi‑User MIMO Datasets</strong> - <em>Published in IEEE Data Port, 2024.</em></li>
    </ul>
    <p>
      For a full list of my publications, visit the <a href="/publications/">Publications</a> pages.
    </p>
  </section>

  <!-- Recent News Section -->
  <section class="recent-news">
    <h2>Recent News</h2>
    <ul>
        <li><strong>[Aug. 2025]:</strong> My submission to Asilomar 2025 has been shortlisted for the Best Paper Award contest.</li>
        <li><strong>[Apr. 2025]:</strong> Released a simulation framework for distributed cell-free ISAC systems on GitHub.</li>
        <li><strong>[Nov. 2024]:</strong> Posted two short tutorial videos on YouTube.</li>
        <li><strong>[Oct. 2024]:</strong> Presented a lecture of my recent paper at the 58th Asilomar Conference.</li>
        <li><strong>[Jul. 2024]:</strong> Received the Graduate Dean’s Recruitment Fellowship Award from UC Irvine.</li>
        <li><strong>[Jul. 2024]:</strong> Started my PhD studies in the EECS department at UC Irvine.</li>
    </ul>
    <p>
      For a full list of news and activities, visit the <a href="/year-archive/">News & Posts</a> page.
    </p>
  </section>
</div>