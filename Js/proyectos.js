const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjf3mzZJqD37yd90bfPBSfoqtWhnIbNsjG1gT8FEh3UuDm7_Wsf-UgtzFRVVp1TEB-/exec';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const buttons = document.querySelectorAll('.proyecto__btn-contact, .proyecto__btn-notify');
    const closeBtn = document.querySelector('.modal__close');
    const form = document.getElementById('contactForm');
    const success = document.getElementById('successMessage');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('proyectoName').value = btn.dataset.proyecto;
            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            proyecto: document.getElementById('proyectoName').value,
            name: document.querySelector('#userName').value,
            email: document.querySelector('#userEmail').value,
            phone: document.querySelector('#userPhone').value,
            timestamp: new Date().toISOString()
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        }).then(() => {
            form.style.display = 'none';
            success.style.display = 'block';
            setTimeout(() => modal.classList.remove('active'), 3000);
        }).catch(() => alert('Error, intenta de nuevo'));
    });
});