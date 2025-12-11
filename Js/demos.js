// ===== DEMOS.JS - VERSIÓN PRO CON GOOGLE SHEETS =====

// ===== CONFIGURACIÓN =====
// IMPORTANTE: Reemplaza esta URL con la tuya después de hacer el deploy
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjf3mzZJqD37yd90bfPBSfoqtWhnIbNsjG1gT8FEh3UuDm7_Wsf-UgtzFRVVp1TEB-/exec';

document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar si Google Sheets está configurado
    verificarConfiguracion();
    
    // ===== 1. ANIMACIÓN DE CONTADOR DE INTERESADOS =====
    animateCounters();
    
    // ===== 2. MODAL DE NOTIFICACIÓN =====
    setupNotificationModal();
    
    // ===== 3. NAVEGACIÓN MOBILE =====
    setupMobileNav();
    
    // ===== 4. INCREMENTAR CONTADOR AL HACER CLIC EN "NOTIFICARME" =====
    setupCounterIncrement();
    
    // ===== 5. LAZY LOADING DE IMÁGENES =====
    setupLazyLoading();
    
    // ===== 6. ANALYTICS TRACKING (opcional) =====
    setupAnalytics();
});

// ===== FUNCIÓN: VERIFICAR CONFIGURACIÓN =====
function verificarConfiguracion() {
    if (GOOGLE_SCRIPT_URL === 'PEGA_TU_URL_AQUI') {
        console.warn('⚠️ GOOGLE SHEETS NO CONFIGURADO');
        console.warn('Los datos se guardarán solo localmente.');
        console.warn('Para configurar Google Sheets, sigue las instrucciones en GUIA-COMPLETA-15MIN.md');
    } else {
        console.log('✅ Google Sheets configurado correctamente');
        console.log('URL:', GOOGLE_SCRIPT_URL);
    }
}

// ===== FUNCIÓN 1: ANIMACIÓN DE CONTADORES =====
function animateCounters() {
    const counters = document.querySelectorAll('.interested-count');
    
    if (counters.length === 0) {
        console.log('ℹ️ No se encontraron contadores para animar');
        return;
    }
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateValue(counter, 0, target, 1500);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    console.log(`✅ ${counters.length} contadores inicializados`);
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// ===== FUNCIÓN 2: MODAL DE NOTIFICACIÓN =====
function setupNotificationModal() {
    const modal = document.getElementById('notifyModal');
    const notifyButtons = document.querySelectorAll('.demo__btn-notify:not([disabled])');
    const closeButton = document.querySelector('.modal__close');
    const overlay = document.querySelector('.modal__overlay');
    const form = document.getElementById('notifyForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!modal) {
        console.log('ℹ️ Modal no encontrado en esta página');
        return;
    }
    
    console.log(`✅ Modal inicializado con ${notifyButtons.length} botones activos`);
    
    // Abrir modal
    notifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoName = this.getAttribute('data-demo-name');
            document.getElementById('demoName').value = demoName;
            openModal();
            console.log('📋 Modal abierto para:', demoName);
        });
    });
    
    // Cerrar modal
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // ESC para cerrar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Submit form
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }
    
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        form.reset();
        form.style.display = 'flex';
        successMessage.style.display = 'none';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        console.log('❌ Modal cerrado');
    }
    
    function handleFormSubmit() {
        const formData = {
            demo: document.getElementById('demoName').value,
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            timestamp: new Date().toISOString()
        };
        
        console.log('📤 Enviando formulario:', formData);
        
        // Guardar en localStorage (backup local)
        saveNotification(formData);
        
        // Enviar a Google Sheets
        sendToGoogleSheets(formData);
        
        // Mostrar mensaje de éxito
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
            closeModal();
        }, 3000);
    }
    
    function saveNotification(data) {
        let notifications = JSON.parse(localStorage.getItem('demoNotifications') || '[]');
        notifications.push(data);
        localStorage.setItem('demoNotifications', JSON.stringify(notifications));
        console.log('💾 Datos guardados en localStorage (backup)');
    }
}

// ===== FUNCIÓN: ENVIAR A GOOGLE SHEETS =====
function sendToGoogleSheets(data) {
    // Verificar si está configurado
    if (GOOGLE_SCRIPT_URL === 'PEGA_TU_URL_AQUI') {
        console.warn('⚠️ Google Sheets no configurado');
        console.warn('Los datos solo se guardaron localmente');
        console.warn('Para configurar, sigue las instrucciones en GUIA-COMPLETA-15MIN.md');
        return;
    }
    
    console.log('📡 Enviando a Google Sheets...');
    console.log('URL:', GOOGLE_SCRIPT_URL);
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('✅ Datos enviados a Google Sheets correctamente');
        console.log('Verifica tu Google Sheet para confirmar');
    })
    .catch(error => {
        console.error('❌ Error al enviar a Google Sheets:', error);
        console.log('💾 Los datos se guardaron localmente como backup');
    });
}

// ===== FUNCIÓN 3: NAVEGACIÓN MOBILE =====
function setupMobileNav() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (!navToggle || !navMenu) {
        console.log('ℹ️ Navegación móvil no encontrada en esta página');
        return;
    }
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animar hamburguesa
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav__menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
    
    console.log('✅ Navegación móvil inicializada');
}

// ===== FUNCIÓN 4: INCREMENTAR CONTADOR AL NOTIFICAR =====
function setupCounterIncrement() {
    const notifyButtons = document.querySelectorAll('.demo__btn-notify:not([disabled])');
    
    notifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.demo__card');
            const demoId = card.getAttribute('data-demo-id');
            
            // Verificar si ya se notificó antes
            const notified = localStorage.getItem(`demo-notified-${demoId}`);
            
            if (!notified) {
                // Incrementar contador
                const counter = card.querySelector('.interested-count');
                if (counter) {
                    const currentCount = parseInt(counter.textContent);
                    counter.textContent = currentCount + 1;
                    
                    // Marcar como notificado
                    localStorage.setItem(`demo-notified-${demoId}`, 'true');
                    
                    // Animación
                    counter.style.transform = 'scale(1.2)';
                    counter.style.color = '#22c55e';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                        counter.style.color = '#60a5fa';
                    }, 300);
                    
                    console.log(`📈 Contador incrementado para demo ${demoId}`);
                }
            }
        });
    });
}

// ===== FUNCIÓN 5: LAZY LOADING DE IMÁGENES =====
function setupLazyLoading() {
    const images = document.querySelectorAll('.demo__image img[loading="lazy"]');
    
    if (images.length === 0) {
        console.log('ℹ️ No hay imágenes con lazy loading');
        return;
    }
    
    if ('loading' in HTMLImageElement.prototype) {
        console.log('✅ Navegador soporta lazy loading nativo');
        return;
    }
    
    // Fallback para navegadores antiguos
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    console.log(`✅ Lazy loading configurado para ${images.length} imágenes`);
}

// ===== FUNCIÓN 6: ANALYTICS (OPCIONAL) =====
function setupAnalytics() {
    // Track clicks en botones "Probar Demo"
    const demoButtons = document.querySelectorAll('.demo__btn-primary');
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoName = this.closest('.demo__card').querySelector('h3').textContent;
            trackEvent('Demo', 'Click Probar', demoName);
        });
    });
    
    // Track clicks en botones "Solicitar"
    const requestButtons = document.querySelectorAll('.demo__buttons .btn--outline');
    requestButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoName = this.closest('.demo__card').querySelector('h3').textContent;
            trackEvent('Demo', 'Click Solicitar', demoName);
        });
    });
    
    // Track clicks en "Notificarme"
    const notifyButtons = document.querySelectorAll('.demo__btn-notify');
    notifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoName = this.getAttribute('data-demo-name');
            trackEvent('Demo', 'Click Notificar', demoName);
        });
    });
    
    console.log('✅ Analytics inicializado');
}

function trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Console log para debugging
    console.log('📊 Event tracked:', { category, action, label });
}

// ===== FUNCIÓN AUXILIAR: COPIAR AL PORTAPAPELES =====
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (error) {
            console.error('Error al copiar:', error);
        }
        document.body.removeChild(textArea);
    }
}

// ===== EXPORTAR FUNCIONES =====
window.demosUtils = {
    copyToClipboard,
    trackEvent,
    verificarConfiguracion
};

// ===== LOG DE INICIALIZACIÓN =====
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🚀 DEMOS.JS CARGADO CORRECTAMENTE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Versión: 2.0 PRO');
console.log('Fecha:', new Date().toLocaleString('es-CO'));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');