(function () {
  const cards = document.querySelectorAll(".card");
  const sheet = document.getElementById("contentSheet");
  const sheetContent = document.getElementById("sheetContent");
  const sheetId = document.getElementById("sheetId");
  const closeBtn = document.getElementById("closeBtn");
  let isExpanded = false;
  let previousActiveElement = null;
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let screenWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    screenWidth = window.innerWidth;
    gsap.set(".card-1", { x: -screenWidth * 0.55 });
    gsap.set(".card-2", { x: screenWidth * 0.55 });
    gsap.set(".card-3", { x: screenWidth * 0.65 });
  });

  gsap &&
    gsap.set(".card-1", {
      x: -screenWidth * 0.55,
      y: 0,
      rotation: -45,
      scale: 0.9,
      opacity: 1,
    });
  gsap &&
    gsap.set(".card-2", {
      x: screenWidth * 0.55,
      y: -20,
      rotation: 60,
      scale: 0.9,
      opacity: 1,
    });
  gsap &&
    gsap.set(".card-3", {
      x: screenWidth * 0.65,
      y: 50,
      rotation: 30,
      scale: 0.9,
      opacity: 1,
    });
  gsap && gsap.set(".card-inner", { rotationY: 0 });

  if (!reduceMotion && window.gsap) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".projects-sticky-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        pin: ".cards-container",
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress > 0.9) {
            document.body.classList.add("footer-visible");
            document.body.classList.remove("tech-visible");
          } else {
            document.body.classList.remove("footer-visible");
          }
        },
      },
    });

    tl.to(".card", {
      x: (i) => Math.random() * 60 - 30,
      y: (i) => Math.random() * 60 - 30,
      z: (i) => i * 30,
      rotation: (i) => Math.random() * 20 - 10,
      scale: 1,
      duration: 2.5,
      ease: "sine.inOut",
      stagger: 0.1,
    })
      .to(
        ".card",
        {
          x: (i) => (i - 1) * 380,
          y: 0,
          rotation: 0,
          rotationX: 0,
          scale: 1.2,
          duration: 3,
          ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          stagger: 0.1,
        },
        "-=0.5",
      )
      .to(
        ".card-inner",
        { rotationY: 180, duration: 2.8, ease: "power2.inOut", stagger: 0.1 },
        "<",
      )
      .to({}, { duration: 2 });
  } else {
    // reduced-motion fallback: arrange cards statically
    cards.forEach((card, i) => {
      gsap &&
        gsap.set(card, { x: (i - 1) * 380, y: 0, rotation: 0, scale: 1.2 });
      gsap && gsap.set(card.querySelector(".card-inner"), { rotationY: 180 });
    });
  }

  // open card (click or keyboard)
  cards.forEach((card, index) => {
    function openCard() {
      if (isExpanded) return;
      isExpanded = true;
      previousActiveElement = document.activeElement;
      const id = card.getAttribute("data-id");
      const data = window.projectData ? window.projectData[id] : null;
      if (!data) {
        console.warn("projectData not found for id:", id);
        return;
      }

      cards.forEach((c) => c.setAttribute("aria-expanded", "false"));
      card.setAttribute("aria-expanded", "true");

      sheetId.innerText = data.id;
      sheetContent.innerHTML = `<h2 class="sheet-title">${data.title}</h2><p class="sheet-desc">${data.desc}</p><div class="sheet-tags">${data.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
      sheet.classList.add("active");
      sheet.setAttribute("aria-hidden", "false");

      gsap &&
        gsap.to(card, {
          x: -screenWidth * 0.25,
          y: 0,
          scale: 1.2,
          rotation: 0,
          zIndex: 100,
          duration: 1,
          ease: "power4.out",
        });

      const others = Array.from(cards).filter((c) => c !== card);
      others.forEach((other, i) => {
        const offsetX = -screenWidth * 0.25 + 30 + i * 20;
        const offsetY = 10 + i * 10;
        const rotate = 5 + i * 5;
        gsap &&
          gsap.to(other.querySelector(".card-inner"), {
            rotationY: 0,
            duration: 0.8,
            ease: "power2.inOut",
          });
        gsap &&
          gsap.to(other, {
            x: offsetX,
            y: offsetY,
            rotation: rotate,
            scale: 1.0,
            zIndex: 90 - i,
            duration: 1,
            ease: "power3.inOut",
          });
      });

      const l = window.lenis || null;
      if (l) l.stop();

      if (closeBtn) closeBtn.focus();
      document.addEventListener("keydown", trapFocus);
    }

    card.addEventListener("click", openCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCard();
      }
    });
  });

  function closeSheet() {
    if (!isExpanded) return;
    isExpanded = false;
    sheet.classList.remove("active");
    sheet.setAttribute("aria-hidden", "true");
    cards.forEach((c) => c.setAttribute("aria-expanded", "false"));

    const l = window.lenis || null;
    if (l) l.start();

    cards.forEach((card, index) => {
      gsap &&
        gsap.to(card, {
          scale: 1.2,
          zIndex: 1,
          x: (index - 1) * 380,
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      gsap &&
        gsap.to(card.querySelector(".card-inner"), {
          rotationY: 180,
          duration: 1,
          ease: "power2.out",
        });
    });

    document.removeEventListener("keydown", trapFocus);
    if (
      previousActiveElement &&
      typeof previousActiveElement.focus === "function"
    ) {
      previousActiveElement.focus();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSheet);
    closeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeSheet();
      }
    });
  }

  function trapFocus(e) {
    if (!isExpanded) return;
    if (e.key !== "Tab") return;
    e.preventDefault();
    if (closeBtn) closeBtn.focus();
  }
})();
