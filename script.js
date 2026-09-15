
// Welcome Canvas Interactive Particle Animation
const canvas = document.getElementById('welcomeCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
      this.color = Math.random() > 0.4 ? '213, 82, 53' : '247, 245, 239';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.baseAlpha + ')';
      ctx.shadowColor = 'rgba(' + this.color + ', 0.5)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  let animationFrameId;
  function animateCanvas() {
    const welcomeEl = document.querySelector('#welcome');
    if (welcomeEl && welcomeEl.classList.contains('dismissed')) {
      cancelAnimationFrame(animationFrameId);
      return;
    }
    ctx.clearRect(0, 0, width, height);

    // Draw connecting links between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.18;
          ctx.strokeStyle = 'rgba(213, 82, 53, ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(function(p) {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(animateCanvas);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  animateCanvas();
}

// 1. Welcome Typewriter
const welcome = document.querySelector('#welcome');
const beginButton = document.querySelector('#beginButton');
const skipIntro = document.querySelector('#skipIntro');
const helloWord = document.querySelector('#helloWord');
const helloCursor = document.querySelector('#helloCursor');

const greetings = ['hello', 'नमस्ते', 'নমস্কার', 'bonjour', 'hola', 'ciao', '你好', 'hello'];
let helloIndex = 0;
let charIndex = 0;
const TYPE_SPEED = 150;
const DELETE_SPEED = 85;
const HOLD_TIME = 1000;

function typeGreeting() {
  if (!helloWord) return;
  const word = greetings[helloIndex];
  if (charIndex <= word.length) {
    helloWord.textContent = word.slice(0, charIndex);
    charIndex += 1;
    setTimeout(typeGreeting, TYPE_SPEED);
  } else if (helloIndex < greetings.length - 1) {
    setTimeout(deleteGreeting, HOLD_TIME);
  }
}

function deleteGreeting() {
  if (!helloWord) return;
  const word = greetings[helloIndex];
  if (charIndex > 0) {
    charIndex -= 1;
    helloWord.textContent = word.slice(0, charIndex);
    setTimeout(deleteGreeting, DELETE_SPEED);
  } else {
    helloIndex += 1;
    setTimeout(typeGreeting, 250);
  }
}

function dismissWelcome() {
  welcome.classList.add('dismissed');
  document.body.style.overflow = '';
  sessionStorage.setItem('arnab-portfolio-welcomed', 'true');
}

if (false && sessionStorage.getItem('arnab-portfolio-welcomed') === 'true') {
  welcome.classList.add('dismissed');
} else {
  document.body.style.overflow = 'hidden';
  setTimeout(typeGreeting, 600);
}

beginButton?.addEventListener('click', dismissWelcome);
skipIntro?.addEventListener('click', dismissWelcome);

// 2. Menu Panel Toggle
const menuPanel = document.querySelector('#menuPanel');
const menuToggle = document.querySelector('#menuToggle');
const menuClose = document.querySelector('#menuClose');
const drawerItems = document.querySelectorAll('.drawer-nav-item');

function setMenu(isOpen) {
  menuPanel.classList.toggle('open', isOpen);
  menuPanel.setAttribute('aria-hidden', String(!isOpen));
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

menuToggle?.addEventListener('click', () => setMenu(true));
menuClose?.addEventListener('click', () => setMenu(false));
drawerItems.forEach(item => item.addEventListener('click', () => setMenu(false)));

// 3. Project Filter with Smooth Animation
const filterChips = document.querySelectorAll('.filter-chip');
const projectCards = document.querySelectorAll('#projects .project-card');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;

    projectCards.forEach((card, index) => {
      const category = card.dataset.category || '';
      const shouldShow = filter === 'all' || category.includes(filter);
      
      if (shouldShow) {
        card.style.display = 'grid';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 80);
      } else {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// 4. Scroll Reveal with Staggered Delays
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObserver.observe(el));

// 5. Active Header Link Highlighting + Scrolled header style
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const siteHeader = document.querySelector('.site-header');

let lastScrollY = 0;

window.addEventListener('scroll', () => {
  // Active section highlight
  let current = '';
  sections.forEach(sec => {
    const secTop = sec.offsetTop - 100;
    if (window.scrollY >= secTop) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Header shadow on scroll
  if (siteHeader) {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  lastScrollY = window.scrollY;
}, { passive: true });

// 6. Year
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 7. Cert Modal
function openCertModal(imageSrc) {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImg');
  if (modal && modalImg) {
    modalImg.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCertModal(event) {
  if (event.target.id === 'certModal' || event.target.className === 'cert-modal-close') {
    const modal = document.getElementById('certModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        const modalImg = document.getElementById('certModalImg');
        if (modalImg) modalImg.src = '';
      }, 400);
    }
  }
}

window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('certModal');
    if (modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        const modalImg = document.getElementById('certModalImg');
        if (modalImg) modalImg.src = '';
      }, 400);
    }
    // Also dismiss welcome overlay on Escape
    if (welcome && !welcome.classList.contains('dismissed')) {
      dismissWelcome();
    }
  }
});

// 8. Animated Counter for Stat Items
function animateCounters() {
  const statItems = document.querySelectorAll('.stat-item strong');
  statItems.forEach(el => {
    const target = el.textContent.trim();
    const numMatch = target.match(/[\d.]+/);
    if (!numMatch) return;
    
    const finalNum = parseFloat(numMatch[0]);
    const suffix = target.replace(numMatch[0], '');
    const isFloat = target.includes('.');
    const duration = 1500;
    const startTime = performance.now();
    
    el._animated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !el._animated) {
          el._animated = true;
          
          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            
            const currentVal = finalNum * eased;
            if (isFloat) {
              el.textContent = currentVal.toFixed(1) + suffix;
            } else {
              el.textContent = String(Math.floor(currentVal)).padStart(2, '0') + suffix;
            }
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target;
            }
          }
          
          requestAnimationFrame(updateCounter);
        }
      });
    }, { threshold: 0.5 });
    
    counterObserver.observe(el);
  });
}

animateCounters();

// 9. Parallax Subtle Motion for Hero Glows
function initParallax() {
  const glow1 = document.querySelector('.hero-ambient-glow-1');
  const glow2 = document.querySelector('.hero-ambient-glow-2');
  
  if (!glow1 || !glow2) return;
  
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    requestAnimationFrame(() => {
      glow1.style.transform = `translate(${x * 20}px, ${y * 15}px)`;
      glow2.style.transform = `translate(${x * -15}px, ${y * -20}px)`;
    });
  });
}

initParallax();

// 10. Magnetic Hover Effect for CTAs
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.primary-cta, .secondary-cta, .begin-button');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

initMagneticButtons();

// 11. Smooth Tilt Effect for Editorial Card
function initCardTilt() {
  const card = document.querySelector('.hero-editorial-card');
  if (!card) return;
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * 6;
    const tiltY = (x - 0.5) * -6;
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
}

initCardTilt();
