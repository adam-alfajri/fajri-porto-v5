/**
 * Technical Grimoire Interactivity
 * Handles skill card animations, progress bars, and interactive effects
 */
(function () {
  // Detect reduced motion preference
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGrimoire);
  } else {
    initGrimoire();
  }

  function initGrimoire() {
    const skillCards = document.querySelectorAll(".skill-card");

    if (!skillCards.length) {
      console.warn("No skill cards found");
      return;
    }

    // Initialize progress bars with GSAP animations
    initProgressBars(skillCards);

    // Add interactive hover effects
    addInteractiveEffects(skillCards);

    // Handle optional demo links
    handleDemoLinks(skillCards);
  }

  /**
   * Initialize progress bar animations
   */
  function initProgressBars(skillCards) {
    skillCards.forEach((card, index) => {
      const progressValue = parseInt(card.dataset.progress || "0", 10);
      const progressFill = card.querySelector(".skill-progress-fill");

      if (!progressFill) return;

      if (window.gsap && !reduceMotion) {
        // Use GSAP for smooth, staggered animations
        gsap.to(progressFill, {
          width: `${progressValue}%`,
          duration: 1.5,
          ease: "power3.out",
          delay: index * 0.1, // Stagger effect
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true,
          },
        });
      } else {
        // Fallback for reduced motion or no GSAP
        progressFill.style.width = `${progressValue}%`;
      }
    });
  }

  /**
   * Add interactive hover effects
   */
  function addInteractiveEffects(skillCards) {
    if (reduceMotion) return; // Skip animations if user prefers reduced motion

    skillCards.forEach((card) => {
      // Add spell-like glow on hover
      card.addEventListener("mouseenter", function () {
        if (window.gsap) {
          gsap.to(this, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });

      card.addEventListener("mouseleave", function () {
        if (window.gsap) {
          gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });

      // Add floating animation on hover
      card.addEventListener("mouseenter", function () {
        const icon = this.querySelector(".skill-top-icon");
        if (icon && window.gsap) {
          gsap.to(icon, {
            y: -5,
            duration: 0.6,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      });

      card.addEventListener("mouseleave", function () {
        const icon = this.querySelector(".skill-top-icon");
        if (icon && window.gsap) {
          gsap.killTweensOf(icon);
          gsap.to(icon, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
    });
  }

  /**
   * Handle demo link interactions
   */
  function handleDemoLinks(skillCards) {
    skillCards.forEach((card) => {
      const demoUrl = card.dataset.demo;

      // Only add click handler if demo URL is valid (not just '#')
      if (demoUrl && demoUrl !== "#") {
        card.style.cursor = "pointer";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        card.addEventListener("click", function (e) {
          e.preventDefault();
          window.open(demoUrl, "_blank", "noopener,noreferrer");
        });

        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            window.open(demoUrl, "_blank", "noopener,noreferrer");
          }
        });

        // Visual indicator for clickable cards
        if (!reduceMotion) {
          card.addEventListener("mouseenter", function () {
            const mastery = this.querySelector(".skill-mastery");
            if (mastery) {
              mastery.textContent = mastery.textContent.replace(
                "Mastery",
                "Click to View Demo",
              );
            }
          });

          card.addEventListener("mouseleave", function () {
            const mastery = this.querySelector(".skill-mastery");
            if (mastery) {
              const progress = this.dataset.progress;
              mastery.textContent = `${progress}% Mastery`;
            }
          });
        }
      }
    });
  }

  /**
   * Add entrance animations for skill cards (optional enhancement)
   */
  function addEntranceAnimations() {
    if (reduceMotion || !window.gsap) return;

    const skillCards = document.querySelectorAll(".skill-card");

    gsap.from(skillCards, {
      opacity: 0,
      y: 30,
      scale: 0.9,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".skills-section",
        start: "top 70%",
        once: true,
      },
    });
  }

  // Call entrance animations
  addEntranceAnimations();
})();
