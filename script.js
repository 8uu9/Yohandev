// =====================================================
// Yohan Portfolio — interactions
// =====================================================

(function () {
  'use strict';

  // -----------------------------------------------------
  // Preloader: hide once page is fully loaded
  // -----------------------------------------------------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hide = () => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 700);
    };
    if (document.readyState === 'complete') {
      setTimeout(hide, 350);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 350));
      setTimeout(hide, 3500);
    }
  }

  // -----------------------------------------------------
  // Footer year
  // -----------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -----------------------------------------------------
  // Marquee: duplicate track for seamless infinite scroll
  // -----------------------------------------------------
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    marqueeTrack.innerHTML = marqueeTrack.innerHTML + marqueeTrack.innerHTML;
  }

  // -----------------------------------------------------
  // Side-dots scroll-spy navigation
  // -----------------------------------------------------
  const sideDots = document.getElementById('sideDots');
  if (sideDots) {
    const dotLinks = Array.from(sideDots.querySelectorAll('.side-dot'));
    const sectionMap = new Map();
    dotLinks.forEach((d) => {
      const id = d.dataset.section;
      const sec = document.getElementById(id);
      if (sec) sectionMap.set(sec, d);
    });

    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              dotLinks.forEach((d) => d.classList.remove('active'));
              const dot = sectionMap.get(entry.target);
              if (dot) dot.classList.add('active');
            }
          });
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );
      sectionMap.forEach((_dot, sec) => spy.observe(sec));
    }

    const showDotsOn = () => {
      if (window.scrollY > 400) sideDots.classList.add('visible');
      else sideDots.classList.remove('visible');
    };
    showDotsOn();
    window.addEventListener('scroll', showDotsOn, { passive: true });
  }

  // -----------------------------------------------------
  // 3D tilt on project cards
  // -----------------------------------------------------
  const tiltCards = document.querySelectorAll('.project-card');
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarsePointer) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 8;
        const ry = (x - 0.5) * 10;
        card.classList.add('tilting');
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  // -----------------------------------------------------
  // Magnetic effect on primary CTAs
  // -----------------------------------------------------
  if (!isCoarsePointer) {
    const magnets = document.querySelectorAll('.btn-primary, .nav-cta, .pkg-cta');
    magnets.forEach((m) => {
      m.classList.add('magnetic');
      m.addEventListener('mousemove', (e) => {
        const rect = m.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        m.style.transform = `translate(${mx * 0.18}px, ${my * 0.25}px)`;
      });
      m.addEventListener('mouseleave', () => {
        m.style.transform = '';
      });
    });
  }

  // -----------------------------------------------------
  // Pricing cards spotlight (mouse follow glow)
  // -----------------------------------------------------
  document.querySelectorAll('.pkg-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });

  // -----------------------------------------------------
  // FAQ accordion: only one open at a time
  // -----------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // -----------------------------------------------------
  // Theme toggle (persisted in localStorage)
  // -----------------------------------------------------
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const stored = (function () {
    try { return localStorage.getItem('yohan-theme'); } catch (e) { return null; }
  })();
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('yohan-theme', next); } catch (e) {}
    });
  }

  // -----------------------------------------------------
  // Scroll progress bar + back-to-top + navbar bg
  // -----------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (navbar) navbar.classList.toggle('scrolled', scrolled > 8);
    if (backToTop) backToTop.classList.toggle('visible', scrolled > 600);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -----------------------------------------------------
  // Cursor follower glow
  // -----------------------------------------------------
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    let raf = null;
    let tx = 0, ty = 0, x = 0, y = 0;
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    const loop = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      cursorGlow.style.left = x + 'px';
      cursorGlow.style.top = y + 'px';
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
  }

  // -----------------------------------------------------
  // Mobile menu toggle
  // -----------------------------------------------------
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // -----------------------------------------------------
  // Typing effect for hero subtitle
  // -----------------------------------------------------
  const typed = document.getElementById('typed');
  if (typed) {
    const phrases = [
      'Building digital experiences that are fast and beautiful.',
      'Specialized in React, Node.js, and modern web tech.',
      'Turning your ideas into shipped products.',
    ];
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        ci++;
        typed.textContent = phrase.slice(0, ci);
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(tick, 2200);
          return;
        }
      } else {
        ci--;
        typed.textContent = phrase.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 25 : 45);
    };
    setTimeout(tick, 800);
  }

  // -----------------------------------------------------
  // Stats counter
  // -----------------------------------------------------
  const counters = document.querySelectorAll('.stat-num');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + '+';
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // -----------------------------------------------------
  // Reveal on scroll
  // -----------------------------------------------------
  const revealTargets = document.querySelectorAll(
    '.about-card, .skill, .service-card, .project-card, .timeline-item, .contact-card, .section-head, .testimonial, .process-card, .faq-item, .achv-card, .pkg-card'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => io.observe(el));

    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterIO.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
    counters.forEach(animateCounter);
  }

  // -----------------------------------------------------
  // Active nav link based on current section
  // -----------------------------------------------------
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window && sections.length) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => {
              a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => navIO.observe(s));
  }

  // -----------------------------------------------------
  // Mouse-tracked highlight on about cards
  // -----------------------------------------------------
  document.querySelectorAll('.about-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });

  // -----------------------------------------------------
  // Tilt effect on hero blob
  // -----------------------------------------------------
  const tiltEl = document.querySelector('[data-tilt]');
  if (tiltEl && window.matchMedia('(hover: hover)').matches) {
    tiltEl.addEventListener('mousemove', (e) => {
      const rect = tiltEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltEl.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
    });
    tiltEl.addEventListener('mouseleave', () => {
      tiltEl.style.transform = '';
    });
  }

  // -----------------------------------------------------
  // Project filter
  // -----------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  // -----------------------------------------------------
  // Testimonial slider
  // -----------------------------------------------------
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('tDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (track && dotsContainer) {
    const slides = track.children;
    let current = 0;
    let auto = null;

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    const goTo = (i) => {
      current = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.t-dot').forEach((d, idx) => {
        d.classList.toggle('active', idx === current);
      });
      restartAuto();
    };

    const restartAuto = () => {
      if (auto) clearInterval(auto);
      auto = setInterval(() => goTo(current + 1), 6000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    restartAuto();

    // Pause on hover
    const wrap = document.getElementById('testimonials');
    if (wrap) {
      wrap.addEventListener('mouseenter', () => { if (auto) clearInterval(auto); });
      wrap.addEventListener('mouseleave', restartAuto);
    }
  }

  // -----------------------------------------------------
  // Contact form (client-side only — friendly handler)
  // -----------------------------------------------------
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !message) {
        status.classList.add('error');
        status.textContent = 'Please fill in all the fields.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.classList.add('error');
        status.textContent = 'Please enter a valid email.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      setTimeout(() => {
        status.classList.add('success');
        status.textContent = 'Thanks ' + name + '! Your message has been sent.';
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
        }
      }, 700);
    });
  }
})();
