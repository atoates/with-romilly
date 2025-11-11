// With Romilly Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Load content data
    loadContentData();
    
    // Mobile Navigation Toggle (initialize once globally)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu && navToggle.dataset.navBound !== 'true') {
        const toggleMenu = () => {
            const isActive = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active', isActive);
            navToggle.setAttribute('aria-expanded', String(isActive));
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        navToggle.addEventListener('click', toggleMenu);

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Mark as initialized to avoid double-binding from page scripts
        navToggle.dataset.navBound = 'true';
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (href === '/' && current === 'hero')) {
                link.classList.add('active');
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Booking Form Handling
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize scroll animations
    initScrollAnimations();
    
    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(function() {
        updateActiveNavLink();
        animateOnScroll();
    }, 100));

    // Initial calls
    updateActiveNavLink();
    
    // Set dynamic copyright year
    updateCopyrightYear();

    console.log('With Romilly website initialized successfully!');
});

// Load and render content data
async function loadContentData() {
    try {
        const response = await fetch('src/data/content.json');
        const data = await response.json();
        
        renderServices(data.services);
    renderTestimonials(data.testimonials);
    initHomeTestimonialCarousel(data.testimonials);
        renderRecommends(data.recommends);
        renderAboutText(data.about.short);
        
    } catch (error) {
        console.error('Error loading content data:', error);
        // Fallback content
        renderFallbackContent();
    }
}

// Render services grid
function renderServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid || !services) return;

    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card fade-in-up">
            <div class="service-image-column">
                <img src="${service.heroImage}" alt="${service.title}" class="service-image" loading="lazy">
            </div>
            <div class="service-content-column">
                <div class="service-title-row">
                    <div class="title-line-left"></div>
                    <h3 class="service-title">${service.title}</h3>
                    <div class="service-pills-inline">
                        <span class="pill-duration">${service.duration}</span>
                        <span class="pill-price">£${service.price}</span>
                    </div>
                    <div class="title-line-right"></div>
                </div>
                <div class="service-separator-line"></div>
                <p class="service-summary">${service.summary}</p>
                <a href="services.html#${service.slug}" class="btn btn-primary btn-learn">Learn More</a>
            </div>
        </div>
    `).join('');
}

// Render testimonials
function renderTestimonials(testimonials) {
    // Kept for potential other pages that still use grid
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (testimonialsGrid && testimonials) {
        testimonialsGrid.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card fade-in-up">
                <p class="testimonial-quote">${testimonial.quote}</p>
                <div class="testimonial-author">— ${testimonial.author}</div>
            </div>
        `).join('');
    }
}

function initHomeTestimonialCarousel(testimonials) {
    const carousel = document.getElementById('home-testimonial-carousel');
    if (!carousel || !testimonials) return;

    const slides = testimonials.map((t, i) => `
        <div class="testimonial-slide${i === 0 ? ' active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${testimonials.length}">
            <blockquote class="testimonial-quote">“${t.quote}”</blockquote>
            <cite class="testimonial-author">— ${t.author}</cite>
        </div>`).join('');

    carousel.insertAdjacentHTML('afterbegin', slides);

    const dotsWrap = document.getElementById('home-testimonial-dots');
    const prevBtn = document.getElementById('home-testimonial-prev');
    const nextBtn = document.getElementById('home-testimonial-next');
    dotsWrap.innerHTML = testimonials.map((_, i) => `<button class="testimonial-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`).join('');

    const slideEls = Array.from(carousel.querySelectorAll('.testimonial-slide'));
    const dotEls = Array.from(dotsWrap.querySelectorAll('.testimonial-dot'));
    let current = 0;
    let timer;

    const show = (index) => {
        slideEls[current].classList.remove('active');
        dotEls[current].classList.remove('active');
        current = (index + slideEls.length) % slideEls.length;
        slideEls[current].classList.add('active');
        dotEls[current].classList.add('active');
        resetTimer();
    };
    const next = () => show(current + 1);
    const prev = () => show(current - 1);
    const resetTimer = () => { if (timer) clearInterval(timer); timer = setInterval(next, 7000); };

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    dotEls.forEach(btn => btn.addEventListener('click', () => show(parseInt(btn.dataset.index))));
    carousel.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); });

    resetTimer();
}

// Render recommends
function renderRecommends(recommends) {
    const recommendsGrid = document.getElementById('recommends-grid');
    if (!recommendsGrid || !recommends) return;

    // Show only first 4 items on homepage
    const displayRecommends = recommends.slice(0, 4);
    
    recommendsGrid.innerHTML = displayRecommends.map(item => `
        <a href="${item.url}" class="recommend-card fade-in-up" target="_blank" rel="noopener">
            <img src="${item.image}" alt="${item.name}" class="recommend-image" loading="lazy">
            <div class="recommend-content">
                <h4 class="recommend-title">${item.name}</h4>
                <p class="recommend-description">${item.description}</p>
            </div>
        </a>
    `).join('');
}

// Render about text
function renderAboutText(aboutText) {
    const aboutTextElement = document.getElementById('about-text');
    if (aboutTextElement && aboutText) {
        aboutTextElement.textContent = aboutText;
    }
}

// Fallback content if JSON fails to load
function renderFallbackContent() {
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid) {
        servicesGrid.innerHTML = `
            <div class="service-card">
                <div class="service-content">
                    <h3 class="service-title">Reflexology</h3>
                    <p class="service-summary">Deeply relaxing and restorative treatment.</p>
                    <div class="service-meta">
                        <span class="service-duration">50 min</span>
                        <span class="service-price">75</span>
                    </div>
                    <a href="services.html#reflexology" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        `;
    }
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Basic validation
    if (!validateForm(formData, form)) {
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent. I\'ll get back to you soon.', 'success');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Form validation
function validateForm(formData, form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        const value = formData.get(field.name);
        if (!value || value.trim() === '') {
            showFieldError(field, 'This field is required.');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField) {
        const email = formData.get(emailField.name);
        if (email && !isValidEmail(email)) {
            showFieldError(emailField, 'Please enter a valid email address.');
            isValid = false;
        }
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#dc2626';
}

// Clear field error
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    // Add styles for notification if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            .notification {
                position: fixed;
                top: 120px;
                right: 20px;
                max-width: 400px;
                padding: 1rem;
                border-radius: 16px;
                box-shadow: var(--shadow);
                z-index: 1001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                background-color: var(--primary-color);
                color: white;
            }
            .notification-error {
                background-color: #dc2626;
                color: white;
            }
            .notification-info {
                background-color: var(--primary-light);
                color: white;
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: 1rem;
                opacity: 0.8;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in-up');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(element => {
        if (!element.classList.contains('visible')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        }
    });
}

// Header background effect
// Header background now controlled via CSS only (removed inline style override)

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Update copyright year dynamically
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}