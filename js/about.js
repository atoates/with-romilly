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
        // foot reflexology / practitioner
        reflexologist: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8.5 3.5c1.1 0 2 .9 2 2 0 1.6-1.6 3-3.2 4.8C5.4 12 4 14 4 16.2 4 18.4 5.6 20 7.8 20c2.7 0 4.5-2.3 5.4-4.3.7-1.6 1.8-2.4 3-3.2 1.4-1 2.8-2 2.8-4 0-2-1.6-3.5-3.6-3.5-1.4 0-2.4.7-3.2 1.6-.3-1.6-1.6-3.1-3.7-3.1-1.2 0-2.3.7-2.9 1.5-.2.3-.3.6-.3 1 .1.7.6 1 .7 1 .3 0 .3-.1.5-.3.3-.3.7-.7 1.5-.7z"/></svg>`,
        // association / membership
        association: `<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\"><path d=\"M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9z\"/><path d=\"M9 21V9h6v12\" fill=\"#fff\" opacity=\".25\"/></svg>`,
        // diploma / certificate
        diploma: `<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M7 9h10M7 12h7\" stroke=\"#fff\" stroke-width=\"2\"/></svg>`,
        // pregnancy
        pregnancy: `<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\"><circle cx=\"15\" cy=\"7\" r=\"3.5\"/><path d=\"M7 21a6 6 0 1112 0H7z\"/></svg>`,
        // face / zone face lift
        facial: `<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\"><path d=\"M12 3c4.4 0 8 3.6 8 8 0 5.2-4.5 10-8 10S4 16.2 4 11c0-4.4 3.6-8 8-8z\"/><circle cx=\"9\" cy=\"11\" r=\"1\" fill=\"#fff\"/><circle cx=\"15\" cy=\"11\" r=\"1\" fill=\"#fff\"/><path d=\"M8.5 15c1 .8 2.6 1.4 3.5 1.4S14.5 15.8 15.5 15\" stroke=\"#fff\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg>`,
        // insured / shield
        insured: `<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\"><path d=\"M12 2l7 3v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V5l7-3z\"/></svg>`
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
    const carousel = document.getElementById('testimonial-carousel');
    if (!carousel || !testimonials) return;

    const slides = testimonials.map((t, i) => {
        const delay = i * 0.05;
        return `<div class="testimonial-slide${i === 0 ? ' active' : ''}" style="animation-delay:${delay}s" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${testimonials.length}">
            <blockquote class="testimonial-quote">“${t.quote}”</blockquote>
            <cite class="testimonial-author">— ${t.author}</cite>
        </div>`;
    }).join('');

    const dots = testimonials.map((_, i) => `<button class="testimonial-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`).join('');

    // Insert slides before controls/dots wrapper
    carousel.insertAdjacentHTML('afterbegin', slides);
    document.getElementById('testimonial-dots').innerHTML = dots;

    let current = 0;
    const total = testimonials.length;
    const slideEls = Array.from(carousel.querySelectorAll('.testimonial-slide'));
    const dotEls = Array.from(carousel.querySelectorAll('.testimonial-dot'));
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    let timer;

    function show(index) {
        slideEls[current].classList.remove('active');
        dotEls[current].classList.remove('active');
        current = (index + total) % total;
        slideEls[current].classList.add('active');
        dotEls[current].classList.add('active');
        resetTimer();
    }

    function next() { show(current + 1); }
    function prev() { show(current - 1); }
    function resetTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(next, 7000); // auto-rotate every 7s
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    dotEls.forEach(btn => btn.addEventListener('click', () => show(parseInt(btn.dataset.index))));

    // keyboard accessibility
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    resetTimer();
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