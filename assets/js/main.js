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
  initProjectFilters();
  initLightbox();
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
   4. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
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
   6. SOLAR SAVINGS CALCULATOR (PM Surya Ghar Model)
   -------------------------------------------------------------------------- */
function initSolarCalculator() {
  const billSlider = document.getElementById('bill-slider');
  const billDisplay = document.getElementById('bill-display');
  const typeRadios = document.querySelectorAll('input[name="customer-type"]');
  
  const kwDisplay = document.getElementById('calc-kw');
  const costDisplay = document.getElementById('calc-cost');
  const subsidyDisplay = document.getElementById('calc-subsidy');
  const netCostDisplay = document.getElementById('calc-net-cost');
  const monthlySavingsDisplay = document.getElementById('calc-monthly-savings');
  const annualSavingsDisplay = document.getElementById('calc-annual-savings');
  const lifetimeSavingsDisplay = document.getElementById('calc-lifetime-savings');
  const paybackDisplay = document.getElementById('calc-payback');
  const roofAreaDisplay = document.getElementById('calc-roof');
  const whatsappCalcBtn = document.getElementById('calc-whatsapp-btn');

  if (!billSlider) return;

  function updateCalculator() {
    const monthlyBill = parseInt(billSlider.value, 10);
    if (billDisplay) {
      billDisplay.textContent = '₹' + monthlyBill.toLocaleString('en-IN');
    }

    let customerType = 'residential';
    typeRadios.forEach(r => {
      if (r.checked) customerType = r.value;
    });

    // Calculations based on MPPKVVCL tariff (~₹7.5/unit)
    // 1kW produces ~120 units/mo (~₹900 savings)
    let recommendedKw = Math.round(monthlyBill / 950);
    if (recommendedKw < 1) recommendedKw = 1;
    if (recommendedKw > 15) recommendedKw = 15;

    // Estimated standard EPC project cost (₹60,000/kW benchmark)
    const baseCostPerKw = 60000;
    const totalCost = recommendedKw * baseCostPerKw;

    // Subsidy calculation (PM Surya Ghar Muft Bijli Yojana)
    let subsidy = 0;
    if (customerType === 'residential') {
      if (recommendedKw === 1) {
        subsidy = 30000;
      } else if (recommendedKw === 2) {
        subsidy = 60000;
      } else {
        subsidy = 78000; // Flat cap for 3kW and above
      }
    } else {
      // Commercial has 40% accelerated depreciation tax savings
      subsidy = 0;
    }

    const netCost = totalCost - subsidy;
    const monthlySavings = Math.min(monthlyBill, recommendedKw * 950);
    const annualSavings = monthlySavings * 12;
    const lifetimeSavings = annualSavings * 25; // 25 years lifecycle
    const paybackYears = (netCost / annualSavings).toFixed(1);
    const roofArea = recommendedKw * 90; // ~90-100 sq.ft per kW

    // Update DOM
    if (kwDisplay) kwDisplay.textContent = recommendedKw + ' kW';
    if (costDisplay) costDisplay.textContent = '₹' + totalCost.toLocaleString('en-IN');
    if (subsidyDisplay) {
      if (customerType === 'residential') {
        subsidyDisplay.textContent = '₹' + subsidy.toLocaleString('en-IN');
      } else {
        subsidyDisplay.textContent = 'Tax Benefit (40% Dep.)';
      }
    }
    if (netCostDisplay) netCostDisplay.textContent = '₹' + netCost.toLocaleString('en-IN');
    if (monthlySavingsDisplay) monthlySavingsDisplay.textContent = '₹' + monthlySavings.toLocaleString('en-IN');
    if (annualSavingsDisplay) annualSavingsDisplay.textContent = '₹' + annualSavings.toLocaleString('en-IN');
    if (lifetimeSavingsDisplay) lifetimeSavingsDisplay.textContent = '₹' + lifetimeSavings.toLocaleString('en-IN');
    if (paybackDisplay) paybackDisplay.textContent = paybackYears + ' Years';
    if (roofAreaDisplay) roofAreaDisplay.textContent = roofArea + ' sq.ft';

    // Update WhatsApp Button Link
    if (whatsappCalcBtn) {
      const msg = `Hello Innovative Energy Solutions! I used your Solar Calculator for my monthly electricity bill of ₹${monthlyBill.toLocaleString('en-IN')}.\n\n*Recommended System:* ${recommendedKw} kW\n*Estimated Net Cost:* ₹${netCost.toLocaleString('en-IN')}\n*Govt Subsidy:* ₹${subsidy.toLocaleString('en-IN')}\n*Annual Savings:* ₹${annualSavings.toLocaleString('en-IN')}\n\nPlease arrange a free roof survey in Ujjain!`;
      whatsappCalcBtn.href = `https://wa.me/917000787022?text=${encodeURIComponent(msg)}`;
    }
  }

  billSlider.addEventListener('input', updateCalculator);
  typeRadios.forEach(r => r.addEventListener('change', updateCalculator));

  // Initial run
  updateCalculator();
}

/* --------------------------------------------------------------------------
   7. PROJECT FILTER TABS
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

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
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. LIGHTBOX MODAL FOR REAL PROJECT IMAGES
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
   9. FAQ ACCORDION
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
