/**
 * Technical Grimoire Interactivity - Archery Skill Shots
 * Handles skill card animations with archery theme, progress bars, and interactive effects
 * Features: Archer character, arrow shooting, target animations, and dynamic grid formation
 */
(function () {
  // Configuration constants
  const SCROLLTRIGGER_REFRESH_DELAY = 100; // ms to wait for layout completion before refresh
  const ARROW_SHOOT_DELAY = 0.5; // seconds between each arrow shot
  const ARROW_FLIGHT_DURATION = 0.8; // seconds for arrow to reach target
  
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

    // Add archery skill shots feature
    initArcheryAnimation(skillCards);

    // Add dynamic heading transition
    addHeadingTransition();

    // Add entrance animations (kept for compatibility)
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

  /**
   * Initialize archery animation system
   * Creates archer character, manages targets, shoots arrows, and forms grid
   */
  function initArcheryAnimation(skillCards) {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
      // Fallback: simple fade-in for skill cards
      skillCards.forEach(card => {
        gsap.set(card, { opacity: 1 });
      });
      return;
    }

    const skillsSection = document.querySelector(".skills-section");
    if (!skillsSection) return;

    // Create archer container
    const archerContainer = createArcherCharacter(skillsSection);

    // Phase 1: Scatter targets randomly with subtle animations
    scatterTargets(skillCards);

    // Phase 2: Show archer and shoot arrows at targets
    shootArrowsAtTargets(skillCards, archerContainer);

    // Phase 3: Form grid layout as user scrolls further
    formGridLayout(skillCards, archerContainer);
  }

  /**
   * Create and add archer character to the skills section
   */
  function createArcherCharacter(container) {
    const archerContainer = document.createElement('div');
    archerContainer.className = 'archer-container';
    archerContainer.innerHTML = `
      <svg width="120" height="180" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="archer">
          <ellipse cx="60" cy="110" rx="18" ry="28" fill="currentColor" opacity="0.9"/>
          <circle cx="60" cy="70" r="16" fill="currentColor"/>
          <path d="M 35 85 Q 30 105 35 125" stroke="var(--sage)" stroke-width="3" fill="none" stroke-linecap="round"/>
          <line x1="35" y1="85" x2="35" y2="125" stroke="var(--sage)" stroke-width="1.5" opacity="0.7"/>
          <path d="M 60 95 L 40 100" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
          <path d="M 60 95 L 50 110" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
          <path d="M 60 135 L 55 160" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
          <path d="M 60 135 L 65 160" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
          <path d="M 50 65 Q 60 60 70 65" stroke="var(--sage)" stroke-width="2" fill="none" opacity="0.6"/>
        </g>
      </svg>
    `;
    
    container.appendChild(archerContainer);
    return archerContainer;
  }

  /**
   * Scatter skill cards randomly as targets
   */
  function scatterTargets(skillCards) {
    const skillsSection = document.querySelector(".skills-section");
    
    skillCards.forEach((card, index) => {
      // Add target marker classes
      card.classList.add('target-active');
      
      // Create hit effect element
      const hitEffect = document.createElement('div');
      hitEffect.className = 'hit-effect';
      card.appendChild(hitEffect);
      
      // Random scattered positions
      const randomX = (Math.random() - 0.5) * 300;
      const randomY = -200 - Math.random() * 150;
      const randomRotation = (Math.random() - 0.5) * 20;
      
      // Set initial scattered state
      gsap.set(card, {
        x: randomX,
        y: randomY,
        rotation: randomRotation,
        opacity: 0,
        scale: 0.8
      });
      
      // Animate targets falling in
      gsap.to(card, {
        y: 0,
        x: randomX * 0.3, // Reduced scatter for better visibility
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        delay: index * 0.15,
        scrollTrigger: {
          trigger: skillsSection,
          start: "top 80%",
          once: true
        }
      });
      
      // Add subtle bouncing animation to targets
      gsap.to(card, {
        y: "+=10",
        duration: 2 + Math.random(),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: skillsSection,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play pause resume pause"
        }
      });
    });
  }

  /**
   * Shoot arrows at skill card targets with animation
   */
  function shootArrowsAtTargets(skillCards, archerContainer) {
    const skillsSection = document.querySelector(".skills-section");
    
    // Show archer when scrolling into view
    gsap.to(archerContainer, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: skillsSection,
        start: "top 70%",
        once: true
      }
    });
    
    // Shoot arrows at each target
    skillCards.forEach((card, index) => {
      const shootDelay = 1 + index * ARROW_SHOOT_DELAY;
      
      ScrollTrigger.create({
        trigger: skillsSection,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.delayedCall(shootDelay, () => {
            shootArrowAtTarget(archerContainer, card, skillsSection);
          });
        }
      });
    });
  }

  /**
   * Shoot a single arrow from archer to target
   */
  function shootArrowAtTarget(archer, target, container) {
    if (reduceMotion) return;
    
    // Add shooting animation to archer
    archer.classList.add('shooting');
    setTimeout(() => archer.classList.remove('shooting'), 600);
    
    // Create arrow element
    const arrow = document.createElement('div');
    arrow.className = 'arrow-projectile flying';
    arrow.innerHTML = `
      <svg width="60" height="8" viewBox="0 0 60 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="4" x2="52" y2="4" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 52 4 L 60 4 L 56 1 M 60 4 L 56 7" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M 5 2 L 0 4 L 5 6" fill="var(--sage)" opacity="0.8"/>
      </svg>
    `;
    
    container.appendChild(arrow);
    
    // Get positions
    const archerRect = archer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate start and end positions
    const startX = archerRect.right - containerRect.left;
    const startY = archerRect.top + archerRect.height / 2 - containerRect.top;
    const endX = targetRect.left + targetRect.width / 2 - containerRect.left;
    const endY = targetRect.top + targetRect.height / 2 - containerRect.top;
    
    // Calculate angle for arrow rotation
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    
    // Set initial position
    gsap.set(arrow, {
      left: startX,
      top: startY,
      rotation: angle
    });
    
    // Animate arrow with curved path
    gsap.to(arrow, {
      left: endX,
      top: endY,
      duration: ARROW_FLIGHT_DURATION,
      ease: "power2.out",
      onComplete: () => {
        // Hit effect
        hitTarget(target);
        arrow.remove();
      }
    });
    
    // Add slight curve to arrow path (y-axis adjustment)
    const curveHeight = -30;
    gsap.to(arrow, {
      top: `+=${curveHeight}`,
      duration: ARROW_FLIGHT_DURATION / 2,
      ease: "power1.out",
      yoyo: true,
      repeat: 1
    });
  }

  /**
   * Apply hit effect to target
   */
  function hitTarget(target) {
    // Add hit class for visual feedback
    target.classList.add('hit');
    
    // Trigger hit effect animation
    const hitEffect = target.querySelector('.hit-effect');
    if (hitEffect) {
      hitEffect.classList.add('active');
      
      // Remove effect classes after animation
      setTimeout(() => {
        hitEffect.classList.remove('active');
        target.classList.remove('hit');
      }, 800);
    }
    
    // Remove target marker after hit
    setTimeout(() => {
      target.classList.remove('target-active');
    }, 500);
  }

  /**
   * Form grid layout as user scrolls further down
   */
  function formGridLayout(skillCards, archerContainer) {
    const skillsSection = document.querySelector(".skills-section");
    
    // Create timeline for grid formation
    const gridTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: skillsSection,
        start: "top 30%",
        end: "top top",
        scrub: 1
      }
    });
    
    // Fade out archer
    gridTimeline.to(archerContainer, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    }, 0);
    
    // Move cards to grid positions
    skillCards.forEach((card, index) => {
      card.classList.add('grid-forming');
      
      gridTimeline.to(card, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1,
        ease: "power2.inOut"
      }, 0.2);
    });
    
    // Refresh ScrollTrigger
    setTimeout(() => {
      window.ScrollTrigger.refresh();
    }, SCROLLTRIGGER_REFRESH_DELAY);
  }

  /**
   * Add dynamic heading transition - moves to center as user scrolls
   */
  function addHeadingTransition() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    const skillsHeader = document.querySelector(".skills-header");
    if (!skillsHeader) return;

    // Animate heading with fade and subtle movement
    gsap.to(skillsHeader, {
      y: 50,
      opacity: 0.3,
      scrollTrigger: {
        trigger: ".skills-section",
        start: "top top",
        end: "top -20%",
        scrub: 2,
        pin: false,
      },
    });

    // Refresh ScrollTrigger
    setTimeout(() => {
      window.ScrollTrigger.refresh();
    }, SCROLLTRIGGER_REFRESH_DELAY);
  }
})();
