// ============================================ //
// ELORA TECH LTD - MAIN JAVASCRIPT
// ============================================ //

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// ============================================ //
// PRELOADER
// ============================================ //
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ============================================ //
// NAVBAR FUNCTIONALITY
// ============================================ //
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger?.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Smooth scrolling for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offset = 80; // Account for fixed header
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Close mobile menu
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ============================================ //
// COUNTER ANIMATION (Hero Stats)
// ============================================ //
function animateHeroCounters() {
    const counters = document.querySelectorAll('.hero .stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(target * easeOutQuart);
                    
                    counter.textContent = current.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================ //
// VISION STATS COUNTER ANIMATION
// ============================================ //
function initVisionCounters() {
    const statNumbers = document.querySelectorAll('.vision .stat-number');
    if (!statNumbers.length) return;
    
    let animated = false;

    function animateStats() {
        if (animated) return;
        animated = true;

        statNumbers.forEach(stat => {
            const targetAttr = stat.getAttribute('data-target');
            const target = parseInt(targetAttr);
            const isYear = targetAttr?.length === 4;
            const currentText = stat.textContent;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);

                if (isYear) {
                    const startYear = 2026;
                    const value = Math.floor(startYear + (target - startYear) * easeOutQuart);
                    stat.textContent = value;
                } else {
                    const startValue = parseInt(currentText.replace(/\D/g, '')) || 0;
                    const value = Math.floor(startValue + (target - startValue) * easeOutQuart);
                    stat.textContent = value + '+';
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = isYear ? target : target + '+';
                    
                    // Celebration effect
                    stat.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const visionSection = document.querySelector('.vision');
    if (visionSection) {
        observer.observe(visionSection);
    }
}

// ============================================ //
// SERVICES TABS FUNCTIONALITY
// ============================================ //
function initServicesTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabBtns.length) return;

    function switchTab(tabId) {
        // Update active tab button
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });

        // Update active tab content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${tabId}`);
        });
    });

    // Check for hash on page load
    const hash = window.location.hash.substring(1);
    if (hash && ['it', 'edu', 'digital'].includes(hash)) {
        switchTab(hash);
    }
}

// ============================================ //
// CONTACT FORM HANDLING
// ============================================ //
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success message
            showNotification('🎉 Thank you! Your inquiry has been received. We\'ll respond within 24 hours to discuss building your system.', 'success');
            
            // Reset form
            this.reset();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================ //
// UI ENHANCEMENTS
// ============================================ //
function initUIEnhancements() {
    // WhatsApp floating button
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/2348105769233?text=Hello%20Elora%20Tech%20Team!%20I\'m%20interested%20in%20your%20services.';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    
    // Style WhatsApp button
    whatsappBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #25d366;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
        z-index: 999;
        transition: all 0.3s ease;
        text-decoration: none;
    `;
    
    whatsappBtn.addEventListener('mouseenter', () => {
        whatsappBtn.style.transform = 'scale(1.1) translateY(-5px)';
    });
    
    whatsappBtn.addEventListener('mouseleave', () => {
        whatsappBtn.style.transform = 'scale(1) translateY(0)';
    });
    
    document.body.appendChild(whatsappBtn);

    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 16px;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    `;
    
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        // Back to top visibility
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'translateY(-5px)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'translateY(0)';
    });
}

// ============================================ //
// PARALLAX EFFECT
// ============================================ //
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        const heroContent = hero.querySelector('.hero-content');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ============================================ //
// TYPING EFFECT
// ============================================ //
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);
}

// ============================================ //
// ADD ANIMATION STYLES
// ============================================ //
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        .whatsapp-float:hover {
            transform: scale(1.1) translateY(-5px);
            box-shadow: 0 15px 40px rgba(37, 211, 102, 0.5);
        }
        
        .back-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.7;
            transition: opacity 0.3s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// ============================================ //
// INITIALIZE EVERYTHING
// ============================================ //
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    animateHeroCounters();
    initVisionCounters();
    initServicesTabs();
    initContactForm();
    
    // UI Enhancements
    initUIEnhancements();
    initParallax();
    initTypingEffect();
    addAnimationStyles();
    
    // Log success
    console.log('🚀 Elora Tech Ltd - Systems ready');
});

// ============================================ //
// SMOOTH SCROLL FOR HASH LINKS
// ============================================ //
window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            setTimeout(() => {
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// ============================================ //
// EXPORT FOR TESTING (if needed)
// ============================================ //
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        animateHeroCounters,
        initVisionCounters,
        initServicesTabs,
        initContactForm
    };
}