/**
 * main.js — CampusNeed Landing Page
 * ============================================================
 * Render functions, scroll-reveal animations, counter animation
 * ============================================================
 */

// ===========================================================
// THEME SYSTEM
// ===========================================================
const Theme = {
  KEY: 'campusneed_theme',
  
  init() {
    const saved = localStorage.getItem(this.KEY) || 'dark';
    this.apply(saved);
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
  },
  
  apply(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(this.KEY, theme);
    this.updateIcon(theme);
  },
  
  updateIcon(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      if (theme === 'light') {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    });
  }
};
Theme.init();

// ===========================================================
// RENDER FUNCTIONS
// ===========================================================

function renderProblems() {
  const container = document.getElementById("problem-grid");
  if (!container) return;

  container.innerHTML = problems.map((item, i) => `
    <div class="problem-card reveal" style="animation-delay: ${i * 0.1}s">
      <div class="problem-icon ${item.iconClass}">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join("");
}

function renderRentFeatures() {
  const container = document.getElementById("rent-features");
  if (!container) return;

  container.innerHTML = rentFeatures.map((f, i) => `
    <li class="reveal" style="animation-delay: ${i * 0.08}s"><span class="check">&#10003;</span>${f}</li>
  `).join("");
}

function renderSellFeatures() {
  const container = document.getElementById("sell-features");
  if (!container) return;

  container.innerHTML = sellFeatures.map((f, i) => `
    <li class="reveal" style="animation-delay: ${i * 0.08}s"><span class="check">&#10003;</span>${f}</li>
  `).join("");
}

function renderSecurity() {
  const container = document.getElementById("security-grid");
  if (!container) return;

  container.innerHTML = securityFeatures.map((item, i) => `
    <div class="security-card reveal" style="animation-delay: ${i * 0.1}s">
      <div class="security-icon">${item.icon}</div>
      <div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
    </div>
  `).join("");
}

function renderUSP() {
  const container = document.getElementById("usp-grid");
  if (!container) return;

  container.innerHTML = uspItems.map((item, i) => `
    <div class="usp-card reveal" style="animation-delay: ${i * 0.15}s">
      <div class="usp-num">${item.num}</div>
      <div class="usp-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join("");
}

function renderFlow() {
  const container = document.getElementById("flow-steps");
  if (!container) return;

  container.innerHTML = flowSteps.map((step, i) => `
    <div class="flow-step reveal" style="animation-delay: ${i * 0.15}s">
      <div class="step-circle">${step.icon}</div>
      <h4>${step.title}</h4>
      <p>${step.desc}</p>
    </div>
  `).join("");
}

function renderTeam() {
  const container = document.getElementById("team-grid");
  if (!container) return;

  container.innerHTML = teamMembers.map((member, i) => {
    const avatarContent = member.image
      ? `<img src="${member.image}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
      : member.initials;

    const avatarStyle = member.avatarColor
      ? `style="background: ${member.avatarColor};"`
      : "";
    return `
      <div class="team-card reveal" style="animation-delay: ${i * 0.15}s">
        <div class="avatar" ${avatarStyle}>${avatarContent}</div>
        <h4>${member.name}</h4>
        <div class="nim">${member.nim}</div>
        <div class="uni">
          ${member.prodi}<br>
          ${member.fakultas}<br>
          ${member.univ}
        </div>
      </div>
    `;
  }).join("");
}

function renderFooter() {
  const el = document.getElementById("footer-text");
  if (!el) return;

  el.innerHTML = `
    <p>&copy; ${footerInfo.year} <span>${footerInfo.brandName}</span> — ${footerInfo.tagline}</p>
  `;
}

// ===========================================================
// SCROLL REVEAL ANIMATION (IntersectionObserver)
// ===========================================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-card, section > .section-inner, .module-card, .hero-content');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve so we can re-reveal if needed
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ===========================================================
// COUNTER ANIMATION
// ===========================================================
function animateCounter(element, target, suffix = '', prefix = '') {
  const duration = 2000;
  const startTime = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    
    const current = Math.round(startValue + (target - startValue) * eased);
    element.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initCounterAnimation() {
  const statItems = document.querySelectorAll('.stat-item');
  if (statItems.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h3 = entry.target.querySelector('h3');
        if (!h3 || h3.dataset.animated) return;
        h3.dataset.animated = 'true';

        const text = h3.getAttribute('data-target') || h3.textContent;
        
        if (text.includes('+')) {
          const num = parseInt(text);
          animateCounter(h3, num, '+');
        } else if (text.includes('%')) {
          const num = parseInt(text);
          animateCounter(h3, num, '%');
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(item => observer.observe(item));
}

// ===========================================================
// UI INTERACTIONS
// ===========================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.length > 1 && !targetId.includes('.html')) {
        e.preventDefault();
        document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function initNavbarScrollEffect() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = "0 2px 16px rgba(0,0,0,0.08)";
      nav.classList.add('scrolled');
    } else {
      nav.style.boxShadow = "none";
      nav.classList.remove('scrolled');
    }
  });
}

// ===========================================================
// PARTICLE ANIMATION (Hero Background)
// ===========================================================
function initHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const particleContainer = document.createElement('div');
  particleContainer.className = 'hero-particles';
  hero.appendChild(particleContainer);

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (5 + Math.random() * 10) + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    particleContainer.appendChild(particle);
  }
}

// ===========================================================
// INIT
// ===========================================================
document.addEventListener("DOMContentLoaded", () => {
  renderProblems();
  renderRentFeatures();
  renderSellFeatures();
  renderSecurity();
  renderUSP();
  renderFlow();
  renderTeam();
  renderFooter();

  initSmoothScroll();
  initNavbarScrollEffect();
  initHeroParticles();

  // Delay scroll reveal to allow DOM to paint
  requestAnimationFrame(() => {
    initScrollReveal();
    initCounterAnimation();
  });
});
