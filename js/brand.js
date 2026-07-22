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

    // Inline critical styles so the CTA never renders as a stray unstyled
    // footer link when styles.css is cached stale.
    Object.assign(cta.style, {
        position: 'fixed',
        right: '1.25rem',
        zIndex: '1000',
        background: '#3B5F56',
        color: '#fff',
        fontFamily: "'Avenir', 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: '1rem',
        fontWeight: '600',
        textDecoration: 'none',
        padding: '0.875rem 1.5rem',
        borderRadius: '999px',
        boxShadow: '0 8px 32px rgba(59, 95, 86, 0.16)',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '4.5rem',
        minHeight: '3rem',
        display: 'none',
    });

    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const updateStickyCta = () => {
        const isMobile = mobileQuery.matches;
        const hasCookieBanner = !!document.querySelector('.cookie-consent');
        cta.style.display = isMobile ? 'flex' : 'none';
        cta.style.bottom = isMobile && hasCookieBanner ? '6.5rem' : '1.25rem';
    };

    mobileQuery.addEventListener('change', updateStickyCta);
    updateStickyCta();

    document.body.appendChild(cta);

    // Cookie banner is injected after DOMContentLoaded — recheck once it appears.
    setTimeout(updateStickyCta, 100);
}
