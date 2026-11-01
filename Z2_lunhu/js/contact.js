/* ============================================================
   CONTACT FORM
   Handle form validation and simulate message submission.
   ============================================================ */

// Get references to the contact form and its UI elements.
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const submitButton = document.getElementById("contact-submit");

// ============================================================
// FORM SUBMISSION
// Validate user input and simulate sending a message.
// ============================================================

contactForm.addEventListener("submit", (event) => {

    // Prevent the browser from submitting the form and reloading the page.
    event.preventDefault();

    // Check whether all required fields contain valid values.
    if (!contactForm.checkValidity()) {

        // Display the browser's built-in validation messages.
        contactForm.reportValidity();
        return;
    }

    // Disable the submit button to prevent multiple submissions.
    submitButton.disabled = true;

    // Inform the user that the message is being processed.
    contactStatus.textContent = "Odosielanie správy...";

    // Simulate a server response after a 5-second delay.
    setTimeout(() => {

        // Display a success message after the simulated submission.
        contactStatus.textContent =
            "Správa bola úspešne spracovaná.";

        // Clear all form fields.
        contactForm.reset();

        // Enable the submit button for another submission.
        submitButton.disabled = false;

    }, 5000);
});
