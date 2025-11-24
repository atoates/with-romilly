// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactForm();
});

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmission);
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual form handler)
    setTimeout(() => {
        // Create email content
        const emailContent = createEmailContent(data);
        
        // Open email client with pre-filled content
        const emailLink = `mailto:withromilly@gmail.com?subject=New Contact Form Submission from ${data.firstName} ${data.lastName}&body=${encodeURIComponent(emailContent)}`;
        window.location.href = emailLink;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        e.target.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
    }, 1000);
}

// Validate form data
function validateForm(data) {
    const errors = [];
    
    if (!data.firstName?.trim()) {
        errors.push('First name is required');
    }
    
    if (!data.lastName?.trim()) {
        errors.push('Last name is required');
    }
    
    if (!data.email?.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message?.trim()) {
        errors.push('Message is required');
    }
    
    if (!data.consent) {
        errors.push('You must consent to being contacted');
    }
    
    if (errors.length > 0) {
        showErrors(errors);
        return false;
    }
    
    return true;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create email content
function createEmailContent(data) {
    const serviceText = data.service ? getServiceText(data.service) : 'Not specified';
    
    return `
New contact form submission from the With Romilly website:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Service Interest: ${serviceText}

Message:
${data.message}

---
Submitted at: ${new Date().toLocaleString()}
Consent given: Yes
    `.trim();
}

// Get service text from value
function getServiceText(serviceValue) {
    const services = {
        'reflexology': 'Reflexology (50 min) - £75',
        'facial-reflexology': 'Facial Reflexology (45 min) - £80',
        'preconceptual-reflexology': 'Preconceptual Reflexology (50 min) - £75',
        'zone-face-lift': 'Zone Face Lift (75 min) - £105',
        'consultation': 'General Consultation'
    };
    
    return services[serviceValue] || serviceValue;
}

// Show validation errors
function showErrors(errors) {
    const errorContainer = document.getElementById('form-errors') || createErrorContainer();
    
    errorContainer.innerHTML = `
        <div class="error-message">
            <h4>Please correct the following errors:</h4>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        </div>
    `;
    
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Create error container
function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'form-errors';
    container.className = 'form-errors';
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(container, form);
    
    return container;
}

// Show success message
function showSuccessMessage() {
    const successContainer = document.getElementById('form-success') || createSuccessContainer();
    
    successContainer.innerHTML = `
        <div class="success-message">
            <h4>Message Sent Successfully!</h4>
            <p>Thank you for your enquiry. We'll get back to you within 24 hours to confirm your booking or answer your questions.</p>
        </div>
    `;
    
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove error messages if they exist
    const errorContainer = document.getElementById('form-errors');
    if (errorContainer) {
        errorContainer.innerHTML = '';
    }
}

// Create success container
function createSuccessContainer() {
    const container = document.createElement('div');
    container.id = 'form-success';
    container.className = 'form-success';
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(container, form);
    
    return container;
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