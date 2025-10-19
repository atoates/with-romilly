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

    const icons = {
        reflexologist: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a4 4 0 014 4v2h1a3 3 0 013 3v8a3 3 0 01-3 3H7a3 3 0 01-3-3v-8a3 3 0 013-3h1V6a4 4 0 014-4z" fill="currentColor"/></svg>`,
        association: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" fill="currentColor"/></svg>`,
        diploma: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="2"/><path d="M8 10h8M8 14h5" stroke="currentColor" stroke-width="2"/></svg>`,
        pregnancy: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 3a4 4 0 110 8 4 4 0 010-8z" fill="currentColor"/><path d="M7 20a5 5 0 1110 0H7z" fill="currentColor"/></svg>`,
        facial: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c1.5-4 6-6 8-6s6 2 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        insured: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z" fill="currentColor"/></svg>`
    };

    const pickIcon = (text) => {
        const t = text.toLowerCase();
        if (t.includes('association')) return icons.association;
        if (t.includes('naturopathy') || t.includes('diploma')) return icons.diploma;
        if (t.includes('pre-conceptual') || t.includes('pregnancy')) return icons.pregnancy;
        if (t.includes('facial') || t.includes('zone face lift')) return icons.facial;
        if (t.includes('insured') || t.includes('certified')) return icons.insured;
        if (t.includes('reflexologist') || t.includes('reflexology')) return icons.reflexologist;
        return icons.reflexologist;
    };

    const items = qualifications.slice(0, 6); // ensure 3 rows x 2 columns

    qualificationsGrid.innerHTML = items.map((qualification, index) => `
        <div class="qualification-item" style="animation-delay: ${index * 0.05}s">
            <div class="qualification-icon">${pickIcon(qualification)}</div>
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