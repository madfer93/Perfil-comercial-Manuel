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

// ===== CONTADOR ANIMADO - VERSIÓN CORREGIDA =====
class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.stat__number');
        this.animated = new Set();
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateCounter(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            this.counters.forEach(counter => this.observer.observe(counter));
        } else {
            // Fallback para navegadores sin IntersectionObserver
            this.counters.forEach(counter => this.animateCounter(counter));
        }
    }

    animateCounter(element) {
        // CLAVE: Leer data-target primero
        const target = parseInt(element.getAttribute('data-target'));
        
        if (isNaN(target) || target === 0) {
            console.warn('⚠️ Contador sin data-target válido:', element);
            return;
        }
        
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.innerText = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.innerText = target;
            }
        };

        // Iniciar desde 0
        element.innerText = '0';
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
    
    console.log('✅ Animaciones inicializadas');
    console.log('🔢 Contadores encontrados:', document.querySelectorAll('.stat__number').length);
});

// ===== EXPORTAR =====
window.ScrollAnimations = ScrollAnimations;
window.AnimatedCounters = AnimatedCounters;
window.PerformanceUtils = PerformanceUtils;
