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
                            <button type="button" class="media-more" aria-haspopup="dialog" aria-controls="overlay-${service.slug}">More about this treatment</button>
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
                <a href="#" class="btn btn-primary" id="setmore-book-btn">Book This Service</a>
                <a href="mailto:withromilly@gmail.com?subject=Enquiry about ${service.title}" class="btn btn-outline">Ask a Question</a>
              </div>
            </div>
          </div>

                    <!-- Overlay -->
                    <div class="panel-overlay" id="overlay-${service.slug}" aria-hidden="true" role="dialog" aria-label="More about ${service.title}">
                        <div class="overlay-card" role="document">
                            <button type="button" class="overlay-close" aria-label="Close">&times;</button>
                            <h4 class="overlay-title">${service.title}</h4>
                            <div class="overlay-body">
                                ${service.description ? `<p>${service.description}</p>` : ''}
                                ${(service.bullets && service.bullets.length) ? `
                                    <div class="overlay-benefits">
                                        <h5>Key benefits</h5>
                                        <ul>
                                            ${service.bullets.map(b => `<li>${b}</li>`).join('')}
                                        </ul>
                                    </div>` : ''}
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

    // Overlay open/close helpers with scroll lock
    const openOverlay = (overlay) => {
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const closeBtn = overlay.querySelector('.overlay-close');
        if (closeBtn) closeBtn.focus();
    };
    const closeOverlay = (overlay) => {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Wire overlay open
    document.querySelectorAll('.service-panel .media-more').forEach(btn => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.addEventListener('click', (e) => {
            const panel = e.currentTarget.closest('.service-panel');
            const overlay = panel && panel.querySelector('.panel-overlay');
            if (overlay) openOverlay(overlay);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const panel = e.currentTarget.closest('.service-panel');
                const overlay = panel && panel.querySelector('.panel-overlay');
                if (overlay) openOverlay(overlay);
            }
        });
    });

    // Wire overlay close buttons
    document.querySelectorAll('.service-panel .overlay-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const overlay = e.currentTarget.closest('.panel-overlay');
            if (overlay) closeOverlay(overlay);
        });
    });

    // Close on background click
    document.querySelectorAll('.service-panel .panel-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay(overlay);
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.panel-overlay.open').forEach(overlay => closeOverlay(overlay));
        }
    });
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
                    <a href="#" class="btn btn-primary" id="setmore-book-btn">Book This Service</a>
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
                    <a href="#" class="btn btn-primary" id="setmore-book-btn">Book This Service</a>
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