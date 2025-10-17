// GDPR Cookie Consent Manager
// Simple, lightweight cookie consent banner

class CookieConsent {
    constructor() {
        this.cookieName = 'withromilly_cookie_consent';
        this.cookieExpiry = 365; // days
        this.init();
    }

    init() {
        // Check if consent already given
        if (!this.hasConsent()) {
            this.showBanner();
        }
    }

    hasConsent() {
        return this.getCookie(this.cookieName) !== null;
    }

    showBanner() {
        // Create banner HTML
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h4>🍪 We Value Your Privacy</h4>
                    <p>This website uses cookies to ensure you get the best experience. We only use essential cookies for functionality. No tracking or analytics cookies are used. <a href="privacy.html">Privacy Policy</a></p>
                </div>
                <div class="cookie-consent-actions">
                    <button class="cookie-btn cookie-btn-accept" id="acceptCookies">Accept</button>
                    <button class="cookie-btn cookie-btn-decline" id="declineCookies">Decline</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 500);

        // Add event listeners
        document.getElementById('acceptCookies').addEventListener('click', () => {
            this.acceptCookies();
            this.hideBanner(banner);
        });

        document.getElementById('declineCookies').addEventListener('click', () => {
            this.declineCookies();
            this.hideBanner(banner);
        });
    }

    hideBanner(banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 400);
    }

    acceptCookies() {
        this.setCookie(this.cookieName, 'accepted', this.cookieExpiry);
        console.log('Cookies accepted');
        // Enable analytics here if needed in future
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('consent', 'update', {'analytics_storage': 'granted'});
    }

    declineCookies() {
        this.setCookie(this.cookieName, 'declined', this.cookieExpiry);
        console.log('Cookies declined');
        // Disable all non-essential cookies
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Public method to revoke consent (can be called from settings page)
    revokeConsent() {
        this.setCookie(this.cookieName, '', -1);
        location.reload();
    }
}

// Initialize cookie consent when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieConsent = new CookieConsent();
    });
} else {
    window.cookieConsent = new CookieConsent();
}
