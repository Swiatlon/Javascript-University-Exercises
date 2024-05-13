document.addEventListener('DOMContentLoaded', function () {
  let currentIndex = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');
  const pauseButton = document.querySelector('.pause');
  const dotsContainer = document.querySelector('.dots');
  let slideInterval;
  let isPaused = false;

  function autoSlide() {
    slideInterval = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, 3000);
  }

  function pauseSlide() {
    if (!isPaused) {
      clearInterval(slideInterval);
      pauseButton.textContent = 'Wznów';
      isPaused = true;
    } else {
      autoSlide();
      pauseButton.textContent = 'Pauza';
      isPaused = false;
    }
  }

  function createDots() {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.remove('active');
      if (index === currentIndex) {
        dot.classList.add('active');
      }
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }
    currentIndex = index;
    const offset = -(100 * currentIndex);
    document.querySelector('.slides-container').style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  pauseButton.addEventListener('click', pauseSlide);

  nextButton.addEventListener('click', function () {
    goToSlide(currentIndex + 1);
  });

  prevButton.addEventListener('click', function () {
    goToSlide(currentIndex - 1);
  });

  createDots();
  goToSlide(0);
  autoSlide();
});
