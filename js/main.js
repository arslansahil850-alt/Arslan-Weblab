"use strict";

(function initThemeImmediately() {
    const validThemes = ["system", "dark-blue", "light-blue", "white", "multi"];
    let savedChoice = "system";

    try {
        const stored = localStorage.getItem("selectedTheme") || localStorage.getItem("arslanWeblabTheme");
        if (stored === "black") {
            savedChoice = "dark-blue";
        } else if (validThemes.includes(stored)) {
            savedChoice = stored;
        }
    } catch (error) {
        savedChoice = "system";
    }

    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const appliedTheme = savedChoice === "system"
        ? (systemDark ? "dark-blue" : "light-blue")
        : savedChoice;

    document.documentElement.setAttribute("data-theme", appliedTheme);
    document.documentElement.setAttribute("data-selected-theme", savedChoice);
    if (document.body) {
        document.body.setAttribute("data-theme", appliedTheme);
        document.body.setAttribute("data-selected-theme", savedChoice);
    }
})();

(function initLoader() {
    const pageLoader = document.getElementById("pageLoader");
    if (!pageLoader) return;

    let isWindowLoaded = document.readyState === "complete";
    let isMinTimeElapsed = false;
    let isDismissed = false;

    function revealSite() {
        if (isDismissed) return;
        isDismissed = true;
        pageLoader.classList.add("hidden");
        window.setTimeout(function () {
            if (pageLoader.parentNode) {
                pageLoader.parentNode.removeChild(pageLoader);
            }
        }, 500);
    }

    function checkReady() {
        if (isWindowLoaded && isMinTimeElapsed) {
            revealSite();
        }
    }

    window.setTimeout(function () {
        isMinTimeElapsed = true;
        checkReady();
    }, 1000);

    if (isWindowLoaded) {
        checkReady();
    } else {
        window.addEventListener("load", function () {
            isWindowLoaded = true;
            checkReady();
        }, { once: true });
    }

    window.setTimeout(function () {
        revealSite();
    }, 7000);
})();

document.addEventListener("DOMContentLoaded", function () {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

    const siteHeader = $(".site-header");
    const themeToggleBtn = $("#themeToggleBtn");
    const themeOptions = $("#themeOptions");
    const moreButton = $("#moreButton");
    const moreMenu = $("#moreMenu");
    const mobileMenuButton = $("#mobileMenuButton");
    const mobileMenu = $("#mobileMenu");
    const mobileThemeButton = $("#mobileThemeButton");
    const mobileThemeOptions = $("#mobileThemeOptions");
    const mobileThemeName = $("#mobileThemeName");

    const themeNames = ["system", "dark-blue", "light-blue", "white", "multi"];
    const themeLabels = {
        system: "System Theme",
        "dark-blue": "Dark Blue",
        "light-blue": "Light Blue",
        white: "Pure White",
        multi: "Multicolor"
    };

    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    function getSavedTheme() {
        try {
            const current = localStorage.getItem("selectedTheme");
            const older = localStorage.getItem("arslanWeblabTheme");

            if (current && themeNames.includes(current)) return current;
            if (older === "black") return "dark-blue";
            if (older && themeNames.includes(older)) return older;
        } catch (error) {
            return "system";
        }
        return "system";
    }

    let currentThemeChoice = getSavedTheme();

    function resolveTheme(choice) {
        if (choice === "system") {
            return systemPreference.matches ? "dark-blue" : "light-blue";
        }
        return choice;
    }

    function updateThemeUI(choice) {
        $$("[data-theme-option]").forEach(function (btn) {
            const isSelected = btn.dataset.themeOption === choice;
            btn.classList.toggle("active", isSelected);
            btn.setAttribute("aria-pressed", String(isSelected));
        });

        if (mobileThemeName) {
            mobileThemeName.textContent = themeLabels[choice] || "System Theme";
        }
    }

    function applyTheme(choice, save) {
        if (!themeNames.includes(choice)) {
            choice = "system";
        }

        currentThemeChoice = choice;
        const actualTheme = resolveTheme(choice);

        document.documentElement.setAttribute("data-theme", actualTheme);
        document.body.setAttribute("data-theme", actualTheme);
        document.body.setAttribute("data-selected-theme", choice);

        updateThemeUI(choice);

        if (save) {
            try {
                localStorage.setItem("selectedTheme", choice);
                localStorage.setItem("arslanWeblabTheme", choice);
            } catch (error) {
                return;
            }
        }

        document.dispatchEvent(
            new CustomEvent("themeChanged", {
                detail: { theme: actualTheme, preference: choice }
            })
        );
    }

    const handleSystemChange = function () {
        if (currentThemeChoice === "system") {
            applyTheme("system", false);
        }
    };

    if (typeof systemPreference.addEventListener === "function") {
        systemPreference.addEventListener("change", handleSystemChange);
    } else if (typeof systemPreference.addListener === "function") {
        systemPreference.addListener(handleSystemChange);
    }

    function setDropdown(btn, panel, open) {
        if (!panel) return;
        panel.hidden = !open;
        if (btn) {
            btn.setAttribute("aria-expanded", String(open));
        }
    }

    function closeDesktopTheme() {
        setDropdown(themeToggleBtn, themeOptions, false);
    }

    function closeMobileTheme() {
        setDropdown(mobileThemeButton, mobileThemeOptions, false);
    }

    function closeMoreMenu() {
        if (moreMenu) {
            moreMenu.classList.remove("open");
        }
        if (moreButton) {
            moreButton.classList.remove("open");
            moreButton.setAttribute("aria-expanded", "false");
        }
    }

    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove("active");
        }
        if (mobileMenuButton) {
            mobileMenuButton.classList.remove("active");
            mobileMenuButton.setAttribute("aria-expanded", "false");
            mobileMenuButton.setAttribute("aria-label", "Open navigation menu");
        }
        closeMobileTheme();
        document.body.classList.remove("menu-open");
    }

    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuButton) return;
        closeDesktopTheme();
        closeMoreMenu();

        mobileMenu.classList.add("active");
        mobileMenuButton.classList.add("active");
        mobileMenuButton.setAttribute("aria-expanded", "true");
        mobileMenuButton.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
    }

    function toggleMobileMenu() {
        if (!mobileMenu || !mobileMenuButton) return;
        const isOpen = mobileMenu.classList.contains("active");
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function closeAllMenus() {
        closeDesktopTheme();
        closeMobileTheme();
        closeMoreMenu();
        closeMobileMenu();
    }

    if (themeToggleBtn && themeOptions) {
        themeToggleBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const shouldOpen = themeOptions.hidden;
            closeMoreMenu();
            setDropdown(themeToggleBtn, themeOptions, shouldOpen);
        });
    }

    if (mobileThemeButton && mobileThemeOptions) {
        mobileThemeButton.addEventListener("click", function (event) {
            event.stopPropagation();
            const shouldOpen = mobileThemeOptions.hidden;
            setDropdown(mobileThemeButton, mobileThemeOptions, shouldOpen);
        });
    }

    $$("[data-theme-option]").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            const selectedTheme = button.dataset.themeOption;
            if (themeNames.includes(selectedTheme)) {
                applyTheme(selectedTheme, true);
                closeDesktopTheme();
                closeMobileTheme();
            }
        });
    });

    if (moreButton && moreMenu) {
        moreButton.addEventListener("click", function (event) {
            event.stopPropagation();
            const shouldOpen = !moreMenu.classList.contains("open");
            closeDesktopTheme();

            if (shouldOpen) {
                moreMenu.classList.add("open");
                moreButton.classList.add("open");
                moreButton.setAttribute("aria-expanded", "true");
            } else {
                closeMoreMenu();
            }
        });
    }

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleMobileMenu();
        });
    }

    $$(".mobile-menu a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeMobileMenu();
        });
    });

    document.addEventListener("click", function (event) {
        const target = event.target;

        if (themeOptions && !themeOptions.hidden && themeToggleBtn) {
            if (!themeOptions.contains(target) && !themeToggleBtn.contains(target)) {
                closeDesktopTheme();
            }
        }

        if (moreMenu && moreMenu.classList.contains("open") && moreButton) {
            if (!moreMenu.contains(target) && !moreButton.contains(target)) {
                closeMoreMenu();
            }
        }

        if (mobileThemeOptions && !mobileThemeOptions.hidden && mobileThemeButton) {
            if (!mobileThemeOptions.contains(target) && !mobileThemeButton.contains(target)) {
                closeMobileTheme();
            }
        }

        if (mobileMenu && mobileMenu.classList.contains("active") && mobileMenuButton) {
            if (!mobileMenu.contains(target) && !mobileMenuButton.contains(target)) {
                closeMobileMenu();
            }
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeAllMenus();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
    });

    function setActiveNavigation() {
        const loc = window.location || { pathname: "index.html" };
        const path = (loc.pathname || "index.html").replace(/\/+$/, "");
        const currentPage = path.split("/").pop() || "index.html";

        $$(".nav-link, .mobile-nav-link").forEach(function (link) {
            const href = link.getAttribute("href");
            if (!href) return;

            const linkClean = href.split("#")[0].split("?")[0];
            const linkFile = linkClean.split("/").pop();
            const isMatch = linkFile === currentPage && !href.includes("#");
            link.classList.toggle("active", isMatch);
        });
    }

    function handleScroll() {
        if (!siteHeader) return;
        siteHeader.classList.toggle("scrolled", window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    const heroCard = $(".hero-card");
    const heroVisual = $(".hero-visual");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (heroCard && heroVisual && !prefersReducedMotion) {
        heroVisual.addEventListener("mousemove", function (event) {
            const rect = heroVisual.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = (x / rect.width - 0.5) * 10;
            const rotateX = (y / rect.height - 0.5) * -10;

            heroCard.style.transform =
                "perspective(1000px) rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg)";
        });

        heroVisual.addEventListener("mouseleave", function () {
            heroCard.style.transform = "perspective(1000px) rotateY(-8deg) rotateX(3deg)";
        });
    }


    applyTheme(currentThemeChoice, false);
    setActiveNavigation();
    handleScroll();
});
