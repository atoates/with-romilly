// Book page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadServicesQuickRef();
    initializeNavigation();
    initializeBookingWidget();
});

// Load services for quick reference
async function loadServicesQuickRef() {
    try {
        const response = await fetch('/src/data/content.json');
        const data = await response.json();
        
        displayServicesQuickRef(data.services);
    } catch (error) {
        console.error('Error loading services:', error);
        displayFallbackServices();
    }
}

// Display services quick reference
function displayServicesQuickRef(services) {
    const servicesQuick = document.getElementById('services-quick');
    if (!servicesQuick) return;
    
    servicesQuick.innerHTML = services.map(service => `
        <div class="service-quick-card">
            <div class="service-quick-header">
                <h4>${service.title}</h4>
                <div class="service-quick-meta">
                    <span class="duration">${service.duration}</span>
                    <span class="price">£${service.price}</span>
                </div>
            </div>
            <p class="service-quick-summary">${service.summary}</p>
        </div>
    `).join('');
}

// Fallback services if JSON fails to load
function displayFallbackServices() {
    const servicesQuick = document.getElementById('services-quick');
    if (!servicesQuick) return;
    
    servicesQuick.innerHTML = `
        <div class="service-quick-card">
            <div class="service-quick-header">
                <h4>Reflexology</h4>
                <div class="service-quick-meta">
                    <span class="duration">50 min</span>
                    <span class="price">£75</span>
                </div>
            </div>
            <p class="service-quick-summary">Deeply relaxing and therapeutic for all the body's systems.</p>
        </div>
        <div class="service-quick-card">
            <div class="service-quick-header">
                <h4>Facial Reflexology</h4>
                <div class="service-quick-meta">
                    <span class="duration">45 min</span>
                    <span class="price">£80</span>
                </div>
            </div>
            <p class="service-quick-summary">Powerfully calming for the nervous system and rejuvenating for skin.</p>
        </div>
    `;
}

// Initialize booking widget functionality
function initializeBookingWidget() {
    // Monitor for Setmore iframe load
    const bookingButton = document.getElementById('Setmore_button_iframe');
    
    if (bookingButton) {
        bookingButton.addEventListener('click', function(e) {
            // Track booking button click (for analytics if needed)
            console.log('Booking widget opened');
            
            // Add a small delay to show loading state
            showBookingLoading();
        });
    }
    
    // Listen for Setmore events if they're available
    window.addEventListener('message', function(event) {
        // Handle messages from Setmore iframe
        if (event.origin === 'https://with-romilly.setmore.com' || 
            event.origin === 'https://assets.setmore.com') {
            
            if (event.data && event.data.type === 'setmore_booking_complete') {
                // Handle successful booking
                showBookingSuccess();
            }
        }
    });
}

// Show loading state for booking
function showBookingLoading() {
    const container = document.querySelector('.booking-button-container');
    const originalContent = container.innerHTML;
    
    container.innerHTML = `
        <div class="booking-loading">
            <div class="loading-spinner"></div>
            <p>Opening booking calendar...</p>
        </div>
    `;
    
    // Restore original content after a short delay
    setTimeout(() => {
        container.innerHTML = originalContent;
        // Re-initialize the booking widget
        initializeBookingWidget();
    }, 2000);
}

// Show booking success message
function showBookingSuccess() {
    const notification = document.createElement('div');
    notification.className = 'booking-success-notification';
    notification.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✅</div>
            <h4>Booking Confirmed!</h4>
            <p>Thank you for booking with With Romilly. You'll receive a confirmation email shortly.</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
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

// Add custom styles for booking interactions
const style = document.createElement('style');
style.textContent = `
    .booking-loading {
        text-align: center;
        padding: 2rem;
        color: var(--primary-color);
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .booking-success-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 2px solid #22c55e;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
    }
    
    .success-content {
        padding: 1.5rem;
        text-align: center;
    }
    
    .success-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .success-content h4 {
        color: #16a34a;
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }
    
    .success-content p {
        color: var(--text-color);
        margin: 0;
        font-size: 0.9rem;
    }
    
    .booking-success-notification.fade-out {
        animation: slideOutRight 0.3s ease-out forwards;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);