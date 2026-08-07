/* ==========================================================================
   CAP RESORTS - LUXURY HOMEPAGE INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Initialize AOS Animation Library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    });
  }

  /* --------------------------------------------------------------------------
     0. LUXURY PRELOADER ANIMATION
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloaderProgress');
  const counter = document.getElementById('preloaderCounter');

  if (preloader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';
        if (counter) counter.innerText = '100%';
        setTimeout(() => {
          preloader.classList.add('loaded');
        }, 250);
      } else {
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (counter) counter.innerText = `${progress}%`;
      }
    }, 50);

    // Fallback safety timeout
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (preloader && !preloader.classList.contains('loaded')) {
          if (progressBar) progressBar.style.width = '100%';
          if (counter) counter.innerText = '100%';
          preloader.classList.add('loaded');
        }
      }, 600);
    });
  }

  /* --------------------------------------------------------------------------
     1. STICKY NAVBAR ON SCROLL
     -------------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar-cap');
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar?.classList.add('scrolled');
      backToTopBtn?.classList.add('active');
    } else {
      navbar?.classList.remove('scrolled');
      backToTopBtn?.classList.remove('active');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger once on load

  /* --------------------------------------------------------------------------
     2. SMOOTH SCROLLING & ACTIVE NAV LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link-cap, .offcanvas-body .nav-link, a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // Smooth click scroll
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Close offcanvas if mobile menu open
          const offcanvasEl = document.getElementById('mobileNav');
          if (offcanvasEl) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (bsOffcanvas) {
              bsOffcanvas.hide();
            }
          }

          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active section observer
  const highlightActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.navbar-nav .nav-link-cap').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav);

  /* --------------------------------------------------------------------------
     3. COUNTER ANIMATION FOR STATS
     -------------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const startCounters = () => {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection || animated) return;

    const sectionPos = aboutSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight;

    if (sectionPos < screenPos - 100) {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 50;

        const updateCounter = () => {
          const current = +counter.innerText;
          if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(updateCounter, 30);
          } else {
            counter.innerText = target;
          }
        };

        updateCounter();
      });
      animated = true;
    }
  };

  window.addEventListener('scroll', startCounters);
  startCounters();

  /* --------------------------------------------------------------------------
     4. GALLERY LIGHTBOX MODAL & CATEGORY FILTERING
     -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryModalEl = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImg');
  const modalTitle = document.getElementById('galleryModalTitle');

  if (galleryItems.length > 0 && galleryModalEl && modalImg) {
    const galleryModal = new bootstrap.Modal(galleryModalEl);

    galleryItems.forEach(item => {
      item.addEventListener('click', function () {
        const imgSrc = this.querySelector('img').getAttribute('src');
        const title = this.querySelector('.gallery-title')?.innerText || 'Cap Resorts Gallery';
        
        modalImg.setAttribute('src', imgSrc);
        if (modalTitle) modalTitle.innerText = title;
        
        galleryModal.show();
      });
    });
  }

  // Interactive Category Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.gallery-masonry-item');

  if (filterBtns.length > 0 && masonryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        masonryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. BOOKING FORM & ROOM RESERVATION HANDLER
     -------------------------------------------------------------------------- */
  const bookingForms = document.querySelectorAll('.booking-form');
  const bookingModalEl = document.getElementById('bookingModal');
  const whatsappNumber = '919995950900';

  bookingForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...';
      }

      // Collect form field values for WhatsApp message
      const formFields = Array.from(this.querySelectorAll('input, select, textarea'));
      const details = [];

      formFields.forEach(field => {
        const value = field.value ? field.value.trim() : '';
        if (value) {
          // Find associated label or fallback to name/placeholder
          let labelText = '';
          const labelEl = field.labels && field.labels.length > 0 ? field.labels[0] : field.closest('.col-md-6, .col-12, div')?.querySelector('label');
          if (labelEl) {
            labelText = labelEl.innerText.trim();
          } else {
            labelText = field.name || field.placeholder || 'Detail';
          }
          
          // Format selected option text if select element
          let displayValue = value;
          if (field.tagName === 'SELECT' && field.selectedIndex >= 0) {
            displayValue = field.options[field.selectedIndex].text.trim();
          }
          details.push(`*${labelText}*: ${displayValue}`);
        }
      });

      const messageHeader = `*Cap Resorts - Booking & Enquiry Request*\n----------------------------------------\n`;
      const fullMessage = messageHeader + details.join('\n');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        
        // Show success alert inside form or modal
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-success mt-3 glass-card text-white border-0 shadow-lg';
        alertBox.innerHTML = '<i class="bi bi-whatsapp text-warning me-2"></i> Thank you! Your request has been recorded. Redirecting to WhatsApp concierge (+91 99959 50900)...';
        
        form.appendChild(alertBox);

        // Open WhatsApp with pre-filled message
        window.open(whatsappUrl, '_blank');

        form.reset();

        setTimeout(() => alertBox.remove(), 6000);

        // Hide modal if open
        if (bookingModalEl) {
          const modalInstance = bootstrap.Modal.getInstance(bookingModalEl);
          if (modalInstance) {
            setTimeout(() => modalInstance.hide(), 2500);
          }
        }
      }, 1500);
    });
  });

  /* --------------------------------------------------------------------------
     6. NEWSLETTER SUBSCRIPTION
     -------------------------------------------------------------------------- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = this.querySelector('button');
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check2"></i>';
        input.value = '';
        input.placeholder = 'Subscribed successfully!';
        setTimeout(() => {
          btn.innerHTML = origText;
          input.placeholder = 'Enter your email...';
        }, 4000);
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. BACK TO TOP CLICK HANDLER
     -------------------------------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
