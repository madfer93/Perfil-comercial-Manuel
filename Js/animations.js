// ===== ANIMACIONES AVANZADAS MEJORADAS =====
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.createObserver();
        this.registerElements();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    registerElements() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            const animationType = element.getAttribute('data-animate');
            this.setInitialStyles(element, animationType);
            
            this.elements.push(element);
            this.observer.observe(element);
        });
    }

    setInitialStyles(element, animationType) {
        switch(animationType) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-30px)';
                break;
            case 'fade-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(30px)';
                break;
            case 'scale':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                break;
            default:
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
        }
        
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animate');
        
        element.style.opacity = '1';
        
        switch(animationType) {
            case 'fade-up':
            case 'fade-left':
            case 'fade-right':
                element.style.transform = 'translate(0)';
                break;
            case 'scale':
                element.style.transform = 'scale(1)';
                break;
            default:
                element.style.transform = 'translateY(0)';
        }
    }
}

// ===== CONTADORES ANIMADOS MEJORADOS =====
class AnimatedCounters {
    constructor() {
        this.counters = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.counters = document.querySelectorAll('.stat__number');
        this.createObserver();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => this.observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    new ScrollAnimations();
    new AnimatedCounters();
});

// ===== UTILIDADES DE PERFORMANCE =====
class PerformanceUtils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// ===== EXPORTAR PARA USO GLOBAL =====
window.ScrollAnimations = ScrollAnimations;
window.AnimatedCounters = AnimatedCounters;
window.PerformanceUtils = PerformanceUtils;