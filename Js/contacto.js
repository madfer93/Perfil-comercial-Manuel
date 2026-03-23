document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('b2bContactForm');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitB2B');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Recoger valores
            const fullName = document.getElementById('fullName').value;
            const companyName = document.getElementById('companyName').value;
            const workEmail = document.getElementById('workEmail').value;
            const phone = document.getElementById('phone').value;
            const companySize = document.getElementById('companySize').value;
            const budget = document.getElementById('budget').value;
            const useCase = document.getElementById('useCase').value;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                // Insertar en Supabase. Se asume que supabaseMaster está disponible desde supabase-master.js
                // y que existe una tabla "leads".
                const { data, error } = await supabaseMaster
                    .from('leads')
                    .insert([{
                        nombre: fullName,
                        empresa: companyName,
                        email: workEmail,
                        telefono: phone,
                        tamano_empresa: companySize,
                        presupuesto: budget,
                        caso_uso: useCase,
                        origen: window.location.href,
                        estado: 'Nuevo'
                    }]);

                if (error) throw error;

                // Feedback visual
                feedback.textContent = '¡Solicitud enviada con éxito! Nuestro equipo revisará la información y te contactará en breve.';
                feedback.className = 'form-feedback success';
                contactForm.reset();

            } catch (error) {
                console.error('Error al insertar lead:', error.message);
                feedback.textContent = 'Ocurrió un error al enviar tu solicitud. Por favor intenta por el botón de soporte rápido de WhatsApp.';
                feedback.className = 'form-feedback error';

            } finally {
                feedback.classList.remove('hidden');
                submitBtn.innerHTML = 'Enviar Solicitud <i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
                
                // Ocultar mensaje después de 8 segundos
                setTimeout(() => {
                    feedback.classList.add('hidden');
                }, 8000);
            }
        });
    }
});
