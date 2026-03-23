// ===== LÓGICA DE ENRUTAMIENTO SaaS (SuperAdmin Router) =====
// Este script verifica si la URL fue requerida con un Subdirectorio (Slug)
// Ej: variedadesjym.online/chantilly -> Busca "chantilly" en Supabase Maestro y redirige a su URL real
(async function initSaaSRouter() {
    const path = window.location.pathname; // ej: "/chantilly" o "/"

    // Si estamos en la raiz o en paginas conocidas del portafolio, no hacemos nada
    if (path === '/' || path.includes('.html') || path.includes('index.html')) {
        return; // Cargar landing normalmente
    }

    // Extraer el slug quitando el string "/"
    const slug = path.split('/')[1]?.toLowerCase();

    if (slug) {
        // Enlazar temporalmente Supabase SDK si no esta definido y hacer la consulta
        if (typeof supabase === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);

            await new Promise(resolve => script.onload = resolve);

            const localMasterScript = document.createElement('script');
            localMasterScript.src = 'Js/supabase-master.js';
            document.head.appendChild(localMasterScript);

            await new Promise(resolve => localMasterScript.onload = resolve);
        }

        try {
            // Mostrar estado de carga UX básico
            document.body.innerHTML = `
                <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1e293b;color:white;font-family:sans-serif;">
                    <div style="font-size:3rem;animation:pulse 1s infinite alternate;">🍔</div>
                    <h2 style="margin-top:20px;">Redirigiendo a tu local...</h2>
                    <style>@keyframes pulse { from {transform:scale(1)} to {transform:scale(1.2)} }</style>
                </div>
            `;

            const { data, error } = await supabaseMaster
                .from('clients')
                .select('vercel_url, is_active')
                .eq('slug', slug)
                .single();

            if (error || !data) {
                document.body.innerHTML = `
                    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1e293b;color:white;font-family:sans-serif;">
                        <span style="font-size:3rem">⚠️</span>
                        <h2 style="margin-top:20px;">Local no encontrado</h2>
                        <a href="/" style="color:#3b82f6;margin-top:10px;text-decoration:none;">Volver a Inicio</a>
                    </div>
                `;
                return;
            }

            if (!data.is_active) {
                document.body.innerHTML = `
                    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1e293b;color:white;font-family:sans-serif;">
                        <span style="font-size:3rem">⚠️</span>
                        <h2 style="margin-top:20px;">Esta tienda está temporalmente suspendida</h2>
                        <a href="/" style="color:#3b82f6;margin-top:10px;text-decoration:none;">Volver a Inicio</a>
                    </div>
                `;
                return;
            }

            // Redireccioón FINAL
            window.location.replace(data.vercel_url);

        } catch (err) {
            console.error("Error Router:", err);
            window.location.replace('/');
        }
    }
})();

// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initLazyLoading();
});

// ===== NAVEGACIÓN MÓVIL =====
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const header = document.querySelector('.header');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

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

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav__menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle && navMenu) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Header con efecto scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Auto-hide en scroll down (solo en móviles)
        if (window.innerWidth <= 768) {
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        lastScroll = currentScroll;
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
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
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
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
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function (e) {
});

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
window.initLazyLoading = initLazyLoading;
