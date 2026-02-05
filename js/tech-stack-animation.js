/**
 * Technical Grimoire - Tech Stack Vertical Icons with Pen Animation
 * Handles vertical tech stack icons, scroll-based activation, and pen drawing animations
 */
(function () {
  // Configuration
  const ICON_ACTIVATION_DELAY = 0.3; // seconds between each icon activation
  const PEN_DRAW_DURATION = 1.2; // base duration for pen animation sequence (movement + drawing)
  
  // Detect reduced motion preference
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Wait for DOM and GSAP to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTechStack);
  } else {
    // Small delay to ensure GSAP plugins are loaded
    setTimeout(initTechStack, 100);
  }

  function initTechStack() {
    // Check if GSAP and required plugins are available
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("GSAP or ScrollTrigger not found - tech stack animations disabled");
      return;
    }

    // Check if MotionPathPlugin is available
    if (window.MotionPathPlugin) {
      gsap.registerPlugin(MotionPathPlugin);
    }

    const techStackSection = document.querySelector(".tech-stack-section");
    const techStackIcons = document.querySelectorAll(".tech-stack-icon");
    const penIcon = document.querySelector(".pen-icon");
    const skillsSection = document.querySelector(".skills-section");

    if (!techStackSection || !techStackIcons.length || !penIcon || !skillsSection) {
      console.warn("Required elements not found for tech stack animation");
      return;
    }

    // Initialize the animation sequence
    initLandingAnimation(techStackSection, skillsSection);
    initIconActivation(techStackIcons, penIcon, skillsSection);
    initHideOnScroll(techStackSection, skillsSection);
  }

  /**
   * Landing animation - fade in tech stack section
   */
  function initLandingAnimation(techStackSection, skillsSection) {
    if (reduceMotion) {
      techStackSection.classList.add("visible");
      return;
    }

    gsap.to(techStackSection, {
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: skillsSection,
        start: "top 60%",
        once: true,
        onEnter: () => {
          techStackSection.classList.add("visible");
        }
      }
    });
  }

  /**
   * Sequential icon activation with pen drawing
   */
  function initIconActivation(icons, penIcon, skillsSection) {
    if (reduceMotion) {
      // Just show all icons without animation
      icons.forEach(icon => icon.classList.add("active"));
      return;
    }

    // Create a timeline for sequential activation
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: skillsSection,
        start: "top 50%",
        once: true
      }
    });

    // Show pen first
    timeline.to(penIcon, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      onStart: () => {
        penIcon.classList.add("visible");
      }
    });

    // Activate each icon sequentially with pen animation
    icons.forEach((icon, index) => {
      timeline.add(() => {
        activateIconWithPen(icon, penIcon, index);
      }, `+=${ICON_ACTIVATION_DELAY}`);
    });

    // Hide pen after all icons are activated
    timeline.to(penIcon, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        penIcon.classList.remove("visible");
      }
    }, `+=${ICON_ACTIVATION_DELAY}`);
  }

  /**
   * Activate a single icon with pen drawing animation
   */
  function activateIconWithPen(icon, penIcon, index) {
    // Get icon position
    const iconRect = icon.getBoundingClientRect();
    const penRect = penIcon.getBoundingClientRect();
    
    // Calculate target position for pen (relative to current position)
    const deltaX = iconRect.left - penRect.left;
    const deltaY = iconRect.top - penRect.top;

    // Animate pen to icon position
    gsap.to(penIcon, {
      x: `+=${deltaX}`,
      y: `+=${deltaY}`,
      duration: PEN_DRAW_DURATION * 0.6,
      ease: "power2.inOut",
      onStart: () => {
        penIcon.classList.add("drawing");
      },
      onComplete: () => {
        // Draw random lines near the icon
        drawRandomLines(icon);
        
        // Activate the icon
        icon.classList.add("active");
        
        // Remove drawing class
        setTimeout(() => {
          penIcon.classList.remove("drawing");
        }, 300);
      }
    });
  }

  /**
   * Draw random connected lines near the activated icon
   */
  function drawRandomLines(icon) {
    const trailsGroup = document.querySelector(".pen-trails");
    if (!trailsGroup) return;

    const iconRect = icon.getBoundingClientRect();
    const numLines = 3 + Math.floor(Math.random() * 3); // 3-5 lines
    
    // Create random path starting from icon
    let pathData = `M ${iconRect.left + iconRect.width / 2} ${iconRect.top + iconRect.height / 2}`;
    
    for (let i = 0; i < numLines; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const length = 30 + Math.random() * 60;
      const endX = iconRect.left + iconRect.width / 2 + Math.cos(angle) * length;
      const endY = iconRect.top + iconRect.height / 2 + Math.sin(angle) * length;
      
      // Add curve for more organic feel
      const controlX = iconRect.left + iconRect.width / 2 + Math.cos(angle) * length * 0.5 + (Math.random() - 0.5) * 30;
      const controlY = iconRect.top + iconRect.height / 2 + Math.sin(angle) * length * 0.5 + (Math.random() - 0.5) * 30;
      
      pathData += ` Q ${controlX} ${controlY} ${endX} ${endY}`;
    }

    // Create SVG path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.classList.add("drawing");
    
    // Add to trails group
    trailsGroup.appendChild(path);

    // Animate path drawing
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: PEN_DRAW_DURATION * 0.4,
      ease: "power1.out"
    });

    // Fade out path after some time
    gsap.to(path, {
      opacity: 0,
      duration: 0.8,
      delay: 2,
      ease: "power2.in",
      onComplete: () => {
        path.remove();
      }
    });
  }

  /**
   * Hide tech stack section when scrolling past skills section
   */
  function initHideOnScroll(techStackSection, skillsSection) {
    if (reduceMotion) return;

    gsap.to(techStackSection, {
      opacity: 0,
      scrollTrigger: {
        trigger: skillsSection,
        start: "bottom 20%",
        end: "bottom top",
        scrub: 1,
        onLeave: () => {
          techStackSection.classList.remove("visible");
        },
        onEnterBack: () => {
          techStackSection.classList.add("visible");
        }
      }
    });
  }
})();
