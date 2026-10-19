"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact-form");
    const statusBox = document.getElementById("contactFormStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const projectInput = document.getElementById("project");
            const messageInput = document.getElementById("message");
            const submitButton = contactForm.querySelector(".contact-submit-btn");

            function showStatus(message, isSuccess) {
                if (!statusBox) return;
                statusBox.textContent = message;
                statusBox.className = "contact-form-status " + (isSuccess ? "success" : "error");
                statusBox.hidden = false;
            }

            if (!nameInput || !nameInput.value.trim()) {
                showStatus("Please enter your name.", false);
                if (nameInput) nameInput.focus();
                return;
            }

            const emailVal = emailInput ? emailInput.value.trim() : "";
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal || !emailPattern.test(emailVal)) {
                showStatus("Please enter a valid email address.", false);
                if (emailInput) emailInput.focus();
                return;
            }

            if (!projectInput || !projectInput.value) {
                showStatus("Please select a project type.", false);
                if (projectInput) projectInput.focus();
                return;
            }

            if (!messageInput || !messageInput.value.trim()) {
                showStatus("Please enter your project message.", false);
                if (messageInput) messageInput.focus();
                return;
            }

            if (statusBox) {
                statusBox.hidden = true;
            }

            if (submitButton) {
                submitButton.textContent = "Sending...";
                submitButton.disabled = true;
            }

            const payload = {
                name: nameInput.value.trim(),
                email: emailVal,
                project: projectInput.value,
                message: messageInput.value.trim(),
                _subject: "New Project Inquiry - Arslan Weblab",
                _template: "table",
                _captcha: "false"
            };

            fetch("https://formsubmit.co/ajax/arslansahil850@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Network response was not ok");
                })
                .then(function () {
                    showStatus("Thank you! Your message has been sent successfully. I will get back to you soon.", true);
                    contactForm.reset();
                    if (submitButton) {
                        submitButton.textContent = "Message Sent!";
                        window.setTimeout(function () {
                            submitButton.textContent = "Send Message";
                            submitButton.disabled = false;
                        }, 4000);
                    }
                })
                .catch(function () {
                    showStatus("Failed to send message. Please try again or reach out directly via WhatsApp or email.", false);
                    if (submitButton) {
                        submitButton.textContent = "Send Message";
                        submitButton.disabled = false;
                    }
                });
        });
    }

    const whatsappButton = document.getElementById("whatsappContactBtn");
    if (whatsappButton) {
        const businessNumber = "923437773393";
        const message = "Hello, I visited your portfolio and would like to discuss a project.";
        whatsappButton.href = "https://wa.me/" + businessNumber + "?text=" + encodeURIComponent(message);
        whatsappButton.target = "_blank";
        whatsappButton.rel = "noopener noreferrer";
    }
});
