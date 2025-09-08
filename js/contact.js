// Simpele, niet-functionele submit: houdt de pagina netjes en toont status.
// Later kan je hier een fetch() toevoegen naar je backend.

(function () {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // basis check: enkel tonen dat dit nog niet “echt” verzendt
        if (!form.email.value || !form.message.value || !form.consent.checked) {
            status.textContent = 'Vul de verplichte velden in en accepteer de privacyverklaring.';
            return;
        }
        status.textContent = 'Dit is een demo: het formulier wordt nog niet verstuurd.';
    });
})();
