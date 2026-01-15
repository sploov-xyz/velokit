---
layout: home

hero:
  name: VeloKit
  text: High-Velocity Project Scaffolder
  tagline: The ultimate scaffolding tool for production-ready Discord bots and APIs.
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
    details: Build a complete architecture in seconds using our interactive CLI with smart defaults.
  - title: 🧩 Modular & Extensible
    details: Plugin system, custom modules, and dynamic feature injection. Extend VeloKit your way.
  - title: 🛡️ Production Grade
    details: Built-in testing, CI/CD templates, Git integration, and health checks for enterprise stability.
  - title: 🔌 Plugin System
    details: Create custom plugins with hooks into the build process. Add your own templates and modules.
  - title: 🧪 Testing Ready
    details: Jest and Vitest support out of the box. Start testing immediately with pre-configured setups.
  - title: 🚀 CI/CD Templates
    details: GitHub Actions and GitLab CI templates included. Deploy with confidence from day one.
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