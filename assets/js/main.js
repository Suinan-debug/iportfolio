/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  if (headerToggleBtn) {
    function headerToggle() {
      const header = document.querySelector('#header');
      const isOpen = header.classList.toggle('header-show');
      headerToggleBtn.classList.toggle('is-open', isOpen);
      headerToggleBtn.setAttribute('aria-expanded', String(isOpen));
    }
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show') && typeof headerToggle === 'function') {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    const removePreloader = () => {
      preloader.remove();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removePreloader, { once: true });
    } else {
      removePreloader();
    }
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Hero parallax tilt
   */
  const heroPortraitImage = document.querySelector('.portrait-image');

  if (heroPortraitImage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const faceViews = [
      ['Upper Left Side.png', 'Upper.png', 'Upper Right Side.png'],
      ['Left Side.png', 'Front.png', 'Right Side.png'],
      ['Bottom Left Side.png', 'Bottom.png', 'Bottom Right Side.png']
    ];
    const facePath = 'assets/img/Face/';

    const preloadFaceViews = () => {
      faceViews.flat().filter((view) => view !== 'Front.png').forEach((view) => {
        const image = new Image();
        image.src = `${facePath}${view}`;
      });
    };

    const scheduleFacePreload = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preloadFaceViews, { timeout: 2500 });
      } else {
        window.setTimeout(preloadFaceViews, 1200);
      }
    };

    if (document.readyState === 'complete') {
      scheduleFacePreload();
    } else {
      window.addEventListener('load', scheduleFacePreload, { once: true });
    }

    const handleHeroPointerMove = (event) => {
      const px = Math.max(0, Math.min(0.999, event.clientX / window.innerWidth));
      const py = Math.max(0, Math.min(0.999, event.clientY / window.innerHeight));
      const column = Math.floor(px * 3);
      const row = Math.floor(py * 3);
      const nextView = `${facePath}${faceViews[row][column]}`;

      if (heroPortraitImage.getAttribute('src') !== nextView) {
        heroPortraitImage.src = nextView;
      }
    };

    const resetHeroPointer = () => {
      heroPortraitImage.src = `${facePath}Front.png`;
    };

    document.addEventListener('pointermove', handleHeroPointerMove);
    window.addEventListener('blur', resetHeroPointer);
  }

  const heroShell = document.querySelector('.hero-shell');
  const heroNetworkCanvas = document.querySelector('.hero-network');
  const heroNetworkContext = heroNetworkCanvas && heroNetworkCanvas.getContext('2d');

  if (heroShell && heroNetworkCanvas && heroNetworkContext) {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: null, y: null };
    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let previousFrameTime = 0;

    const renderHeroNetwork = (timestamp, animate) => {
      if (animate && !reducedMotionQuery.matches && !document.hidden) {
        animationFrame = window.requestAnimationFrame((nextTimestamp) => renderHeroNetwork(nextTimestamp, true));
      } else {
        animationFrame = 0;
      }

      const elapsed = previousFrameTime ? Math.min((timestamp - previousFrameTime) / 16.67, 2) : 1;
      previousFrameTime = timestamp;
      heroNetworkContext.clearRect(0, 0, canvasWidth, canvasHeight);

      particles.forEach((particle) => {
        if (animate && !reducedMotionQuery.matches) {
          particle.x += particle.vx * elapsed;
          particle.y += particle.vy * elapsed;

          if (particle.x < 0 || particle.x > canvasWidth) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvasHeight) particle.vy *= -1;

          particle.x = Math.max(0, Math.min(canvasWidth, particle.x));
          particle.y = Math.max(0, Math.min(canvasHeight, particle.y));

          if (pointer.x !== null) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 0 && distance < 135) {
              const force = (135 - distance) / 135 * 0.035 * elapsed;
              particle.vx += dx / distance * force;
              particle.vy += dy / distance * force;
            }
          }

          particle.vx = Math.max(-0.42, Math.min(0.42, particle.vx));
          particle.vy = Math.max(-0.42, Math.min(0.42, particle.vy));
        }
      });

      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        const first = particles[firstIndex];
        for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
          const second = particles[secondIndex];
          const distance = Math.hypot(second.x - first.x, second.y - first.y);
          if (distance < 148) {
            const opacity = (1 - distance / 148) * 0.24;
            heroNetworkContext.strokeStyle = `rgba(150, 190, 220, ${opacity})`;
            heroNetworkContext.lineWidth = 0.8;
            heroNetworkContext.beginPath();
            heroNetworkContext.moveTo(first.x, first.y);
            heroNetworkContext.lineTo(second.x, second.y);
            heroNetworkContext.stroke();
          }
        }

        if (pointer.x !== null) {
          const distanceToPointer = Math.hypot(first.x - pointer.x, first.y - pointer.y);
          if (distanceToPointer < 180) {
            const opacity = (1 - distanceToPointer / 180) * 0.42;
            heroNetworkContext.strokeStyle = `rgba(20, 157, 221, ${opacity})`;
            heroNetworkContext.lineWidth = 1;
            heroNetworkContext.beginPath();
            heroNetworkContext.moveTo(first.x, first.y);
            heroNetworkContext.lineTo(pointer.x, pointer.y);
            heroNetworkContext.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        heroNetworkContext.beginPath();
        heroNetworkContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        heroNetworkContext.fillStyle = 'rgba(225, 239, 250, 0.68)';
        heroNetworkContext.fill();
      });

      if (pointer.x !== null) {
        heroNetworkContext.beginPath();
        heroNetworkContext.arc(pointer.x, pointer.y, 2.5, 0, Math.PI * 2);
        heroNetworkContext.fillStyle = 'rgba(20, 157, 221, 0.9)';
        heroNetworkContext.fill();
      }
    };

    const resizeHeroNetwork = () => {
      const bounds = heroShell.getBoundingClientRect();
      canvasWidth = bounds.width;
      canvasHeight = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      heroNetworkCanvas.width = Math.round(canvasWidth * pixelRatio);
      heroNetworkCanvas.height = Math.round(canvasHeight * pixelRatio);
      heroNetworkContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particleCount = Math.min(78, Math.max(28, Math.round(canvasWidth * canvasHeight / 15500)));
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        radius: Math.random() * 1.3 + 0.7
      }));

      if (reducedMotionQuery.matches) {
        renderHeroNetwork(0, false);
      } else if (!animationFrame) {
        previousFrameTime = 0;
        animationFrame = window.requestAnimationFrame((timestamp) => renderHeroNetwork(timestamp, true));
      }
    };

    const updateHeroPointer = (event) => {
      const bounds = heroShell.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      if (reducedMotionQuery.matches) renderHeroNetwork(0, false);
    };

    const clearHeroPointer = () => {
      pointer.x = null;
      pointer.y = null;
      if (reducedMotionQuery.matches) renderHeroNetwork(0, false);
    };

    const handleMotionPreferenceChange = () => {
      if (reducedMotionQuery.matches) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        renderHeroNetwork(0, false);
      } else if (!animationFrame && !document.hidden) {
        previousFrameTime = 0;
        animationFrame = window.requestAnimationFrame((timestamp) => renderHeroNetwork(timestamp, true));
      }
    };

    heroShell.addEventListener('pointermove', updateHeroPointer);
    heroShell.addEventListener('pointerleave', clearHeroPointer);
    document.addEventListener('visibilitychange', handleMotionPreferenceChange);
    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);
    new ResizeObserver(resizeHeroNetwork).observe(heroShell);
    resizeHeroNetwork();
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    const isotopeContainer = isotopeItem.querySelector('.isotope-container');
    let layoutFrame = 0;
    let initIsotope;
    const relayoutAfterImageLoad = function(event) {
      if (event.target.tagName !== 'IMG') return;
      window.cancelAnimationFrame(layoutFrame);
      layoutFrame = window.requestAnimationFrame(function() {
        initIsotope.layout();
        layoutFrame = 0;
      });
    };

    isotopeContainer.addEventListener('load', relayoutAfterImageLoad, true);
    isotopeContainer.addEventListener('error', relayoutAfterImageLoad, true);
    initIsotope = new Isotope(isotopeContainer, {
      itemSelector: '.isotope-item',
      layoutMode: layout,
      filter: filter,
      sortBy: sort
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        isotopeItem.querySelectorAll('.isotope-filters li button').forEach(function(button) {
          button.setAttribute('aria-pressed', String(button.parentElement.classList.contains('filter-active')));
        });
          const selectedFilter = this.getAttribute('data-filter');
          const showcase = isotopeItem.querySelector('.portfolio-showcase');
          const isotopeContainer = isotopeItem.querySelector('.isotope-container');
          const showAllShowcase = selectedFilter === '*';
          isotopeItem.classList.toggle('showcase-active', showAllShowcase);
          showcase.setAttribute('aria-hidden', String(!showAllShowcase));
          isotopeContainer.setAttribute('aria-hidden', String(showAllShowcase));
        initIsotope.arrange({
            filter: selectedFilter
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();