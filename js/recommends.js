// Recommends page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeNavigation();
});

// Load and display products
async function loadProducts() {
    try {
        const response = await fetch('/src/data/content.json');
        const data = await response.json();
        
        displayProducts(data.recommends);
    } catch (error) {
        console.error('Error loading products:', error);
        displayFallbackProducts();
    }
}

// Display products in the grid
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <a href="${product.url}" target="_blank" rel="noopener" class="btn btn-primary">Learn More</a>
                    <button class="btn btn-outline" onclick="shareProduct('${product.name}')">Share</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add animation
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.add('fade-in-up');
    });
}

// Fallback products if JSON fails to load
function displayFallbackProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = `
        <div class="product-card">
            <div class="product-content">
                <h3 class="product-name">Hayou Method Bamboo Body Tapper</h3>
                <p class="product-description">Gentle body tapping for circulation and lymphatic drainage</p>
                <div class="product-actions">
                    <a href="#" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        </div>
        <div class="product-card">
            <div class="product-content">
                <h3 class="product-name">Theta Naturals Co. Connect & Restore Bath Salts</h3>
                <p class="product-description">Mineral-rich salts for deep relaxation and muscle relief</p>
                <div class="product-actions">
                    <a href="#" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        </div>
        <div class="product-card">
            <div class="product-content">
                <h3 class="product-name">White Sage Cleansing Bundle</h3>
                <p class="product-description">Traditional sage for space clearing and energy cleansing</p>
                <div class="product-actions">
                    <a href="#" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        </div>
        <div class="product-card">
            <div class="product-content">
                <h3 class="product-name">Amethyst Healing Stone</h3>
                <p class="product-description">Natural crystal for relaxation and stress relief</p>
                <div class="product-actions">
                    <a href="#" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        </div>
    `;
}

// Share product function
function shareProduct(productName) {
    if (navigator.share) {
        navigator.share({
            title: `${productName} - Recommended by With Romilly`,
            text: `Check out this wellness product recommended by Romilly`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support native sharing
        const url = window.location.href;
        const text = `Check out ${productName} - recommended by With Romilly: ${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Link copied to clipboard!');
            }).catch(() => {
                showNotification('Unable to copy link');
            });
        } else {
            showNotification('Sharing not supported');
        }
    }
}

// Show notification
function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
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