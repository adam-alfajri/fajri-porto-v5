(function () {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preloaderEl = document.querySelector(".preloader");

  if (reduceMotion) {
    if (preloaderEl) {
      preloaderEl.style.display = "none";
      preloaderEl.setAttribute("aria-hidden", "true");
    }
    return;
  }

  if (!window.gsap) {
    // If GSAP not available, hide preloader gracefully
    if (preloaderEl) {
      preloaderEl.style.display = "none";
      preloaderEl.setAttribute("aria-hidden", "true");
    }
    return;
  }

  gsap.set(".mini-card", { x: 200, y: -400, rotation: 90, opacity: 0 });
  gsap.set(".loader-ui", { opacity: 0 });

  const tlLoader = gsap.timeline();
  tlLoader
    .to(".loader-ui", { opacity: 0.6, duration: 0.5, stagger: 0.1 })
    .to(
      ".mini-card",
      {
        x: 0,
        y: 0,
        rotation: (i) => Math.random() * 10 - 5,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
      },
      "-=0.3",
    )
    .to(
      ".loading-bar",
      {
        width: "100%",
        duration: 1,
        ease: "power2.inOut",
        onStart: () => {
          const statusText = document.getElementById("loaderStatus");
          setTimeout(() => (statusText.innerText = "LOADING ASSETS..."), 300);
          setTimeout(() => (statusText.innerText = "COMPILING..."), 700);
          setTimeout(() => (statusText.innerText = "SYSTEM READY."), 1000);
        },
      },
      "-=1",
    )
    .to(".mini-card", {
      x: () => (Math.random() - 0.5) * 2000,
      y: () => (Math.random() - 0.5) * 1500,
      rotation: () => Math.random() * 720 - 360,
      opacity: 0,
      scale: 1.5,
      duration: 1.5,
      stagger: 0.05,
      ease: "power3.inOut",
    })
    .to(".loader-ui, .loading-bar-wrapper", { opacity: 0, duration: 0.5 }, "<")
    .to(
      ".preloader",
      {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          if (preloaderEl) {
            preloaderEl.style.display = "none";
            preloaderEl.setAttribute("aria-hidden", "true");
          }
        },
      },
      "-=1.2",
    );
})();
