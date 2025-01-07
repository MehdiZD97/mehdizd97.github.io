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
  margin-bottom: 40px;
  margin-top: 0;
}

.about-page h2 {
  font-size: 1.4em;
  color: #007acc;
  border-bottom: 2px solid #007acc;
  padding-bottom: 5px;
  margin-top: 0;
  margin-bottom: 10px;
}

.about-page p {
  line-height: 1.4;
  font-size: 0.95em;
  margin-top: 5px;
}

.about-page ul {
  list-style-type: disc;
  padding-left: 20px;
}

.about-page ul li {
  font-size: 0.9em;
  margin-bottom: 10px;
}

.about-page a {
  color: #007acc;
  text-decoration: none;
}

.about-page a:hover {
  text-decoration: underline;
}

/* Two-column layout for titles */
.horizontal-titles {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns for titles */
  gap: 30px;
  align-items: center; /* Align titles vertically */
}

.horizontal-titles h2 {
  text-align: left; /* Center-align the titles horizontally */
  border-bottom: 2px solid #007acc; /* Remove the underline from these titles */
  margin-bottom: 1px; /* Reduce the gap below these titles */
}

/* Two-column grid for content */
.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns for content */
  gap: 30px;
  margin-bottom: 15px;
}
</style>

<div class="about-page">

  <!-- About Me Section -->
  <section class="about-me">
    <h2>About Me</h2>
    <p>
        I am a PhD student at UC Irvine, specializing in Electrical Engineering and Computer Science. My academic journey began with a BS from the University of Tehran and continued with an MS from Rice University.
        My research interests are centered around advanced wireless systems, particularly exploring AI/ML/optimization applications within these fields.
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
      <li><strong>ADMM for Downlink Beamforming in Cell‑Free Massive MIMO Systems</strong> - Asilomar, 2024.</li>
      <li><strong>An Analytical and Experimental Study of Distributed Uplink Beamforming in the Presence of Carrier Frequency Offsets</strong> - Submitted to IEEE TVT Journal, 20224.</li>
      <li><strong>Distributed Multi‑User MIMO Datasets</strong> - Published in IEEE Data Port, 2024.</li>
    </ul>
    <p>
      For a list of my publications or curriculum vitae, visit the <a href="/publications/">Publications</a> or <a href="/cv/">CV</a> pages.
    </p>
  </section>

</div>