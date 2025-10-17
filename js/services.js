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
    
    servicesGrid.innerHTML = services.map((service, idx) => {
        const topBenefits = (service.bullets || []).slice(0, 3);
        const reverseClass = (idx % 2 === 1) ? ' reverse' : '';
        return `
        <section class="service-panel${reverseClass}" id="${service.slug}">
          <div class="panel-inner">
            <figure class="panel-media">
              <img src="${service.heroImage}" alt="${service.title}" loading="lazy" />
              <a href="services.html#${service.slug}" class="media-more">More about this treatment</a>
            </figure>
            <div class="panel-content">
              <header class="panel-header">
                <div class="chips">
                  <span class="chip duration" aria-label="duration">${service.duration}</span>
                  <span class="chip price" aria-label="price">\u00a3${service.price}</span>
                </div>
                <div class="title-row">
                  <span class="title-line"></span>
                  <h3 class="title">${service.title}</h3>
                  <span class="title-line"></span>
                </div>
              </header>
              <div class="panel-sep"></div>
              <p class="summary">${service.summary}</p>
              ${topBenefits.length ? `
              <ul class="benefits" aria-label="Key benefits">
                ${topBenefits.map(b => `<li class=\"benefit\">${b}</li>`).join('')}
              </ul>` : ''}
              <div class="cta-row">
                <a href="book.html" class="btn btn-primary">Book This Service</a>
                <a href="mailto:withromilly@gmail.com?subject=Enquiry about ${service.title}" class="btn btn-outline">Ask a Question</a>
              </div>
            </div>
          </div>
        </section>`;
    }).join('');
    
    // Add animation
    const servicePanels = document.querySelectorAll('.service-panel');
    servicePanels.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // Render TOC for quick navigation
    renderServicesToc(services);

    // Wire up overlay close buttons
    // No overlays in clean design; link on image provided instead.
}

// (Removed) benefitIcon mapping - using simple tick marks now for benefits

function renderServicesToc(services) {
    const toc = document.getElementById('services-toc');
    if (!toc) return;
    toc.innerHTML = services.map(s => `
        <a class="toc-btn" href="#${s.slug}">${s.title}</a>
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