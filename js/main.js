/* ==========================================
   THE INDUS GROUP - CORE INTERACTIONS SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking navigation links
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // 3. Mobile Dropdown Toggle (for Businesses sub-menu)
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownParent = document.querySelector('.dropdown');

  if (dropdownToggle && dropdownParent) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownParent.classList.toggle('active');
      }
    });
  }

  // 4. Highlight Active Navigation Links
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 5. Stat Counter Animation
  const stats = document.querySelectorAll('.stat-number');
  const statSection = document.querySelector('.stats');

  if (stats.length > 0 && statSection) {
    let countStarted = false;

    const startCounting = () => {
      stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const isFloat = stat.getAttribute('data-float') === 'true';
        let current = 0;
        const increment = target / 40; // Speed adjustment
        
        const updateCount = () => {
          current += increment;
          if (current < target) {
            if (isFloat) {
              stat.innerText = current.toFixed(1) + '+';
            } else {
              stat.innerText = Math.ceil(current) + '+';
            }
            setTimeout(updateCount, 25);
          } else {
            stat.innerText = target + '+';
          }
        };
        updateCount();
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countStarted) {
          countStarted = true;
          startCounting();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statSection);
  }

  // 6. Video Overlay Modal (Discover Indus Video modal)
  const videoTriggers = document.querySelectorAll('.video-trigger');
  
  if (videoTriggers.length > 0) {
    // Create and append the modal markup dynamically if it doesn't exist
    let videoModal = document.querySelector('.video-modal');
    if (!videoModal) {
      videoModal = document.createElement('div');
      videoModal.className = 'video-modal';
      videoModal.innerHTML = `
        <div class="video-modal-container">
          <button class="video-close-btn" aria-label="Close video"><i class="fas fa-times"></i></button>
          <div class="video-wrapper">
            <iframe id="promo-iframe" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      `;
      document.body.appendChild(videoModal);
    }

    const promoIframe = document.getElementById('promo-iframe');
    const closeBtn = videoModal.querySelector('.video-close-btn');
    
    // YouTube embedded link based on channel share id
    const ytEmbedUrl = 'https://www.youtube.com/embed/LUxtGChKqM4?autoplay=1';

    videoTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        promoIframe.src = ytEmbedUrl;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });

    const closeModal = () => {
      videoModal.classList.remove('active');
      promoIframe.src = '';
      document.body.style.overflow = 'auto'; // Restore background scroll
    };

    closeBtn.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });
  }

  // 7. Course Filter Tab Control (Skills Page)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterButtons.length > 0 && courseCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active tab style
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        courseCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 8. Interactive CBM Calculator (Tools Page)
  const calcLength = document.getElementById('calc-length');
  const calcWidth = document.getElementById('calc-width');
  const calcHeight = document.getElementById('calc-height');
  const calcQty = document.getElementById('calc-qty');
  const calcUnit = document.getElementById('calc-unit');
  const calcCalculate = document.getElementById('calc-btn');
  const resultCbm = document.getElementById('result-cbm');
  const resultWeight = document.getElementById('result-weight');

  if (calcCalculate) {
    const calculateCBM = () => {
      const l = parseFloat(calcLength.value) || 0;
      const w = parseFloat(calcWidth.value) || 0;
      const h = parseFloat(calcHeight.value) || 0;
      const qty = parseInt(calcQty.value) || 1;
      const unit = calcUnit.value;

      let cbm = 0;
      
      // Calculate Volume
      if (unit === 'm') {
        cbm = l * w * h * qty;
      } else if (unit === 'cm') {
        cbm = (l * w * h * qty) / 1000000;
      } else if (unit === 'in') {
        cbm = (l * w * h * qty) * 0.000016387;
      }

      // Update CBM result field
      resultCbm.innerText = cbm.toFixed(4);

      // Calculate Volumetric Weight (using standard multiplier of 167 kg per CBM for air freight)
      const airVolWeight = cbm * 167;
      resultWeight.innerText = airVolWeight.toFixed(2);
    };

    calcCalculate.addEventListener('click', calculateCBM);
    
    // Auto-calculate on inputs change for premium UX
    [calcLength, calcWidth, calcHeight, calcQty, calcUnit].forEach(el => {
      if (el) el.addEventListener('input', calculateCBM);
    });
  }
});

  // 9. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once revealed
        // observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15, // trigger when 15% of element is visible
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
