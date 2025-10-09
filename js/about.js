// About page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadAboutContent();
    initializeNavigation();
});

// Load and display about content
async function loadAboutContent() {
    try {
        const response = await fetch('src/data/content.json');
        const data = await response.json();
        
        displayAboutStory(data.about);
        displayQualifications(data.about.qualifications);
        displayTestimonials(data.testimonials);
    } catch (error) {
        console.error('Error loading about content:', error);
        displayFallbackContent();
    }
}

// Display about story
function displayAboutStory(about) {
    const aboutStory = document.getElementById('about-story');
    if (!aboutStory || !about) return;
    
    aboutStory.innerHTML = `
        <p class="about-text-main">${about.long}</p>
    `;
}

// Display qualifications
function displayQualifications(qualifications) {
    const qualificationsGrid = document.getElementById('qualifications-grid');
    if (!qualificationsGrid || !qualifications) return;
    
    qualificationsGrid.innerHTML = qualifications.map((qualification, index) => `
        <div class="qualification-item" style="animation-delay: ${index * 0.1}s">
            <div class="qualification-icon">✓</div>
            <div class="qualification-text">${qualification}</div>
        </div>
    `).join('');
    
    // Add animation
    const qualificationItems = document.querySelectorAll('.qualification-item');
    qualificationItems.forEach(item => {
        item.classList.add('fade-in-up');
    });
}

// Display testimonials
function displayTestimonials(testimonials) {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (!testimonialsGrid || !testimonials) return;
    
    testimonialsGrid.innerHTML = testimonials.map((testimonial, index) => `
        <div class="testimonial-card" style="animation-delay: ${index * 0.2}s">
            <blockquote class="testimonial-quote">
                "${testimonial.quote}"
            </blockquote>
            <cite class="testimonial-author">— ${testimonial.author}</cite>
        </div>
    `).join('');
    
    // Add animation
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.classList.add('fade-in-up');
    });
}

// Fallback content if JSON fails to load
function displayFallbackContent() {
    const aboutStory = document.getElementById('about-story');
    if (aboutStory) {
        aboutStory.innerHTML = `
            <p class="about-text-main">I am a qualified Reflexology practitioner and an insured member of the Association of Reflexologists, trained at the prestigious London School of Reflexology. I have a particular interest in women's health and how balancing the mind, body and emotions with Reflexology is often exactly what we need to lead a happier and healthier life.</p>
        `;
    }
    
    const qualificationsGrid = document.getElementById('qualifications-grid');
    if (qualificationsGrid) {
        qualificationsGrid.innerHTML = `
            <div class="qualification-item">
                <div class="qualification-icon">✓</div>
                <div class="qualification-text">Qualified Reflexologist, London School of Reflexology</div>
            </div>
            <div class="qualification-item">
                <div class="qualification-icon">✓</div>
                <div class="qualification-text">Member of the Association of Reflexologists</div>
            </div>
            <div class="qualification-item">
                <div class="qualification-icon">✓</div>
                <div class="qualification-text">Fully insured and certified</div>
            </div>
        `;
    }
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}