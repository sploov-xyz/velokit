---
layout: home

hero:
  name: VeloKit
  text: High-Velocity Discord Bot Engine
  tagline: The ultimate scaffolding tool for modular, production-ready Discord bots.
  image:
    src: /logo.svg
    alt: VeloKit Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/sploov-xyz/velokit

features:
  - title: ⚡ High Velocity
    details: Forge a complete bot architecture in seconds using our 7-Phase interactive CLI.
  - title: 🧩 Modular Souls
    details: Inject Music, AI, or Moderation modules dynamically without touching boilerplate.
  - title: 🛡️ Production Grade
    details: Built-in validation, premium logging, and Docker support for enterprise-level stability.
---

<div align="center">
  <img src="/banner.svg" class="dark-only" style="border-radius: 12px; margin: 40px 0; border: 1px solid rgba(255,255,255,0.1);" />
  <img src="/banner-light.svg" class="light-only" style="border-radius: 12px; margin: 40px 0; border: 1px solid rgba(0,0,0,0.1);" />
</div>

<style>
.dark-only { display: none; }
:root.dark .dark-only { display: block; }
:root.dark .light-only { display: none; }

:root {
  --vp-c-brand: #1a2980;
  --vp-c-brand-light: #26d0ce;
  --vp-c-brand-lighter: #26d0ce;
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
}

:root.dark {
  --vp-c-brand: #26d0ce;
  --vp-c-brand-light: #1a2980;
  --vp-c-brand-lighter: #1a2980;
  --vp-home-hero-name-background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  --vp-home-hero-image-filter: drop-shadow(0 0 40px rgba(38, 208, 206, 0.2));
}
</style>