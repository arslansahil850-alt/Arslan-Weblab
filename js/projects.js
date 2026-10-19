"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const projectFilters = document.querySelectorAll(".project-filter");
    const projectCards = document.querySelectorAll(".project-page-card");

    if (!projectFilters.length || !projectCards.length) {
        return;
    }

    projectFilters.forEach(function (filter) {
        filter.addEventListener("click", function () {
            const selectedCategory = filter.dataset.filter;

            projectFilters.forEach(function (button) {
                button.classList.remove("active");
            });

            filter.classList.add("active");

            projectCards.forEach(function (card) {
                const cardCategory = card.dataset.category;
                const shouldShow = selectedCategory === "all" || cardCategory === selectedCategory;
                card.hidden = !shouldShow;
                card.style.display = shouldShow ? "" : "none";
            });
        });
    });
});
