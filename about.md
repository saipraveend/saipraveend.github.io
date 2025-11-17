---
title: About
layout: page
---

<style>
.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 48px;
  margin-bottom: 60px;
}

.about-image img {
  width: 100%;
  border-radius: 50%;
  border: 4px solid #f8f9fa;
  box-shadow: 0 2px 8px rgba(60,64,67,0.15);
}

.about-content h1 {
  font-size: 3.2rem;
  font-weight: 400;
  color: #202124;
  margin-bottom: 12px;
}

.about-role {
  font-size: 1.6rem;
  color: #0076A8;
  font-weight: 500;
  margin-bottom: 24px;
}

.about-text {
  font-size: 1.6rem;
  color: #5f6368;
  line-height: 1.8;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .about-image {
    max-width: 200px;
    margin: 0 auto;
  }

  .about-content h1 {
    font-size: 2.4rem;
  }

  .highlights {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="about-container">
  <div class="about-grid">
    <div class="about-image">
      <img src="{{ site.url }}/{{ site.picture }}" alt="Saipraveen Durairaman" loading="lazy">
    </div>

    <div class="about-content">
      <h1>Saipraveen Durairaman</h1>
      <p class="about-role">Embedded Systems Engineer at MathWorks</p>

      <p class="about-text">
        I build hardware with microcontrollers, sensors, and code. Started with obstacle-avoiding robots in 2010. Competed at national robotics competitions (placed 3rd at IIT Madras Shaastra). Built power electronics systems that got published in ARPN Journal. Now exploring how AI and ML fit into embedded systems.
      </p>

      <p class="about-text">
        I manage embedded hardware product marketing at MathWorks India during the week. Weekends? ESP32s, TinyML models, and whatever hardware project has my attention.
      </p>
    </div>
  </div>
</div>
