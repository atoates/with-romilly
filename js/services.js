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
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card" id="${service.slug}">
            <div class="service-image">
                <img src="${service.heroImage}" alt="${service.title}" loading="lazy">
            </div>
            <div class="service-content">
                <div class="service-header">
                    <h3 class="service-title">${service.title}</h3>
                    <div class="service-meta">
                        <span class="service-duration">${service.duration}</span>
                        <span class="service-price">£${service.price}</span>
                    </div>
                </div>
                <p class="service-summary">${service.summary}</p>
                <div class="service-description">
                    <p>${service.description}</p>
                </div>
                <div class="service-benefits">
                    <h4>Key Benefits:</h4>
                    <ul>
                        ${service.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                    </ul>
                </div>
                <div class="service-helps">
                    <h4>Who It Helps:</h4>
                    <ul class="helps-list">
                        ${service.whoItHelps.map(help => `<li>${help}</li>`).join('')}
                    </ul>
                </div>
                <div class="service-actions">
                    <a href="book.html" class="btn btn-primary">Book This Service</a>
                    <a href="mailto:withromilly@gmail.com?subject=Enquiry about ${service.title}" class="btn btn-outline">Ask a Question</a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // Render TOC for quick navigation
    renderServicesToc(services);
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