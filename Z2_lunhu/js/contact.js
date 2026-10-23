
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const submitButton = document.getElementById("contact-submit");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    submitButton.disabled = true;
    contactStatus.textContent = "Odosielanie správy...";

    setTimeout(() => {
        contactStatus.textContent =
            "Správa bola úspešne spracovaná (simulácia odoslania).";

        contactForm.reset();
        submitButton.disabled = false;
    }, 5000);
});
