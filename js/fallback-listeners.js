// fallback-listeners.js (update) -- dipasang terakhir
(function () {
  try {
    const themeBtn = document.getElementById("themeToggle");
    const menuBtn = document.getElementById("menuBtn");
    const menuOverlay = document.getElementById("menuOverlay");

    // theme: hanya attach jika belum ada handler (hindari double-toggle)
    if (themeBtn && themeBtn.dataset.handled !== "true") {
      themeBtn.addEventListener("click", () => {
        document.documentElement.classList.add("no-transition");
        requestAnimationFrame(() => {
          setTimeout(
            () => document.documentElement.classList.remove("no-transition"),
            50,
          );
        });
        document.body.classList.toggle("dark-mode");
        themeBtn.setAttribute(
          "aria-pressed",
          String(document.body.classList.contains("dark-mode")),
        );
      });
      themeBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          themeBtn.click();
        }
      });
      themeBtn.dataset.handled = "fallback";
      console.log("fallback: theme listener attached");
    }

    // menu: hanya attach jika belum ada handler
    if (menuBtn && menuBtn.dataset.handled !== "true") {
      menuBtn.addEventListener("click", () => {
        const isOpen = !menuBtn.classList.contains("active");
        menuBtn.classList.toggle("active", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        if (menuOverlay) {
          menuOverlay.classList.toggle("open", isOpen);
          menuOverlay.setAttribute("aria-hidden", String(!isOpen));
        }
        document.body.classList.toggle("menu-open", isOpen);
      });
      menuBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          menuBtn.click();
        }
      });
      menuBtn.dataset.handled = "fallback";
      console.log("fallback: menu listener attached");
    }

    // fallback: close menu when clicking overlay background
    if (menuOverlay) {
      menuOverlay.addEventListener("click", (e) => {
        if (e.target === menuOverlay) {
          // close using the same DOM changes as fallback toggler
          const openBtns = document.querySelectorAll(".menu-btn");
          openBtns.forEach((b) => b.classList.remove("active"));
          menuOverlay.classList.remove("open");
          document.body.classList.remove("menu-open");
        }
      });
    }
  } catch (err) {
    console.warn("fallback-listeners error", err);
  }
})();
