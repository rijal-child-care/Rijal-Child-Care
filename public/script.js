document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

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

// Highlight active nav link based on scroll position
const sections = Array.from(document.querySelectorAll('main, section[id]'));
const navAnchors = Array.from(navLinks.querySelectorAll('a'));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

sections.forEach((section) => {
  if (section.id) sectionObserver.observe(section);
});

// Reveal-on-scroll animation
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Story carousel
const storyNotes = Array.from(document.querySelectorAll('.story-note'));
const storyDotsContainer = document.getElementById('storyDots');
const prevBtn = document.getElementById('storyPrev');
const nextBtn = document.getElementById('storyNext');
let storyIndex = 0;

storyNotes.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'story-dot';
  dot.setAttribute('aria-label', `Show story ${i + 1}`);
  dot.addEventListener('click', () => showStory(i));
  storyDotsContainer.appendChild(dot);
});

const storyDots = Array.from(storyDotsContainer.children);

function showStory(index) {
  storyIndex = (index + storyNotes.length) % storyNotes.length;
  storyNotes.forEach((note, i) => note.classList.toggle('active', i === storyIndex));
  storyDots.forEach((dot, i) => dot.classList.toggle('active', i === storyIndex));
}

prevBtn.addEventListener('click', () => showStory(storyIndex - 1));
nextBtn.addEventListener('click', () => showStory(storyIndex + 1));

showStory(0);

// Photo gallery carousel
const galleryCarousel = document.getElementById('galleryCarousel');

if (galleryCarousel) {
  const galleryTrack = document.getElementById('galleryTrack');
  const gallerySlides = Array.from(
    galleryTrack.querySelectorAll('.gallery-slide')
  );

  const galleryPrevBtn = document.getElementById('galleryPrev');
  const galleryNextBtn = document.getElementById('galleryNext');
  const galleryDotsContainer = document.getElementById('galleryDots');

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

    for (let i = 0; i <= maxIndex; i += 1) {
      const dot = document.createElement('button');

      dot.className = 'gallery-dot';
      dot.type = 'button';
      dot.setAttribute(
        'aria-label',
        `Show gallery beginning with photo ${i + 1}`
      );

      dot.addEventListener('click', () => {
        galleryIndex = i;
        updateGalleryCarousel();
      });

      galleryDotsContainer.appendChild(dot);
    }
  }

  function updateGalleryCarousel() {
    const visibleSlides = getVisibleGallerySlides();
    const maxIndex = Math.max(
      0,
      gallerySlides.length - visibleSlides
    );

    galleryIndex = Math.min(
      Math.max(galleryIndex, 0),
      maxIndex
    );

    const firstSlide = gallerySlides[0];
    const trackStyles = window.getComputedStyle(galleryTrack);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const movement = galleryIndex * (slideWidth + gap);

    galleryTrack.style.transform =
      `translateX(-${movement}px)`;

    galleryPrevBtn.disabled = galleryIndex === 0;
    galleryNextBtn.disabled = galleryIndex === maxIndex;

    if (galleryDotsContainer.children.length !== maxIndex + 1) {
      createGalleryDots(maxIndex);
    }

    Array.from(galleryDotsContainer.children).forEach(
      (dot, index) => {
        dot.classList.toggle(
          'active',
          index === galleryIndex
        );
      }
    );
  }

  galleryPrevBtn.addEventListener('click', () => {
    galleryIndex -= 1;
    updateGalleryCarousel();
  });

  galleryNextBtn.addEventListener('click', () => {
    galleryIndex += 1;
    updateGalleryCarousel();
  });

  const galleryResizeObserver = new ResizeObserver(() => {
    updateGalleryCarousel();
  });

  galleryResizeObserver.observe(galleryCarousel);
  updateGalleryCarousel();
}

// Tour request form (submits to FormSubmit, shows inline status instead of redirecting)
const tourForm = document.getElementById('tourForm');
const formStatus = document.getElementById('formStatus');

tourForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formStatus.textContent = 'Sending your request…';
  const submitBtn = tourForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    const response = await fetch(tourForm.action, {
      method: 'POST',
      body: new FormData(tourForm),
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      formStatus.textContent = "Thank you! We'll be in touch soon. 🌈";
      tourForm.reset();
    } else {
      throw new Error('Request failed');
    }
  } catch (err) {
    formStatus.textContent = 'Something went wrong — please email us directly at sharmarijalanju@gmail.com.';
  } finally {
    submitBtn.disabled = false;
  }
});

// Parent review submission (emails Anju via FormSubmit — site has no database to auto-publish reviews)
const showReviewFormBtn = document.getElementById('showReviewForm');
const reviewForm = document.getElementById('reviewForm');
const reviewFormStatus = document.getElementById('reviewFormStatus');

showReviewFormBtn.addEventListener('click', () => {
  reviewForm.classList.remove('hidden');
  showReviewFormBtn.hidden = true;
});

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!reviewForm.querySelector('input[name="Rating"]:checked')) {
    reviewFormStatus.textContent = 'Please pick a star rating.';
    return;
  }
  reviewFormStatus.textContent = 'Sending your review…';
  const submitBtn = reviewForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    const response = await fetch(reviewForm.action, {
      method: 'POST',
      body: new FormData(reviewForm),
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      reviewFormStatus.textContent = 'Thank you for sharing! 🌟';
      reviewForm.reset();
      reviewForm.classList.add('hidden');
      showReviewFormBtn.hidden = false;
    } else {
      throw new Error('Request failed');
    }
  } catch (err) {
    reviewFormStatus.textContent = 'Something went wrong — please email your review to sharmarijalanju@gmail.com.';
  } finally {
    submitBtn.disabled = false;
  }
});
