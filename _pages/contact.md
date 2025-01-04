---
permalink: /contact/
title: "Contact Me"
author_profile: true
redirect_from: 
  - /md/
  - /markdown.html
---



<style>
.contact-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}


.contact-form {
  margin-top: 2px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.contact-form h3 {
  margin-top: 0; /* Removes the margin above the header */
  margin-bottom: 20px; /* Optional: Adjust the spacing below the header */
  font-size: 1.5em; /* Optional: Customize the font size */
}

.contact-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.contact-form button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
}

.contact-form button:hover {
  background-color: #005f99;
}
</style>

<div class="contact-page">
  <!-- Introductory Section -->
  <div class="contact-intro">
    <p>
      I would love to hear from you! Whether you have questions, ideas, or just want to connect, feel free to reach out. 
      You can explore the social media links provided on the left side of this page to follow me online. 
      Connect with me on <a href="https://www.linkedin.com/in/Mehdi-Zafari" target="_blank">LinkedIn</a> and send me a message there, or use the message box below to send me a direct message.
      I'll get back to you as soon as possible!
    </p>
  </div>
  
  <p>
  <a href="https://www.linkedin.com/in/Mehdi-Zafari" target="_blank">
    <i class="fab fa-linkedin"></i> Connect on LinkedIn
  </a>
  </p>

  <!-- Contact Form Section -->
    <div class="contact-form">
        <h3>Send Me a Message</h3>
        <form action="https://formspree.io/f/mwppwoye" method="POST">
          <label for="name">Your Name</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" required>
    
          <label for="email">Your Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required>
    
          <label for="message">Your Message</label>
          <textarea id="message" name="message" placeholder="Write your message here" rows="6" required></textarea>
    
          <button type="submit">Send Message</button>
        </form>
    </div>
</div>



