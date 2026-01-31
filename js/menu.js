(function () {
  const menuBtn = document.getElementById("menuBtn");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuLinks = document.querySelectorAll(".menu-link");
  let isMenuOpen = false;

  function getLenis() {
    return window.lenis || null;
  }

  function openMenu() {
    isMenuOpen = true;
    document.body.classList.add("menu-open");
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    if (menuOverlay) {
      menuOverlay.classList.add("open");
      menuOverlay.setAttribute("aria-hidden", "false");
    }
    if (window.gsap) {
      gsap.fromTo(
        menuLinks,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.18,
        },
      );
    } else {
      // ensure links visible if GSAP absent
      menuLinks.forEach((l) => (l.style.opacity = 1));
    }

    const l = getLenis();
    if (l) l.stop();
    if (menuLinks && menuLinks.length) menuLinks[0].focus();
  }

  function closeMenu() {
    isMenuOpen = false;
    document.body.classList.remove("menu-open");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    if (menuOverlay) {
      menuOverlay.classList.remove("open");
      menuOverlay.setAttribute("aria-hidden", "true");
    }
    const l = getLenis();
    if (l) l.start();
    menuBtn && menuBtn.focus();
  }

  function toggleMenu() {
    if (isMenuOpen) closeMenu();
    else openMenu();
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMenu);
    menuBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
    // mark that main handler installed
    menuBtn.dataset.handled = "true";
  }

  // close when clicking outside (overlay background)
  if (menuOverlay) {
    menuOverlay.addEventListener("click", (e) => {
      // if clicked directly the overlay (not its inner links), close menu
      if (e.target === menuOverlay) {
        closeMenu();
      }
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      closeMenu();
      setTimeout(() => {
        const l = getLenis();
        if (l) l.scrollTo(targetId, { duration: 1.5 });
        else {
          const el = document.querySelector(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
    });
  });

  // basic focus trap for menu
  document.addEventListener("focusin", (e) => {
    if (!isMenuOpen) return;
    if (
      menuOverlay &&
      !menuOverlay.contains(e.target) &&
      e.target !== menuBtn
    ) {
      e.preventDefault();
      if (menuLinks && menuLinks.length) menuLinks[0].focus();
    }
  });
})();
