// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
<<<<<<< HEAD
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initLazyLoading();
=======
    // Inicializar todas las funcionalidades
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
>>>>>>> 2af032e0ea1f4ed34263ac9f65fb00ef058477b3
});

// ===== NAVEGACIÓN MÓVIL =====
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const header = document.querySelector('.header');
<<<<<<< HEAD
    
=======

>>>>>>> 2af032e0ea1f4ed34263ac9f65fb00ef058477b3
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
<<<<<<< HEAD
            
            // Animación del toggle
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
=======
        });
    }

>>>>>>> 2af032e0ea1f4ed34263ac9f65fb00ef058477b3
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav__menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
<<<<<<< HEAD
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Header con efecto scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
=======
        });
    });

    // Header con efecto scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
>>>>>>> 2af032e0ea1f4ed34263ac9f65fb00ef058477b3
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
<<<<<<< HEAD
        
        // Auto-hide en scroll down (solo en móviles)
        if (window.innerWidth <= 768) {
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        lastScroll = currentScroll;
=======
>>>>>>> 2af032e0ea1f4ed34263ac9f65fb00ef058477b3
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Efecto parallax para elementos flotantes
<<<<<<< HEAD
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const floatingCards = document.querySelectorAll('.floating-card');
                
                floatingCards.forEach((card, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const yPos = -(scrolled * speed);
                    card.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== LAZY LOADING DE IMÁGENES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sin IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
=======
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            card.style.transform = `translateY(${yPos}px)`;
        });
    });
>>>>>>> 2af032e0ea1f4ed34263ac9f65fb00ef058477b3
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

<<<<<<< HEAD
// ===== PERFORMANCE OPTIMIZATIONS =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===== COMPATIBILIDAD =====
if (!('IntersectionObserver' in window)) {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}

// ===== EXPORTAR FUNCIONES =====
window.initNavigation = initNavigation;
window.initSmoothScrolling = initSmoothScrolling;
window.initScrollEffects = initScrollEffects;
=======
// ===== OPTIMIZACIONES DE RENDIMIENTO =====
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            scrollTimeout = null;
            // Código que se ejecuta después de que el scroll se detiene
        }, 100);
    }
});

// ===== COMPATIBILIDAD =====
// Polyfill para IntersectionObserver si es necesario
if (!('IntersectionObserver' in window)) {
    // Cargar polyfill dinámicamente
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}
>>>>>>> 2af032e0ea1f4ed34263ac9f65fb00ef058477b3
