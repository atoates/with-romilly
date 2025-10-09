// Services page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    initializeNavigation();
});

// Load and display services
async function loadServices() {
    try {
        const response = await fetch('src/data/content.json');
        const data = await response.json();
        
        displayServices(data.services);
    } catch (error) {
        console.error('Error loading services:', error);
        displayFallbackServices();
    }
}

// Display services in the grid
function displayServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = services.map(service => {
        const topBenefits = (service.bullets || []).slice(0, 3);
        return `
        <div class="service-card" id="${service.slug}">
            <div class="service-image">
                <img src="${service.heroImage}" alt="${service.title}" loading="lazy">
            </div>
            <div class="service-content">
                <div class="service-header">
                    <h3 class="service-title">${service.title}</h3>
                    <div class="service-meta">
                        <span class="meta-chip duration" aria-label="duration">${service.duration}</span>
                        <span class="meta-chip price" aria-label="price">\u00a3${service.price}</span>
                    </div>
                </div>
                <p class="service-summary clamp-3">${service.summary}</p>

                ${topBenefits.length ? `
                <ul class="benefits-inline" aria-label="Key benefits">
                    ${topBenefits.map(b => `<li class="benefit-item">${benefitIcon(b)}<span>${b}</span></li>`).join('')}
                </ul>` : ''}

                ${(service.whoItHelps && service.whoItHelps.length) ? `
                <div class="service-tags" aria-label="Who it helps">
                    <h4 class="tags-title">Who it helps</h4>
                    <ul class="helps-list">
                        ${service.whoItHelps.map(help => `<li>${help}</li>`).join('')}
                    </ul>
                </div>` : ''}

                <details class="service-details">
                    <summary>More about this treatment</summary>
                    <div class="details-body">
                        <div class="service-description"><p>${service.description}</p></div>
                        ${(service.bullets && service.bullets.length) ? `
                        <div class="service-benefits-full">
                            <h4>Key benefits</h4>
                            <ul>
                                ${service.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                            </ul>
                        </div>` : ''}
                    </div>
                </details>

                <div class="service-actions">
                    <a href="book.html" class="btn btn-primary">Book This Service</a>
                    <a href="mailto:withromilly@gmail.com?subject=Enquiry about ${service.title}" class="btn btn-outline">Ask a Question</a>
                </div>
            </div>
        </div>`;
    }).join('');
    
    // Add animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // Render TOC for quick navigation
    renderServicesToc(services);
}

// Map benefit text to an inline SVG icon for consistent visuals
function benefitIcon(text) {
    const t = (text || '').toLowerCase();
    const icon = (name) => {
        switch (name) {
            case 'calm': // relaxing/calm
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 12c4 0 6-6 9-6s5 6 9 6"/><path d="M3 17c4 0 6-3 9-3s5 3 9 3"/></svg></span>';
            case 'skin': // skin/face/glow
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg></span>';
            case 'balance': // balance/hormones
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M6 7h12"/><path d="M5 7l-3 3 3 3 3-3-3-3z"/><path d="M19 7l-3 3 3 3 3-3-3-3z"/></svg></span>';
            case 'pain': // pain/aches
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M2 12h20"/></svg></span>';
            case 'energy': // energy/circulation/detox
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg></span>';
            case 'pregnancy':
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-6-3.5-6-8a6 6 0 1 1 12 0c0 4.5-6 8-6 8z"/></svg></span>';
            case 'sleep':
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 1 1-8-8 6 6 0 0 0 8 8z"/></svg></span>';
            default: // check
                return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span>';
        }
    };

    if (/(calm|relax|stress|anxiety|rest)/.test(t)) return icon('calm');
    if (/(skin|glow|face|rejuvenat)/.test(t)) return icon('skin');
    if (/(balance|hormone|cycle|peri|meno)/.test(t)) return icon('balance');
    if (/(pain|aches|tension|migraine|headache)/.test(t)) return icon('pain');
    if (/(energy|circulation|detox)/.test(t)) return icon('energy');
    if (/(pregnan|fertilit|pre\-?concept)/.test(t)) return icon('pregnancy');
    if (/(sleep)/.test(t)) return icon('sleep');
    return icon('default');
}

function renderServicesToc(services) {
    const toc = document.getElementById('services-toc');
    if (!toc) return;
    toc.innerHTML = services.map(s => `
        <a class="btn btn-secondary" href="#${s.slug}">${s.title}</a>
    `).join('');
}

// Fallback services if JSON fails to load
function displayFallbackServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = `
        <div class="service-card">
            <div class="service-content">
                <h3 class="service-title">Reflexology</h3>
                <div class="service-meta">
                    <span class="service-duration">50 min</span>
                    <span class="service-price">£75</span>
                </div>
                <p class="service-summary">Deeply relaxing and therapeutic for all the body's systems, helping you return to a state of balance.</p>
                <div class="service-actions">
                    <a href="book.html" class="btn btn-primary">Book This Service</a>
                </div>
            </div>
        </div>
        <div class="service-card">
            <div class="service-content">
                <h3 class="service-title">Facial Reflexology</h3>
                <div class="service-meta">
                    <span class="service-duration">45 min</span>
                    <span class="service-price">£80</span>
                </div>
                <p class="service-summary">Powerfully calming for the nervous system; boosts circulation, reduces tension and rejuvenates skin.</p>
                <div class="service-actions">
                    <a href="book.html" class="btn btn-primary">Book This Service</a>
                </div>
            </div>
        </div>
    `;
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