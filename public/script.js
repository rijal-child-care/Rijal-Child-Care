// Contact email addresses
const MAIN_EMAIL = 'sharmarijalanju@gmail.com';
const SECONDARY_EMAIL = 'inquiry@rijaldaycare.com';

// Update footer copyright year
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Mobile navigation
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');

    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight the current section in the navbar
  const navAnchors = Array.from(
    navLinks.querySelectorAll('a[href^="#"]')
  );

  const trackedSections = navAnchors
    .map((anchor) => {
      const sectionId = anchor.getAttribute('href');

      if (!sectionId || sectionId === '#') {
        return null;
      }

      return document.querySelector(sectionId);
    })
    .filter(Boolean);

  function updateActiveNavLink() {
    if (trackedSections.length === 0) {
      return;
    }

    const navbar = document.querySelector('.nav');
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const scrollMarker = window.scrollY + navHeight + 60;

    let activeSection = trackedSections[0];

    trackedSections.forEach((section) => {
      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY;

      if (sectionTop <= scrollMarker) {
        activeSection = section;
      }
    });

    // Select the last section when the bottom of the page is reached
    const pageBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5;

    if (pageBottom) {
      activeSection = trackedSections[trackedSections.length - 1];
    }

    navAnchors.forEach((anchor) => {
      const isActive =
        anchor.getAttribute('href') === `#${activeSection.id}`;

      anchor.classList.toggle('active', isActive);

      if (isActive) {
        anchor.setAttribute('aria-current', 'page');
      } else {
        anchor.removeAttribute('aria-current');
      }
    });
  }

  let scrollUpdateRequested = false;

  function requestNavUpdate() {
    if (scrollUpdateRequested) {
      return;
    }

    scrollUpdateRequested = true;

    window.requestAnimationFrame(() => {
      updateActiveNavLink();
      scrollUpdateRequested = false;
    });
  }

  window.addEventListener('scroll', requestNavUpdate, {
    passive: true,
  });

  window.addEventListener('resize', requestNavUpdate);

  window.addEventListener('load', updateActiveNavLink);

  updateActiveNavLink();
}

// Reveal-on-scroll animation
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add('in-view');
  });
}

// Parent stories carousel
const storyNotes = Array.from(
  document.querySelectorAll('.story-note')
);

const storyDotsContainer =
  document.getElementById('storyDots');

const storyPrevButton =
  document.getElementById('storyPrev');

const storyNextButton =
  document.getElementById('storyNext');

if (
  storyNotes.length > 0 &&
  storyDotsContainer &&
  storyPrevButton &&
  storyNextButton
) {
  let storyIndex = 0;

  function showStory(index) {
    storyIndex =
      (index + storyNotes.length) % storyNotes.length;

    storyNotes.forEach((note, noteIndex) => {
      const isActive = noteIndex === storyIndex;

      note.classList.toggle('active', isActive);
      note.setAttribute('aria-hidden', String(!isActive));
    });

    const storyDots = Array.from(
      storyDotsContainer.children
    );

    storyDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === storyIndex;

      dot.classList.toggle('active', isActive);
      dot.setAttribute(
        'aria-current',
        isActive ? 'true' : 'false'
      );
    });
  }

  storyDotsContainer.innerHTML = '';

  storyNotes.forEach((_, index) => {
    const dot = document.createElement('button');

    dot.className = 'story-dot';
    dot.type = 'button';

    dot.setAttribute(
      'aria-label',
      `Show story ${index + 1}`
    );

    dot.addEventListener('click', () => {
      showStory(index);
    });

    storyDotsContainer.appendChild(dot);
  });

  storyPrevButton.addEventListener('click', () => {
    showStory(storyIndex - 1);
  });

  storyNextButton.addEventListener('click', () => {
    showStory(storyIndex + 1);
  });

  showStory(0);
}

// Photo gallery carousel
const galleryCarousel =
  document.getElementById('galleryCarousel');

if (galleryCarousel) {
  const galleryTrack =
    document.getElementById('galleryTrack');

  const galleryPrevButton =
    document.getElementById('galleryPrev');

  const galleryNextButton =
    document.getElementById('galleryNext');

  const galleryDotsContainer =
    document.getElementById('galleryDots');

  if (
    galleryTrack &&
    galleryPrevButton &&
    galleryNextButton &&
    galleryDotsContainer
  ) {
    const gallerySlides = Array.from(
      galleryTrack.querySelectorAll('.gallery-slide')
    );

    let galleryIndex = 0;

    function getVisibleGallerySlides() {
      if (window.innerWidth <= 480) {
        return 1;
      }

      if (window.innerWidth <= 900) {
        return 2;
      }

      return 3;
    }

    function createGalleryDots(maxIndex) {
      galleryDotsContainer.innerHTML = '';

      for (
        let index = 0;
        index <= maxIndex;
        index += 1
      ) {
        const dot = document.createElement('button');

        dot.className = 'gallery-dot';
        dot.type = 'button';

        dot.setAttribute(
          'aria-label',
          `Show gallery beginning with photo ${index + 1}`
        );

        dot.addEventListener('click', () => {
          galleryIndex = index;
          updateGalleryCarousel();
        });

        galleryDotsContainer.appendChild(dot);
      }
    }

    function updateGalleryCarousel() {
      if (gallerySlides.length === 0) {
        galleryPrevButton.disabled = true;
        galleryNextButton.disabled = true;
        return;
      }

      const visibleSlides =
        getVisibleGallerySlides();

      const maxIndex = Math.max(
        0,
        gallerySlides.length - visibleSlides
      );

      galleryIndex = Math.min(
        Math.max(galleryIndex, 0),
        maxIndex
      );

      const firstSlide = gallerySlides[0];

      const trackStyles =
        window.getComputedStyle(galleryTrack);

      const gap =
        parseFloat(
          trackStyles.columnGap || trackStyles.gap
        ) || 0;

      const slideWidth =
        firstSlide.getBoundingClientRect().width;

      const movement =
        galleryIndex * (slideWidth + gap);

      galleryTrack.style.transform =
        `translateX(-${movement}px)`;

      galleryPrevButton.disabled =
        galleryIndex === 0;

      galleryNextButton.disabled =
        galleryIndex === maxIndex;

      if (
        galleryDotsContainer.children.length !==
        maxIndex + 1
      ) {
        createGalleryDots(maxIndex);
      }

      Array.from(
        galleryDotsContainer.children
      ).forEach((dot, index) => {
        const isActive = index === galleryIndex;

        dot.classList.toggle('active', isActive);

        dot.setAttribute(
          'aria-current',
          isActive ? 'true' : 'false'
        );
      });
    }

    galleryPrevButton.addEventListener('click', () => {
      galleryIndex -= 1;
      updateGalleryCarousel();
    });

    galleryNextButton.addEventListener('click', () => {
      galleryIndex += 1;
      updateGalleryCarousel();
    });

    // Allow keyboard navigation
    galleryCarousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        galleryIndex -= 1;
        updateGalleryCarousel();
      }

      if (event.key === 'ArrowRight') {
        galleryIndex += 1;
        updateGalleryCarousel();
      }
    });

    if ('ResizeObserver' in window) {
      const galleryResizeObserver =
        new ResizeObserver(updateGalleryCarousel);

      galleryResizeObserver.observe(galleryCarousel);
    } else {
      window.addEventListener(
        'resize',
        updateGalleryCarousel
      );
    }

    window.addEventListener(
      'load',
      updateGalleryCarousel
    );

    updateGalleryCarousel();
  }
}

// Tour request form
const tourForm = document.getElementById('tourForm');
const formStatus = document.getElementById('formStatus');

if (tourForm && formStatus) {
  tourForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = tourForm.querySelector(
      'button[type="submit"]'
    );

    formStatus.textContent = 'Sending your request…';

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(tourForm.action, {
        method: 'POST',
        body: new FormData(tourForm),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Tour request failed');
      }

      formStatus.textContent =
        "Thank you! We received your request and will be in touch soon. 🌈";

      tourForm.reset();
    } catch (error) {
      console.error(error);

      formStatus.textContent =
        `Something went wrong. Please email ${MAIN_EMAIL} or ${SECONDARY_EMAIL}.`;
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

// Parent review form
const showReviewFormButton =
  document.getElementById('showReviewForm');

const reviewForm =
  document.getElementById('reviewForm');

const reviewFormStatus =
  document.getElementById('reviewFormStatus');

if (
  showReviewFormButton &&
  reviewForm &&
  reviewFormStatus
) {
  showReviewFormButton.addEventListener('click', () => {
    reviewForm.classList.remove('hidden');
    showReviewFormButton.hidden = true;

    const firstInput = reviewForm.querySelector(
      'input, textarea, select'
    );

    if (firstInput) {
      firstInput.focus();
    }
  });

  reviewForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      const selectedRating = reviewForm.querySelector(
        'input[name="Rating"]:checked'
      );

      if (!selectedRating) {
        reviewFormStatus.textContent =
          'Please pick a star rating.';

        return;
      }

      const submitButton = reviewForm.querySelector(
        'button[type="submit"]'
      );

      reviewFormStatus.textContent =
        'Sending your review…';

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(reviewForm.action, {
          method: 'POST',
          body: new FormData(reviewForm),
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Review submission failed');
        }

        reviewFormStatus.textContent =
          'Thank you for sharing your review! 🌟';

        reviewForm.reset();
        reviewForm.classList.add('hidden');
        showReviewFormButton.hidden = false;
      } catch (error) {
        console.error(error);

        reviewFormStatus.textContent =
          `Something went wrong. Please email your review to ${MAIN_EMAIL} or ${SECONDARY_EMAIL}.`;
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    }
  );
}
