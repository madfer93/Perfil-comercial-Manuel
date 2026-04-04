document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('b2bContactForm');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitB2B');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Honeypot check
            const hp = document.getElementById('hp_field').value;
            if (hp) {
                console.warn('Bot detected by honeypot');
                return; // Silent fail for bots
            }

            // Recoger y sanitizar valores
            const fullName = document.getElementById('fullName').value.trim();
            const companyName = document.getElementById('companyName').value.trim();
            const workEmail = document.getElementById('workEmail').value.trim().toLowerCase();
            const phone = document.getElementById('phone').value.trim();
            const companySize = document.getElementById('companySize').value;
            const budget = document.getElementById('budget').value;
            const useCase = document.getElementById('useCase').value.trim();

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                // Ejecutar reCAPTCHA v3
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LfEwaUsAAAAANUnklDI2UmRYLjYGYYzFtuOcqQ5', {action: 'submit_lead'}).then(async function(token) {
                        try {
                            // Insertar en Supabase.
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
                                    // captcha_token: token // Si el usuario agrega esta columna después
                                }]);

                            if (error) throw error;

                            // Feedback visual
                            feedback.textContent = '¡Solicitud enviada con éxito! Nuestro equipo revisará la información y te contactará en breve.';
                            feedback.className = 'form-feedback success';
                            contactForm.reset();
                            feedback.classList.remove('hidden');

                        } catch (error) {
                            console.error('Error al insertar lead:', error.message);
                            feedback.textContent = 'Ocurrió un error al enviar tu solicitud. Por favor intenta por el botón de soporte rápido de WhatsApp.';
                            feedback.className = 'form-feedback error';
                            feedback.classList.remove('hidden');
                        } finally {
                            submitBtn.innerHTML = 'Enviar Solicitud <i class="fas fa-paper-plane"></i>';
                            submitBtn.disabled = false;
                        }
                    });
                });

            } catch (error) {
                console.error('General Error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar Solicitud <i class="fas fa-paper-plane"></i>';
            } finally {
                // Ocultar mensaje después de 8 segundos
                setTimeout(() => {
                    feedback.classList.add('hidden');
                }, 8000);
            }
        });
    }
});
