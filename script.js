// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            nav.classList.remove('active');
        }
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        
        // Here you would typically send the form data to a server
        // For now, we'll just show an alert
        alert('Merci pour votre message ! Nous vous contacterons bientôt.');
        
        // Reset form
        contactForm.reset();
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('header');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'var(--black)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let autoSlideInterval;
let isAnimating = false;

function showSlide(index, direction = 'next') {
    // Prevent overlapping animations
    if (isAnimating) return;
    isAnimating = true;
    
    const oldSlide = currentSlide;
    
    // Wrap around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // If same slide, do nothing
    if (oldSlide === currentSlide) {
        isAnimating = false;
        return;
    }
    
    // Animate out the old slide
    if (slides[oldSlide]) {
        if (direction === 'next') {
            slides[oldSlide].classList.add('slide-out-left');
        } else {
            slides[oldSlide].classList.add('slide-out-right');
        }
    }
    
    // Wait for old slide to completely exit before showing new slide
    setTimeout(() => {
        // Clean up old slide
        if (slides[oldSlide]) {
            slides[oldSlide].classList.remove('slide-out-left', 'slide-out-right', 'active');
            slides[oldSlide].classList.remove('animate-in-right', 'animate-in-left');
        }
        
        // Animate in the new slide
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
            if (direction === 'next') {
                slides[currentSlide].classList.add('animate-in-right');
            } else {
                slides[currentSlide].classList.add('animate-in-left');
            }
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentSlide) {
                dot.classList.add('active');
            }
        });
        
        // Clean up animation classes after new animation ends
        setTimeout(() => {
            if (slides[currentSlide]) {
                slides[currentSlide].classList.remove('animate-in-right', 'animate-in-left');
            }
            isAnimating = false;
        }, 400);
    }, 400);
}

function nextSlide() {
    showSlide(currentSlide + 1, 'next');
}

function prevSlide() {
    showSlide(currentSlide - 1, 'prev');
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Event listeners for slider
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide(); // Restart auto-slide after manual interaction
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
}

// Dots navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoSlide();
    });
});

// Pause auto-slide when hovering over slider
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', resetAutoSlide);
}

// Start auto-slide
if (slides.length > 0) {
    // Properly initialize the first slide
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    startAutoSlide();
}

// Pause auto-slide when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
});