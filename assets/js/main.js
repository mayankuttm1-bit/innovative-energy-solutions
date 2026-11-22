/**
 * INNOVATIVE ENERGY SOLUTIONS - MAIN JAVASCRIPT
 * Premium Solar EPC & Clean-Tech Engineering, Ujjain
 * Phone / WhatsApp: +91 7000787022
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initStatsCounters();
  initSolarCalculator();
  initProjectsCarousel();
  initProjectFilters();
  initLightbox();
  initReviewsCarousel();
  initFaqAccordion();
  initQuoteForm();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   3. SMOOTH SCROLLING FOR NAV ANCHORS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS (SMOOTH DYNAMIC ENTRY AS USER SCROLLS DOWN)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  document.documentElement.classList.add('js-ready');
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  // Use IntersectionObserver with a balanced threshold so animations trigger dynamically as user scrolls
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => {
    // Only elements initially visible on first screen load are revealed immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50 && rect.bottom > 50) {
      el.classList.add('revealed');
    } else {
      observer.observe(el);
    }
  });

  // Passive scroll check (fallback only for elements actually entering viewport, NEVER blanket reveals offscreen elements)
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        reveals.forEach(el => {
          if (!el.classList.contains('revealed')) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
              el.classList.add('revealed');
              observer.unobserve(el);
            }
          }
        });
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   5. ANIMATED STAT COUNTERS
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const statElements = document.querySelectorAll('.stat-counter');
  if (!statElements.length) return;

  let triggered = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        statElements.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';
          const prefix = counter.getAttribute('data-prefix') || '';
          const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
          const duration = 1800;
          const startTime = performance.now();

          function updateNumber(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = (ease * target).toFixed(decimals);
            counter.innerText = prefix + current + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              counter.innerText = prefix + target.toFixed(decimals) + suffix;
            }
          }

          requestAnimationFrame(updateNumber);
        });
      }
    });
  }, { threshold: 0.3 });

  const section = document.getElementById('highlights');
  if (section) observer.observe(section);
}

/* --------------------------------------------------------------------------
   6. SOLAR SAVINGS CALCULATOR (Simple & Clean PM Surya Ghar Model)
   -------------------------------------------------------------------------- */
function initSolarCalculator() {
  const billSlider = document.getElementById('bill-slider');
  const billDisplay = document.getElementById('bill-display');
  const presetChips = document.querySelectorAll('.calc-preset-chip');
  
  const kwDisplay = document.getElementById('calc-kw');
  const costDisplay = document.getElementById('calc-cost');
  const subsidyDisplay = document.getElementById('calc-subsidy');
  const netCostDisplay = document.getElementById('calc-net-cost');
  const annualSavingsDisplay = document.getElementById('calc-annual-savings');
  const paybackDisplay = document.getElementById('calc-payback');
  const roofAreaDisplay = document.getElementById('calc-roof');
  const whatsappCalcBtn = document.getElementById('calc-whatsapp-btn');

  if (!billSlider) return;

  function updateCalculator(monthlyBill) {
    if (typeof monthlyBill === 'undefined') {
      monthlyBill = parseInt(billSlider.value, 10);
    } else {
      billSlider.value = monthlyBill;
    }

    if (billDisplay) {
      billDisplay.textContent = '₹' + monthlyBill.toLocaleString('en-IN');
    }

    // Update active state of preset chips
    presetChips.forEach(chip => {
      const chipVal = parseInt(chip.getAttribute('data-bill'), 10);
      if (chipVal === monthlyBill) {
        chip.className = 'calc-preset-chip px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition-colors';
      } else {
        chip.className = 'calc-preset-chip px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors';
      }
    });

    // Calculations based on MPPKVVCL domestic tariff (~₹7.5/unit)
    // 1kW produces ~120 units/mo (~₹900 savings)
    let recommendedKw = Math.round(monthlyBill / 950);
    if (recommendedKw < 1) recommendedKw = 1;
    if (recommendedKw > 15) recommendedKw = 15;

    // Standard benchmark EPC cost
    const baseCostPerKw = 60000;
    const totalCost = recommendedKw * baseCostPerKw;

    // PM Surya Ghar Subsidy (DBT Direct To Bank)
    let subsidy = 0;
    if (recommendedKw === 1) {
      subsidy = 30000;
    } else if (recommendedKw === 2) {
      subsidy = 60000;
    } else {
      subsidy = 78000; // Flat cap for 3kW and above
    }

    const netCost = totalCost - subsidy;
    const annualSavings = recommendedKw * 120 * 12 * 7.5; // ~120 units/mo * 12 mos * 7.5/unit
    const paybackYears = (netCost / annualSavings).toFixed(1);
    const roofArea = recommendedKw * 90; // ~90 sq.ft per kW

    // Update DOM elements cleanly
    if (kwDisplay) kwDisplay.textContent = recommendedKw + ' kW';
    if (costDisplay) costDisplay.textContent = 'Total: ₹' + totalCost.toLocaleString('en-IN');
    if (subsidyDisplay) subsidyDisplay.textContent = '₹' + subsidy.toLocaleString('en-IN');
    if (netCostDisplay) netCostDisplay.textContent = '₹' + netCost.toLocaleString('en-IN');
    if (annualSavingsDisplay) annualSavingsDisplay.textContent = '₹' + Math.round(annualSavings).toLocaleString('en-IN');
    if (paybackDisplay) paybackDisplay.textContent = `Payback in ~${paybackYears} Yrs`;
    if (roofAreaDisplay) roofAreaDisplay.textContent = `Requires ~${roofArea} sq.ft`;

    // WhatsApp Message
    if (whatsappCalcBtn) {
      const msg = `Hello Innovative Energy Solutions! I used your Solar Calculator for my monthly bill of ₹${monthlyBill.toLocaleString('en-IN')}.\n\n*Recommended System:* ${recommendedKw} kW\n*PM Surya Ghar Subsidy:* ₹${subsidy.toLocaleString('en-IN')}\n*Net Cost:* ₹${netCost.toLocaleString('en-IN')}\n*Annual Savings:* ₹${Math.round(annualSavings).toLocaleString('en-IN')}/year\n\nPlease arrange a free roof survey in Ujjain!`;
      whatsappCalcBtn.href = `https://wa.me/917000787022?text=${encodeURIComponent(msg)}`;
    }
  }

  billSlider.addEventListener('input', function() {
    updateCalculator(parseInt(this.value, 10));
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', function() {
      const val = parseInt(this.getAttribute('data-bill'), 10);
      updateCalculator(val);
    });
  });

  // Initial run
  updateCalculator(3500);
}

/* --------------------------------------------------------------------------
   7. HORIZONTAL SCROLLABLE PROJECTS CAROUSEL (STEP-BY-STEP 3-SECOND ADVANCE)
   -------------------------------------------------------------------------- */
let isProjectDragging = false;

function initProjectsCarousel() {
  const track = document.getElementById('projects-scroll-track');
  const prevBtn = document.getElementById('project-prev-btn');
  const nextBtn = document.getElementById('project-next-btn');
  const progressBar = document.getElementById('projects-scroll-progress');

  if (!track) return;

  let isPaused = false;
  let isPointerDown = false;
  let startX = 0;
  let scrollStart = 0;
  let dragDistance = 0;
  let stepInterval = null;

  function updateProgressBar() {
    if (!progressBar) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll > 0) {
      const percentage = Math.min(Math.max((track.scrollLeft / maxScroll) * 100, 8), 100);
      progressBar.style.width = percentage + '%';
    }
  }

  function getStepDistance() {
    const visibleCards = Array.from(track.querySelectorAll('.project-card')).filter(c => c.style.display !== 'none');
    if (visibleCards.length) {
      return visibleCards[0].offsetWidth + 24; // Card width + 1.5rem (24px) gap
    }
    return 340;
  }

  // Smoothly move by exactly one card
  function advanceOneCard() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 5) return;

    const step = getStepDistance();
    if (track.scrollLeft >= maxScroll - 20) {
      // Loop smoothly back to beginning
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
    setTimeout(updateProgressBar, 350);
  }

  function retreatOneCard() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 5) return;

    const step = getStepDistance();
    if (track.scrollLeft <= 20) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    }
    setTimeout(updateProgressBar, 350);
  }

  // 3-second auto-advance timer
  function startAutoAdvance() {
    stopAutoAdvance();
    stepInterval = setInterval(() => {
      if (!isPaused && !isPointerDown) {
        advanceOneCard();
      }
    }, 3000);
  }

  function stopAutoAdvance() {
    if (stepInterval) {
      clearInterval(stepInterval);
      stepInterval = null;
    }
  }

  // Initialize auto-advance
  startAutoAdvance();

  // Pause on hover
  track.addEventListener('mouseenter', () => {
    isPaused = true;
    stopAutoAdvance();
  });

  track.addEventListener('mouseleave', () => {
    if (!isPointerDown) {
      isPaused = false;
      startAutoAdvance();
    }
  });

  // Touch events for mobile
  track.addEventListener('touchstart', () => {
    isPaused = true;
    stopAutoAdvance();
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isPaused = false;
    setTimeout(startAutoAdvance, 1500);
  });

  // Manual Prev / Next navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      advanceOneCard();
      startAutoAdvance(); // Reset 3s timer
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      retreatOneCard();
      startAutoAdvance(); // Reset 3s timer
    });
  }

  // Mouse Drag-to-Scroll (Desktop)
  track.addEventListener('mousedown', (e) => {
    isPointerDown = true;
    stopAutoAdvance();
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
    dragDistance = 0;
    isProjectDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPointerDown) return;
    const currentX = e.pageX - track.offsetLeft;
    const delta = currentX - startX;
    dragDistance = Math.abs(delta);
    if (dragDistance > 6) {
      isProjectDragging = true;
      e.preventDefault();
      track.scrollLeft = scrollStart - (delta * 1.3);
      updateProgressBar();
    }
  });

  window.addEventListener('mouseup', () => {
    if (isPointerDown) {
      isPointerDown = false;
      setTimeout(() => {
        isProjectDragging = false;
        startAutoAdvance();
      }, 50);
    }
  });

  track.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();
}

/* --------------------------------------------------------------------------
   8. PROJECT FILTER TABS
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const track = document.getElementById('projects-scroll-track');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-slate-900', 'text-white');
        b.classList.add('bg-white', 'text-slate-700');
      });
      btn.classList.remove('bg-white', 'text-slate-700');
      btn.classList.add('bg-slate-900', 'text-white');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      // Reset scroll position to beginning
      if (track) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. LIGHTBOX MODAL FOR REAL PROJECT IMAGES
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const triggerBtns = document.querySelectorAll('.lightbox-trigger');

  if (!modal || !modalImg) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Don't open if user was dragging/swiping the carousel
      if (isProjectDragging) return;

      const src = btn.getAttribute('data-src');
      const caption = btn.getAttribute('data-caption') || 'Innovative Energy Solutions - On-Site Installation';
      modalImg.src = src;
      if (modalCaption) modalCaption.textContent = caption;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   9. HORIZONTAL SCROLLABLE REVIEWS CAROUSEL (STEP-BY-STEP 3-SECOND ADVANCE)
   -------------------------------------------------------------------------- */
let isReviewDragging = false;

function initReviewsCarousel() {
  const track = document.getElementById('reviews-scroll-track');
  const prevBtn = document.getElementById('review-prev-btn');
  const nextBtn = document.getElementById('review-next-btn');
  const progressBar = document.getElementById('reviews-scroll-progress');

  if (!track) return;

  let isPaused = false;
  let isPointerDown = false;
  let startX = 0;
  let scrollStart = 0;
  let dragDistance = 0;
  let stepInterval = null;

  function updateProgressBar() {
    if (!progressBar) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll > 0) {
      const percentage = Math.min(Math.max((track.scrollLeft / maxScroll) * 100, 8), 100);
      progressBar.style.width = percentage + '%';
    }
  }

  function getStepDistance() {
    const card = track.querySelector('.review-card-slide');
    return card ? (card.offsetWidth + 24) : 340;
  }

  function advanceOneReview() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 5) return;

    const step = getStepDistance();
    if (track.scrollLeft >= maxScroll - 20) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
    setTimeout(updateProgressBar, 350);
  }

  function retreatOneReview() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 5) return;

    const step = getStepDistance();
    if (track.scrollLeft <= 20) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    }
    setTimeout(updateProgressBar, 350);
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    stepInterval = setInterval(() => {
      if (!isPaused && !isPointerDown) {
        advanceOneReview();
      }
    }, 3000);
  }

  function stopAutoAdvance() {
    if (stepInterval) {
      clearInterval(stepInterval);
      stepInterval = null;
    }
  }

  startAutoAdvance();

  track.addEventListener('mouseenter', () => {
    isPaused = true;
    stopAutoAdvance();
  });

  track.addEventListener('mouseleave', () => {
    if (!isPointerDown) {
      isPaused = false;
      startAutoAdvance();
    }
  });

  track.addEventListener('touchstart', () => {
    isPaused = true;
    stopAutoAdvance();
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isPaused = false;
    setTimeout(startAutoAdvance, 1500);
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      advanceOneReview();
      startAutoAdvance();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      retreatOneReview();
      startAutoAdvance();
    });
  }

  track.addEventListener('mousedown', (e) => {
    isPointerDown = true;
    stopAutoAdvance();
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
    dragDistance = 0;
    isReviewDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPointerDown) return;
    const currentX = e.pageX - track.offsetLeft;
    const delta = currentX - startX;
    dragDistance = Math.abs(delta);
    if (dragDistance > 6) {
      isReviewDragging = true;
      e.preventDefault();
      track.scrollLeft = scrollStart - (delta * 1.3);
      updateProgressBar();
    }
  });

  window.addEventListener('mouseup', () => {
    if (isPointerDown) {
      isPointerDown = false;
      setTimeout(() => {
        isReviewDragging = false;
        startAutoAdvance();
      }, 50);
    }
  });

  track.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();
}

/* --------------------------------------------------------------------------
   10. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. CONTACT / GET FREE QUOTE FORM
   -------------------------------------------------------------------------- */
function initQuoteForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#quote-name')?.value.trim() || '';
    const phone = form.querySelector('#quote-phone')?.value.trim() || '';
    const bill = form.querySelector('#quote-bill')?.value || '₹3,000 - ₹5,000';
    const roof = form.querySelector('#quote-roof')?.value || 'Flat RCC Roof';
    const location = form.querySelector('#quote-location')?.value.trim() || 'Ujjain';

    if (!name || !phone) {
      alert('Please enter your Name and Mobile Number.');
      return;
    }

    const msg = `*NEW SOLAR INQUIRY - WEBSITE*\n\n*Name:* ${name}\n*Mobile:* ${phone}\n*Location:* ${location}\n*Monthly Bill:* ${bill}\n*Roof Type:* ${roof}\n\nPlease share customized solar quotation and subsidy details!`;
    const waUrl = `https://wa.me/917000787022?text=${encodeURIComponent(msg)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Show friendly success feedback
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Inquiry Sent via WhatsApp!</span>`;
      btn.classList.remove('bg-amber-500', 'hover:bg-amber-600');
      btn.classList.add('bg-emerald-600');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-emerald-600');
        btn.classList.add('bg-amber-500', 'hover:bg-amber-600');
        form.reset();
      }, 4000);
    }
  });
}
