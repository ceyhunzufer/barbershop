// ===== INTRO ANIMATION =====
(function () {
  const overlay = document.getElementById('intro-overlay');
  const bar = document.querySelector('.intro-bar');
  const percent = document.querySelector('.intro-percent');
  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.5 + 0.1
  }));

  const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(244,114,182,'];

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % 3] + p.alpha + ')';
      ctx.fill();
    });

    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(124,58,237,' + (0.06 * (1 - dist / 100)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  }

  let animId;
  function loop() { drawParticles(); animId = requestAnimationFrame(loop); }
  loop();

  let p = 0;
  const speed = 1.8;
  function tickBar() {
    if (p >= 100) {
      percent.textContent = '100%';
      bar.style.width = '100%';
      setTimeout(() => {
        cancelAnimationFrame(animId);
        overlay.classList.add('hide');
        setTimeout(() => { overlay.style.display = 'none'; }, 800);
      }, 400);
      return;
    }
    p = Math.min(100, p + speed * (0.6 + Math.random() * 0.8));
    bar.style.width = p + '%';
    percent.textContent = Math.floor(p) + '%';
    setTimeout(tickBar, 30);
  }

  setTimeout(tickBar, 600);
})();

// ===== CURSOR =====
const follower = document.querySelector('.cursor-follower');
const dot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .glass-card, .project-card, .social-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.transform = 'translate(-50%, -50%) scale(1.8)';
    follower.style.borderColor = 'rgba(124, 58, 237, 1)';
    follower.style.background = 'rgba(124, 58, 237, 0.08)';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(124, 58, 237, 0.6)';
    follower.style.background = 'transparent';
  });
});

// ===== MOUSE GLOW =====
const glow1 = document.querySelector('.glow-1');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  glow1.style.transform = `translate(${x}px, ${y}px)`;
});

// ===== TYPED TEXT =====
const phrases = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Project Designer'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }
  setTimeout(type, speed);
}
type();

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.glass-card, .project-card, .social-card, .timeline-item, .section-title').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ===== SOCIAL CARD COLORS =====
document.querySelectorAll('.social-card').forEach(card => {
  const color = card.getAttribute('data-color');
  if (color) {
    card.style.setProperty('--card-color', color + '22');
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = color + '55';
      card.querySelector('.social-icon').style.color = color;
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
      card.querySelector('.social-icon').style.color = '';
    });
  }
});

// ===== PROJECTS DATA =====
const projectsData = [
  {
    "title": "Animated Portfolio Website",
    "description": "A modern personal portfolio website with mouse-tracking animations, glassmorphism cards, typed text effect, and smooth scroll reveal transitions.",
    "tags": ["HTML", "CSS", "JavaScript"],
    "github": "https://github.com/ceyhunzufar/portfolio",
    "demo": "",
    "image": ""
    
  }
];

// ===== LOAD PROJECTS =====
function loadProjects() {
  const grid = document.getElementById('projects-grid');
  const projects = projectsData;

  if (!projects.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1">No projects added yet.</p>';
    return;
  }

  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.animationDelay = `${i * 0.1}s`;

    const imgSection = p.image
      ? `<img class="project-img" src="${p.image}" alt="${p.title}" />`
      : `<div class="project-img-placeholder"><i class="fa-solid fa-code"></i></div>`;

    const tags = (p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');

    const githubLink = p.github
      ? `<a href="${p.github}" target="_blank" class="project-link github"><i class="fa-brands fa-github"></i> GitHub</a>`
      : '';

    const demoLink = p.demo
      ? `<a href="${p.demo}" target="_blank" class="project-link demo"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>`
      : '';

    card.innerHTML = `
      ${imgSection}
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-links">${githubLink}${demoLink}</div>
      </div>
    `;

    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

loadProjects();

// ===== NAVBAR ACTIVE LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = '#a78bfa';
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));
