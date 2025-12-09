// ===== ANIMACIONES DE SCROLL =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });

            this.elements.forEach(el => this.observer.observe(el));
        } else {
            // Fallback para navegadores antiguos
            this.elements.forEach(el => this.animateElement(el));
        }
    }

    animateElement(element) {
        const animation = element.dataset.animate;
        element.classList.add('animate-' + animation);
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

// ===== CONTADOR ANIMADO =====
class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.stat__value');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            });

            this.counters.forEach(counter => this.observer.observe(counter));
        }
    }

    animateCounter(element) {
        const target = parseInt(element.innerText.replace(/\D/g, ''));
        const suffix = element.innerText.replace(/\d/g, '');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.innerText = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.innerText = target + suffix;
            }
        };

        updateCounter();
    }
}

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
        };
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new AnimatedCounters();
});

// ===== EXPORTAR =====
window.ScrollAnimations = ScrollAnimations;
window.AnimatedCounters = AnimatedCounters;
window.PerformanceUtils = PerformanceUtils;
