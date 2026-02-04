/**
 * Technical Grimoire Interactivity
 * Handles skill card animations, progress bars, and interactive effects
 */
(function () {
  // Configuration constants
  const SCROLLTRIGGER_REFRESH_DELAY = 100; // ms to wait for layout completion before refresh
  
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

    // Add entrance animations
    addEntranceAnimations();
  }

  /**
   * Initialize progress bar animations
   */
  function initProgressBars(skillCards) {
    skillCards.forEach((card, index) => {
      const progressValue = parseInt(card.dataset.progress || "0", 10);
      
      // Validate progress value
      if (progressValue < 0 || progressValue > 100) {
        console.warn(`Invalid progress value ${progressValue} for skill card. Expected 0-100.`);
      }
      
      const progressFill = card.querySelector(".skill-progress-fill");

      if (!progressFill) return;

      if (window.gsap && window.ScrollTrigger && !reduceMotion) {
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
            onEnter: () => {
              // Ensure card is visible when animation triggers
              gsap.set(card, { opacity: 1 });
            },
          },
        });
      } else {
        // Fallback for reduced motion or no GSAP
        progressFill.style.width = `${progressValue}%`;
      }
    });
    
    // Refresh ScrollTrigger after layout is complete
    if (window.ScrollTrigger) {
      setTimeout(() => {
        window.ScrollTrigger.refresh();
      }, SCROLLTRIGGER_REFRESH_DELAY);
    }
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
          // Store original text on first setup
          const mastery = card.querySelector(".skill-mastery");
          if (mastery && !mastery.dataset.originalText) {
            mastery.dataset.originalText = mastery.textContent;
          }

          card.addEventListener("mouseenter", function () {
            const mastery = this.querySelector(".skill-mastery");
            if (mastery) {
              mastery.textContent = "Click to View Demo";
            }
          });

          card.addEventListener("mouseleave", function () {
            const mastery = this.querySelector(".skill-mastery");
            if (mastery && mastery.dataset.originalText) {
              mastery.textContent = mastery.dataset.originalText;
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
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    const skillCards = document.querySelectorAll(".skill-card");
    
    // Set initial opacity to 1 in CSS, then animate from transformed state
    skillCards.forEach(card => {
      gsap.set(card, { opacity: 1 }); // Ensure baseline visibility
    });

    gsap.from(skillCards, {
      y: 30,
      scale: 0.95, // Subtle scale prevents card shrinking that could affect visibility
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".skills-section",
        start: "top 70%",
        once: true,
        onRefresh: () => {
          // Ensure cards are visible during refresh
          skillCards.forEach(card => {
            gsap.set(card, { opacity: 1 });
          });
        },
      },
    });
    
    // Refresh ScrollTrigger after setup
    setTimeout(() => {
      window.ScrollTrigger.refresh();
    }, SCROLLTRIGGER_REFRESH_DELAY);
  }
})();
