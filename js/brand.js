// Central brand/contact data — single source loaded from content.json
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('src/data/content.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        applyBrand(data.brand);
    } catch (error) {
        console.error('Brand data failed to load:', error);
    }

    injectStickyBookCta();
});

function applyBrand(brand) {
    if (!brand) return;

    const phoneTel = brand.phone.replace(/\s/g, '');

    document.querySelectorAll('[data-brand="phone-link"]').forEach((el) => {
        el.href = `tel:${phoneTel}`;
        if (el.hasAttribute('data-brand-text')) {
            el.textContent = brand.phoneDisplay;
        }
    });

    document.querySelectorAll('[data-brand="phone-display"]').forEach((el) => {
        el.textContent = brand.phoneDisplay;
    });

    document.querySelectorAll('[data-brand="whatsapp"]').forEach((el) => {
        el.href = brand.whatsapp;
    });

    document.querySelectorAll('[data-brand="email"]').forEach((el) => {
        if (el.tagName === 'A') {
            el.href = `mailto:${brand.email}`;
        }
        if (el.hasAttribute('data-brand-text')) {
            el.textContent = brand.email;
        }
    });
}

function injectStickyBookCta() {
    if (document.querySelector('.sticky-book-cta') || document.body.classList.contains('no-sticky-cta')) {
        return;
    }

    const isBookPage = /book\.html$/i.test(window.location.pathname);
    if (isBookPage) return;

    const cta = document.createElement('a');
    cta.href = 'book.html';
    cta.className = 'sticky-book-cta';
    cta.setAttribute('aria-label', 'Book an appointment');
    cta.textContent = 'Book';
    document.body.appendChild(cta);
}
