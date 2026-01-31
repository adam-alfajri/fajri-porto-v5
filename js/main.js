(function () {
  if (!window.gsap) {
    console.warn("GSAP not found — animations disabled.");
  } else {
    gsap.registerPlugin && gsap.registerPlugin(ScrollTrigger);
  }

  // Reduced motion detection
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // safe storage helpers (use window.safe* if available)
  function getSavedTheme() {
    if (window.safeGetItem) return window.safeGetItem("theme");
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }
  function setSavedTheme(val) {
    if (window.safeSetItem) return window.safeSetItem("theme", val);
    try {
      localStorage.setItem("theme", val);
    } catch (e) {}
  }

  // helper: disable CSS transitions briefly to ensure instant theme switch
  function flashDisableTransitions() {
    document.documentElement.classList.add("no-transition");
    requestAnimationFrame(() => {
      setTimeout(
        () => document.documentElement.classList.remove("no-transition"),
        50,
      );
    });
  }

  // THEME: persist to localStorage + animated toggle
  (function initThemeToggle() {
    const themeBtn = document.getElementById("themeToggle");
    if (!themeBtn) return;

    const body = document.body;
    const saved = getSavedTheme();
    if (saved === "dark") body.classList.add("dark-mode");
    else if (saved === "light") body.classList.remove("dark-mode");

    // icon elements
    const sun = document.querySelector(".theme-svg .sun");
    const moon = document.querySelector(".theme-svg .moon");
    const cloud = document.querySelector(".theme-svg .cloud");

    // build timeline if GSAP exists
    let tl = null;
    if (window.gsap && !reduceMotion) {
      tl = gsap.timeline({ paused: true });
      tl.to(
        sun,
        { y: 10, opacity: 0, scale: 0.85, duration: 0.6, ease: "power2.in" },
        0,
      );
      tl.to(
        moon,
        { y: -8, opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" },
        0.08,
      );
      tl.fromTo(
        cloud,
        { y: 6 },
        { y: 0, duration: 0.6, ease: "power2.out" },
        0,
      );
    }

    function applyInitialState() {
      const isDark = body.classList.contains("dark-mode");
      themeBtn.setAttribute("aria-pressed", String(!!isDark));
      if (tl) {
        if (isDark) tl.progress(1).pause();
        else tl.progress(0).pause();
      } else {
        if (sun) {
          sun.style.opacity = isDark ? 0 : 1;
          sun.style.transform = isDark
            ? "translateY(10px) scale(.85)"
            : "translateY(0) scale(1)";
        }
        if (moon) {
          moon.style.opacity = isDark ? 1 : 0;
          moon.style.transform = isDark
            ? "translateY(-8px) scale(1)"
            : "translateY(8px) scale(.9)";
        }
      }
    }
    applyInitialState();

    function toggleTheme(animated = true) {
      const willDark = !body.classList.contains("dark-mode");

      // ensure instant color application (avoid perceived delay)
      flashDisableTransitions();

      body.classList.toggle("dark-mode", willDark);
      themeBtn.setAttribute("aria-pressed", String(!!willDark));
      setSavedTheme(willDark ? "dark" : "light");

      if (!animated || reduceMotion || !tl) {
        applyInitialState();
        return;
      }

      if (willDark) tl.play();
      else tl.reverse();
    }

    themeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleTheme(true);
    });
    themeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTheme(true);
      }
    });

    // mark that main handler installed (so fallback won't duplicate)
    themeBtn.dataset.handled = "true";
  })();

  // ... (Bagian atas kode lu sampai baris 108 yang ada themeBtn.dataset.handled = "true")

  // mark that main handler installed (so fallback won't duplicate)
  themeBtn.dataset.handled = "true";
})();

// --- START: TAMBAHAN UNTUK HERO FOLKLORE ---
(function initHeroFolklore() {
  if (!window.gsap || reduceMotion) return;

  // 1. Animasi Ghost Text (Tradition/Algorithm) pas scroll
  gsap.to(".ghost-text", {
    xPercent: (i) => (i % 2 === 0 ? -20 : 20),
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // 2. Reveal Title dari bawah dengan gaya "Stagger"
  gsap.from(".hero-title", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "expo.out",
    delay: 2.2, // Nunggu preloader kelar (biasanya sekitar 2s)
  });

  // 3. Reveal khusus untuk teks "Folklorist" (Aksen Serif)
  gsap.from(".accent-serif", {
    opacity: 0,
    duration: 2,
    delay: 2.8,
    ease: "power2.out",
  });
})();
// --- END: TAMBAHAN UNTUK HERO FOLKLORE ---

// TIME DISPLAY
function updateTime() {
  const el = document.getElementById("timeDisplay");
  if (!el) return;
  el.innerText =
    new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Jakarta",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
}
setInterval(updateTime, 1000);
updateTime();

// LENIS (smooth scroll) - expose to window
if (window.Lenis) {
  window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
} else {
  console.warn("Lenis not found — smooth scrolling disabled.");
}

// PROFILE TEXT & SKETCH animations (respect reduced-motion)
const textElement = document.getElementById("profileText");
if (textElement) {
  textElement.innerHTML = textElement.innerText
    .split(" ")
    .map((word) => `<span class="word">${word}</span>`)
    .join(" ");
  if (window.gsap && !reduceMotion) {
    gsap.to(".word", {
      opacity: 1,
      color: "var(--text-color)",
      stagger: 0.05,
      scrollTrigger: {
        trigger: ".profile-section",
        start: "top 60%",
        end: "bottom 60%",
        scrub: 0.5,
      },
    });
  } else {
    document.querySelectorAll(".word").forEach((w) => (w.style.opacity = 1));
  }
}

if (window.gsap && !reduceMotion) {
  gsap.to(".fade-in-trigger", {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: { trigger: ".profile-section", start: "top 70%" },
  });
} else {
  document.querySelectorAll(".fade-in-trigger").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
  });
}

// SKILLS SCROLL
const skillsTrack = document.querySelector(".skills-track");
if (skillsTrack && window.gsap && !reduceMotion) {
  let getScrollAmount = () =>
    -(skillsTrack.scrollWidth - window.innerWidth + 100);
  gsap.to(skillsTrack, {
    x: getScrollAmount,
    ease: "none",
    scrollTrigger: {
      trigger: ".skills-section",
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onEnter: () => document.body.classList.add("tech-visible"),
      onLeave: () => document.body.classList.remove("tech-visible"),
      onEnterBack: () => document.body.classList.add("tech-visible"),
      onLeaveBack: () => document.body.classList.remove("tech-visible"),
    },
  });
}

if (window.gsap) {
  ScrollTrigger.create({
    trigger: ".footer-section",
    start: "top 10%",
    onEnter: () => document.body.classList.add("footer-visible"),
    onLeaveBack: () => document.body.classList.remove("footer-visible"),
  });
}

// Cursor activation
const supportsFinePointer =
  window.matchMedia && window.matchMedia("(pointer: fine)").matches;
const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (supportsFinePointer && !isTouch) {
  document.body.classList.add("custom-cursor-active");
}

const cursorDot = document.querySelector(".cursor-dot");
const cursorCircle = document.querySelector(".cursor-circle");
if (cursorDot && cursorCircle && window.gsap) {
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.08 });
    gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.3 });
  });
  document
    .querySelectorAll(
      ".hover-trigger, a, .card, .close-btn, .footer-links a, .scroll-top, .skill-card, .theme-btn",
    )
    .forEach((item) => {
      item.addEventListener("mouseenter", () =>
        cursorCircle.classList.add("active-cursor"),
      );
      item.addEventListener("mouseleave", () =>
        cursorCircle.classList.remove("active-cursor"),
      );
    });
}

// expose projectData
if (typeof projectData !== "undefined") window.projectData = projectData;

// global ESC handler
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const menuBtn = document.getElementById("menuBtn");
    const menuOverlay = document.getElementById("menuOverlay");
    if (menuOverlay && menuOverlay.classList.contains("open") && menuBtn) {
      menuBtn.click();
    }
    const sheet = document.getElementById("contentSheet");
    if (sheet && sheet.classList.contains("active")) {
      const closeBtn = document.getElementById("closeBtn");
      if (closeBtn) closeBtn.click();
    }
  }
});
