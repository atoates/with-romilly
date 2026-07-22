// Contact page — FormSubmit.co handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmission);
});

async function handleFormSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    clearMessages();

    if (!validateForm(data)) {
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Submission failed');
        }

        showSuccessMessage();
        form.reset();
    } catch (error) {
        showErrors(['Sorry, something went wrong. Please try again or contact Romilly directly by phone or email.']);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

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

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearMessages() {
    const errorContainer = document.getElementById('form-errors');
    const successContainer = document.getElementById('form-success');
    if (errorContainer) errorContainer.innerHTML = '';
    if (successContainer) successContainer.innerHTML = '';
}

function showErrors(errors) {
    const errorContainer = document.getElementById('form-errors');
    if (!errorContainer) return;

    errorContainer.innerHTML = `
        <div class="error-message">
            <h4>Please correct the following:</h4>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        </div>
    `;

    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showSuccessMessage() {
    const successContainer = document.getElementById('form-success');
    if (!successContainer) return;

    successContainer.innerHTML = `
        <div class="success-message">
            <h4>Message sent successfully</h4>
            <p>Thank you for your enquiry. Romilly will get back to you within 24 hours.</p>
        </div>
    `;

    successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
