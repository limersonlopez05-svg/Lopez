/**
 * Main Application Logic for Limerson Lopez Portfolio
 * Handles preloader, navbar scrollspy, hero typewriter, About Easter egg & counters,
 * Resume modal, Portfolio tabs & case study modal, and direct Contact/Socials.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let toastTimer = null;
  function showToast(message, type) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    const toastDot = document.getElementById('toast-dot');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (toastDot) {
      toastDot.className = 'w-2 h-2 rounded-full ' + (type === 'error' ? 'bg-rose-400' : 'bg-blue-400');
    }

    toast.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3200);
  }

  /* ------------------------------------------------------------------------
     1. Preloader Screen (0% -> 100%)
     ------------------------------------------------------------------------ */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const percentEl = document.getElementById('preloader-percent');
    const barEl = document.getElementById('preloader-bar');
    if (!preloader || !percentEl || !barEl) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReduced ? 220 : 750;
    const start = performance.now();
    let finished = false;

    function complete() {
      if (finished) return;
      finished = true;
      percentEl.textContent = '100%';
      barEl.style.width = '100%';
      setTimeout(function () {
        preloader.classList.add('is-done');
        preloader.setAttribute('aria-hidden', 'true');
      }, 120);
    }

    function tick(now) {
      if (finished) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);

      percentEl.textContent = pct + '%';
      barEl.style.width = pct + '%';

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        complete();
      }
    }

    requestAnimationFrame(tick);
    setTimeout(complete, duration + 250);
  }

  /* ------------------------------------------------------------------------
     2. Floating Pill Navbar
     ------------------------------------------------------------------------ */
  function initNavbar() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link[data-section]'));
    const sections = ['home', 'about', 'portfolio', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    function setActive(id) {
      navLinks.forEach(function (link) {
        if (link.getAttribute('data-section') === id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    function updateActiveOnScroll() {
      const scrollMid = window.scrollY + window.innerHeight * 0.34;
      let currentId = 'home';
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollMid) {
          currentId = sec.id;
        }
      });
      setActive(currentId);
    }

    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
    updateActiveOnScroll();
  }

  /* ------------------------------------------------------------------------
     3. Hero Typewriter Sub-heading
     ------------------------------------------------------------------------ */
  function initTypewriter() {
    const target = document.getElementById('hero-typewriter');
    if (!target) return;

    const phrases = [
      'Full-Stack Web Developer',
      '3D Graphics & Python Scripter',
      'BSIT Student @ STI College Batangas',
      'Network Security Enthusiast'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function step() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx += 1;
        target.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(step, 1750);
          return;
        }
        setTimeout(step, 54);
      } else {
        charIdx -= 1;
        target.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(step, 340);
          return;
        }
        setTimeout(step, 30);
      }
    }

    setTimeout(step, 650);
  }

  /* ------------------------------------------------------------------------
     4. About Me Interactions (Easter Egg Portrait & Animated Counters)
     ------------------------------------------------------------------------ */
  function initAboutInteractions() {
    const portraitBox = document.getElementById('about-portrait-box');
    const badgeLabel = document.getElementById('easter-egg-badge');

    if (portraitBox) {
      function updateEasterBadge(active) {
        if (!badgeLabel) return;
        badgeLabel.textContent = active ? 'STI Campus Mode ⛰️' : 'Hover or Click Portrait ✨';
      }

      portraitBox.addEventListener('click', function () {
        const revealed = portraitBox.classList.toggle('is-revealed');
        portraitBox.setAttribute('aria-pressed', revealed ? 'true' : 'false');
        updateEasterBadge(revealed);
        if (window.PortfolioAudio) window.PortfolioAudio.playUiTick(revealed ? 880 : 520);
      });

      portraitBox.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          portraitBox.click();
        }
      });

      portraitBox.addEventListener('mouseenter', function () {
        updateEasterBadge(true);
      });

      portraitBox.addEventListener('mouseleave', function () {
        if (!portraitBox.classList.contains('is-revealed')) {
          updateEasterBadge(false);
        }
      });
    }

    // Animated Stat Counters
    const projectsCounter = document.getElementById('about-projects-counter');
    if (projectsCounter && window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.projects)) {
      const projCount = String(window.PORTFOLIO_DATA.projects.length);
      projectsCounter.dataset.target = projCount;
      projectsCounter.textContent = projCount + (projectsCounter.dataset.suffix || '');
    }

    const counters = Array.from(document.querySelectorAll('.stat-counter[data-target]'));
    if (!counters.length) return;

    function animateCounter(el) {
      if (el.dataset.counted === 'true') return;
      el.dataset.counted = 'true';
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(eased * target);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      counters.forEach((c) => obs.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ------------------------------------------------------------------------
     5. Document Modals: Resume & Cover Letter (triggered from Hero CTAs)
     ------------------------------------------------------------------------ */
  function setupDocumentModal(openBtnId, modalId, closeAttr) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    if (!modal) return null;

    const closeBtns = modal.querySelectorAll('[' + closeAttr + ']');
    let lastTrigger = null;

    function openModal(triggerEl) {
      lastTrigger = triggerEl || document.activeElement;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      const firstClose = modal.querySelector('[' + closeAttr + ']');
      if (firstClose) firstClose.focus({ preventScroll: true });
      if (window.PortfolioAudio) window.PortfolioAudio.playUiTick(780);
    }

    function closeModal() {
      if (modal.classList.contains('hidden')) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus({ preventScroll: true });
      }
    }

    if (openBtn) {
      openBtn.addEventListener('click', function () {
        openModal(openBtn);
      });
    }

    closeBtns.forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    return modal;
  }

  function initDocumentModals() {
    setupDocumentModal('open-resume-modal-btn', 'resume-modal', 'data-close-resume-modal');
    const coverModal = setupDocumentModal(
      'open-cover-letter-modal-btn',
      'cover-letter-modal',
      'data-close-cover-letter-modal'
    );
    if (!coverModal) return;

    const modeBtns = Array.from(coverModal.querySelectorAll('.cover-view-btn[data-cover-view]'));
    const panels = Array.from(coverModal.querySelectorAll('[data-cover-panel]'));

    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-cover-view');
        modeBtns.forEach(function (b) {
          const active = b === btn;
          b.setAttribute('aria-selected', active ? 'true' : 'false');
          b.classList.toggle('btn-electric', active);
          b.classList.toggle('text-white', active);
          b.classList.toggle('text-slate-300', !active);
        });
        panels.forEach(function (p) {
          p.classList.toggle('hidden', p.getAttribute('data-cover-panel') !== target);
        });
        if (window.PortfolioAudio) window.PortfolioAudio.playUiTick(680);
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Portfolio Tabs & Project Case Study Modal
     ------------------------------------------------------------------------ */
  function initPortfolioTabsAndModal() {
    const data = window.PORTFOLIO_DATA;
    if (!data) return;

    const tabButtons = Array.from(document.querySelectorAll('.portfolio-tab[data-tab]'));
    const stage = document.getElementById('portfolio-stage');
    if (!stage || !tabButtons.length) return;

    let activeTab = 'projects';
    let lastFocusedTrigger = null;

    function renderProjects() {
      return (
        '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 tab-panel-enter">' +
        data.projects
          .map(function (proj) {
            return (
              '<article class="glass-card rounded-2xl overflow-hidden flex flex-col group">' +
                '<div class="relative aspect-video overflow-hidden bg-slate-950 border-b border-white/10">' +
                  '<img src="' + escapeHTML(proj.image) + '" alt="' + escapeHTML(proj.imageAlt) + '" ' +
                  'class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105">' +
                '</div>' +
                '<div class="p-6 flex-1 flex flex-col">' +
                  '<div class="flex items-center justify-between gap-2 mb-3">' +
                    '<span class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 border border-blue-400/25 text-blue-300">' +
                      escapeHTML(proj.badge) +
                    '</span>' +
                    '<span class="text-xs font-mono-tech text-slate-400 shrink-0">' + escapeHTML(proj.year) + '</span>' +
                  '</div>' +
                  '<h3 class="text-lg font-bold text-white leading-snug mb-2.5 group-hover:text-blue-300 transition-colors">' +
                    escapeHTML(proj.title) +
                  '</h3>' +
                  '<p class="text-sm text-slate-400 leading-relaxed mb-5 flex-1">' +
                    escapeHTML(proj.shortDescription) +
                  '</p>' +
                  '<div class="flex flex-wrap gap-1.5 mb-5">' +
                    proj.technologies.slice(0, 4).map(function (tech) {
                      return '<span class="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 border border-blue-400/20 text-blue-300">' + escapeHTML(tech) + '</span>';
                    }).join('') +
                  '</div>' +
                  '<div class="flex items-center justify-between pt-3 border-t border-white/10">' +
                    '<a href="' + escapeHTML(proj.repoUrl) + '" target="_blank" rel="noopener noreferrer" ' +
                      'class="text-xs font-medium text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1">' +
                      '<span>Source</span><svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>' +
                    '</a>' +
                    '<button type="button" data-project-id="' + escapeHTML(proj.id) + '" ' +
                      'class="open-project-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600/90 hover:bg-blue-500 shadow-[0_6px_18px_-4px_rgba(59,130,246,0.55)] transition-all">' +
                      'Details <span aria-hidden="true">→</span>' +
                    '</button>' +
                  '</div>' +
                '</div>' +
              '</article>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function renderCertificates() {
      return (
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 tab-panel-enter">' +
        data.certificates
          .map(function (cert) {
            return (
              '<article class="glass-card rounded-2xl p-6 flex flex-col justify-between">' +
                '<div>' +
                  '<div class="flex items-center justify-between gap-3 mb-4">' +
                    '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 border border-blue-400/30 text-blue-300">' +
                      '<svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15l-3.5 2 1-4-3-2.5 4-.3L12 6l1.5 4.2 4 .3-3 2.5 1 4z"/></svg>' +
                      'Credential' +
                    '</span>' +
                    '<span class="text-xs font-mono-tech text-slate-400">' + escapeHTML(cert.credentialCode) + ' • ' + escapeHTML(cert.date) + '</span>' +
                  '</div>' +
                  '<h3 class="text-lg font-bold text-white mb-1.5">' + escapeHTML(cert.title) + '</h3>' +
                  '<p class="text-xs font-medium text-blue-400 mb-3">' + escapeHTML(cert.issuer) + '</p>' +
                  '<p class="text-sm text-slate-400 leading-relaxed mb-5">' + escapeHTML(cert.summary) + '</p>' +
                '</div>' +
                '<div class="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">' +
                  cert.tags.map(function (t) {
                    return '<span class="px-2.5 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-slate-300">' + escapeHTML(t) + '</span>';
                  }).join('') +
                '</div>' +
              '</article>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function renderTechStack() {
      return (
        '<div class="flex flex-wrap justify-center gap-4 tab-panel-enter">' +
        data.techStack
          .map(function (tech) {
            return (
              '<div class="w-36 sm:w-40 glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 aspect-square group">' +
                '<div class="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 transition-transform duration-300 group-hover:scale-110" ' +
                  'style="background:' + escapeHTML(tech.bg) + '">' +
                  tech.svg +
                '</div>' +
                '<span class="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">' +
                  escapeHTML(tech.name) +
                '</span>' +
              '</div>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function switchTab(tabName) {
      activeTab = tabName;
      tabButtons.forEach(function (btn) {
        const isCurrent = btn.dataset.tab === tabName;
        btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        if (isCurrent) {
          btn.className = 'portfolio-tab px-5 py-2.5 rounded-full text-sm font-semibold text-white btn-electric transition-all inline-flex items-center gap-2';
        } else {
          btn.className = 'portfolio-tab px-5 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all inline-flex items-center gap-2';
        }
      });

      if (tabName === 'projects') stage.innerHTML = renderProjects();
      else if (tabName === 'certificates') stage.innerHTML = renderCertificates();
      else if (tabName === 'techstack') stage.innerHTML = renderTechStack();
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.dataset.tab);
        if (window.PortfolioAudio) window.PortfolioAudio.playUiTick(620);
      });
    });

    // Expose quick project tab switcher for Hero/About "View Projects" buttons
    window.activateProjectsTab = function () {
      switchTab('projects');
    };

    /* Project Case Study Detail Modal */
    const modal = document.getElementById('project-modal');
    const modalBreadcrumb = document.getElementById('modal-breadcrumb-title');
    const modalTitle = document.getElementById('modal-project-title');
    const modalBadge = document.getElementById('modal-project-badge');
    const modalOverview = document.getElementById('modal-project-overview');
    const modalHighlights = document.getElementById('modal-project-highlights');
    const modalTech = document.getElementById('modal-project-tech');
    const modalImage = document.getElementById('modal-project-image');
    const modalRepo = document.getElementById('modal-project-repo');
    const modalCloseBtns = document.querySelectorAll('[data-close-project-modal]');

    function openProjectModal(projectId, triggerEl) {
      const proj = data.projects.find((p) => p.id === projectId);
      if (!proj || !modal) return;
      lastFocusedTrigger = triggerEl || document.activeElement;

      modalBreadcrumb.textContent = proj.title;
      modalTitle.textContent = proj.title;
      modalBadge.textContent = proj.badge + ' • ' + proj.year;
      modalOverview.textContent = proj.overview;
      modalImage.src = proj.image;
      modalImage.alt = proj.imageAlt;
      modalRepo.href = proj.repoUrl;

      modalHighlights.innerHTML = proj.highlights
        .map(function (item) {
          return (
            '<li class="flex items-start gap-2.5 text-sm text-slate-300">' +
              '<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>' +
              '<span>' + escapeHTML(item) + '</span>' +
            '</li>'
          );
        })
        .join('');

      modalTech.innerHTML = proj.technologies
        .map(function (t) {
          return (
            '<span class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/15 border border-blue-400/30 text-blue-200">' +
              escapeHTML(t) +
            '</span>'
          );
        })
        .join('');

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';

      const backBtn = modal.querySelector('[data-close-project-modal]');
      if (backBtn) backBtn.focus();
      if (window.PortfolioAudio) window.PortfolioAudio.playUiTick(780);
    }

    function closeProjectModal() {
      if (!modal || modal.classList.contains('hidden')) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }
    }

    stage.addEventListener('click', function (e) {
      const btn = e.target.closest('.open-project-btn[data-project-id]');
      if (!btn) return;
      openProjectModal(btn.dataset.projectId, btn);
    });

    modalCloseBtns.forEach(function (btn) {
      btn.addEventListener('click', closeProjectModal);
    });

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeProjectModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeProjectModal();
    });

    // Initial render
    switchTab('projects');
  }

  /* ------------------------------------------------------------------------
     7. Contact & Social Links Stack
     ------------------------------------------------------------------------ */
  function initContactSocials() {
    const data = window.PORTFOLIO_DATA;
    const socialStack = document.getElementById('contact-social-stack');
    if (!socialStack || !data || !data.socials) return;

    socialStack.innerHTML = data.socials
      .map(function (s) {
        return (
          '<a href="' + escapeHTML(s.url) + '" target="_blank" rel="noopener noreferrer" ' +
            'class="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 group ' + s.accent + '">' +
            '<div class="flex items-center gap-3.5 min-w-0">' +
              '<div class="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-400/25 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 group-hover:text-white transition-colors">' +
                s.icon +
              '</div>' +
              '<div class="min-w-0">' +
                '<div class="flex items-center gap-2 min-w-0">' +
                  '<span class="text-sm font-bold text-white shrink-0">' + escapeHTML(s.name) + '</span>' +
                  '<span class="text-xs font-mono-tech text-blue-400 truncate">' + escapeHTML(s.handle) + '</span>' +
                '</div>' +
                '<p class="text-xs text-slate-400 truncate">' + escapeHTML(s.subtitle) + '</p>' +
              '</div>' +
            '</div>' +
            '<span class="text-slate-400 group-hover:text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-base shrink-0" aria-hidden="true">↗</span>' +
          '</a>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     8. Scroll Reveal, Smooth Navigation Helpers & Back to Top
     ------------------------------------------------------------------------ */
  function initScrollRevealsAndShortcuts() {
    const revealEls = Array.from(document.querySelectorAll('.reveal-up'));
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => obs.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    document.querySelectorAll('[data-jump-projects]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeof window.activateProjectsTab === 'function') {
          window.activateProjectsTab();
        }
      });
    });

    const backTopBtn = document.getElementById('back-to-top-btn');
    if (backTopBtn) {
      backTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initNavbar();
    initTypewriter();
    initAboutInteractions();
    initDocumentModals();
    initPortfolioTabsAndModal();
    initContactSocials();
    initScrollRevealsAndShortcuts();
  });
})();
