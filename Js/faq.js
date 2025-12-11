// js/faq.js - Solo para el acordeón de Preguntas Frecuentes (index.html)

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en la página con FAQ
    const faqItems = document.querySelectorAll('.faq__item');
    if (faqItems.length === 0) return; // Si no hay FAQ, no hace nada

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        
        question.addEventListener('click', () => {
            // Cerrar todos los otros items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Abrir/cerrar el actual
            item.classList.toggle('active');
        });
    });
});