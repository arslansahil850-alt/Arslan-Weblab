"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        return;
    }

    const revealElements = document.querySelectorAll(
        "section:not(.hero), .about-content, .about-card, .service-card, .project-card, .case-study-card, .skill-card, .process-card, .testimonial-card, .contact-card, .contact-form, .cta-content"
    );

    revealElements.forEach(function (element, index) {
        element.classList.add("scroll-reveal");

        if (index % 4 === 1) {
            element.classList.add("reveal-delay-1");
        } else if (index % 4 === 2) {
            element.classList.add("reveal-delay-2");
        } else if (index % 4 === 3) {
            element.classList.add("reveal-delay-3");
        }
    });

    const observer = new IntersectionObserver(
        function (entries, revealObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    document.querySelectorAll(".scroll-reveal").forEach(function (element) {
        observer.observe(element);
    });
});
