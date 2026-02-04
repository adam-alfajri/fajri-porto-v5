// certificates.js (GSAP-enhanced, weak/elegant transitions)
// Interaction: hover/focus/click list -> show corresponding image in preview
(function () {
  const list = document.getElementById("certList");
  const imagesContainer = document.querySelector(".cert-images");
  const preview = document.querySelector(".cert-preview");
  if (!list || !imagesContainer || !preview) return;

  const items = Array.from(list.querySelectorAll(".cert-item"));
  const images = Array.from(imagesContainer.querySelectorAll(".cert-image"));
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let persistedId = null; // id of clicked/selected item
  let currentId = null;
  let animating = false;

  // ensure caption element exists
  let captionEl = document.querySelector(".cert-caption");
  if (!captionEl) {
    captionEl = document.createElement("div");
    captionEl.className = "cert-caption";
    const title = document.createElement("div");
    title.className = "caption-title";
    captionEl.appendChild(title);
    preview.appendChild(captionEl);
  }
  const captionTitleEl = captionEl.querySelector(".caption-title");

  // utils
  function updateCaption(text) {
    if (!captionTitleEl) return;
    captionTitleEl.textContent = text || "";
  }

  function findImageById(id) {
    return images.find((img) => img.dataset.id === id) || null;
  }

  function setAriaHidden() {
    images.forEach((img) => {
      const isActive = img.classList.contains("active");
      img.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  }

  // GSAP-based crossfade (subtle)
  function animateSwitch(nextImgEl, immediate = false) {
    if (!nextImgEl) return;
    const prevImgEl =
      images.find((i) => i.classList.contains("active")) || null;
    if (prevImgEl === nextImgEl && !immediate) return;
    currentId = nextImgEl.dataset.id;

    // if no GSAP or reduced-motion -> immediate swap
    if (prefersReduced || typeof gsap === "undefined") {
      images.forEach((img) =>
        img.classList.toggle("active", img === nextImgEl),
      );
      // update inline styles for compatibility
      images.forEach((img) => {
        img.style.opacity = img === nextImgEl ? "1" : "0";
        img.style.transform = "scale(1)";
      });
      updateCaptionFromId(currentId);
      setAriaHidden();
      return;
    }

    // kill any running tweens on images to avoid stacking
    gsap.killTweensOf(images);

    const tl = gsap.timeline({
      defaults: { duration: 0.48, ease: "power2.out", overwrite: true },
      onStart: () => (animating = true),
      onComplete: () => {
        images.forEach((img) =>
          img.classList.toggle("active", img === nextImgEl),
        );
        setAriaHidden();
        animating = false;
      },
    });

    // fade out prev slightly and nudge it
    if (prevImgEl && prevImgEl !== nextImgEl) {
      tl.to(
        prevImgEl,
        {
          opacity: 0,
          scale: 1.03,
          y: 6,
          duration: 0.42,
          ease: "power2.in",
        },
        0,
      );
    }

    // bring next image up with dynamic sizing
    // set starting state quickly to avoid flicker
    gsap.set(nextImgEl, { opacity: 0, scale: 1.02, y: -6 });
    tl.to(
      nextImgEl,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      },
      prevImgEl ? 0.08 : 0,
    );

    // caption animation (small slide/fade)
    if (captionTitleEl) {
      gsap.killTweensOf(captionTitleEl);
      gsap.fromTo(
        captionTitleEl,
        { y: 8, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.44,
          ease: "power2.out",
          overwrite: true,
          delay: 0.02,
        },
      );
    }

    // ensure at end we mark the active class (handled in onComplete)
    updateCaptionFromId(currentId);
  }

  function updateCaptionFromId(id) {
    const btn = items.find((b) => b.dataset.id === id);
    if (btn) updateCaption(btn.dataset.title || btn.textContent.trim());
    else updateCaption("");
  }

  // set active state in list UI
  function setActiveId(id, { persist = false, focus = false } = {}) {
    if (!id) return;
    items.forEach((btn) => {
      const is = btn.dataset.id === id;
      btn.classList.toggle("active", is);
      btn.setAttribute("aria-selected", is ? "true" : "false");
      if (is && focus) btn.focus();
      if (persist && is) btn.dataset.selected = "true";
      if (!persist && btn.dataset.selected) delete btn.dataset.selected;
    });

    if (persist) persistedId = id;
    if (!persist) persistedId = persistedId === id ? persistedId : persistedId;

    const nextImg = findImageById(id);
    if (nextImg) animateSwitch(nextImg);
  }

  function clearPersist() {
    persistedId = null;
    items.forEach((b) => delete b.dataset.selected);
  }

  // INITIALIZE: first item active
  const first = items[0];
  if (first) {
    setActiveId(first.dataset.id, { persist: false });
  }

  // HANDLERS
  items.forEach((btn) => {
    const id = btn.dataset.id;
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-selected", "false");

    btn.addEventListener("mouseenter", () => {
      // avoid hover on coarse pointers
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
        return;
      if (animating) return;
      setActiveId(id, { persist: false });
    });

    btn.addEventListener("focus", () => {
      if (animating) return;
      setActiveId(id, { persist: false });
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveId(id, { persist: true, focus: true });
    });
  });

  // keyboard navigation on the list container
  list.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const idx = items.indexOf(active);
    if (e.key === "ArrowDown" || e.key === "Down") {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      next.focus();
      setActiveId(next.dataset.id, { persist: false });
    } else if (e.key === "ArrowUp" || e.key === "Up") {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      prev.focus();
      setActiveId(prev.dataset.id, { persist: false });
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (active && active.classList.contains("cert-item")) {
        setActiveId(active.dataset.id, { persist: true });
      }
    }
  });

  // clicking preview background clears persisted selection (optional)
  preview.addEventListener("click", (e) => {
    if (
      e.target === preview ||
      e.target.classList.contains("cert-images") ||
      e.target.classList.contains("cert-preview")
    ) {
      clearPersist();
      const focused = document.activeElement;
      const fallback = items.find((b) => b === focused) || items[0];
      if (fallback) setActiveId(fallback.dataset.id, { persist: false });
    }
  });

  // when leaving list with mouse, restore persisted or first
  list.addEventListener("mouseleave", () => {
    if (persistedId) setActiveId(persistedId, { persist: true });
    else {
      const sel = items.find((b) => b.dataset.selected === "true") || items[0];
      if (sel) setActiveId(sel.dataset.id, { persist: false });
    }
  });

  // preload images to reduce flicker
  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      const pre = new Image();
      pre.src = src;
      // dynamically adjust image dimensions after load
      pre.onload = function () {
        const naturalWidth = pre.naturalWidth;
        const naturalHeight = pre.naturalHeight;
        const aspectRatio = naturalWidth / naturalHeight;
        
        // Adjust image container sizing dynamically with GSAP if available
        if (typeof gsap !== "undefined" && !prefersReduced) {
          gsap.set(img, {
            maxWidth: aspectRatio > 1.5 ? "100%" : "90%",
            maxHeight: aspectRatio < 1 ? "100%" : "90%",
          });
        }
      };
    }
  });

  // accessibility: when list receives focus, focus first/persisted
  list.addEventListener("focus", (e) => {
    const sel = items.find((b) => b.dataset.selected === "true") || items[0];
    if (sel) sel.focus();
  });

  // initial aria-hidden & styles
  images.forEach((img) => {
    const is = img.classList.contains("active");
    img.style.opacity = is ? "1" : "0";
    img.setAttribute("aria-hidden", is ? "false" : "true");
  });

  // Respect reduced-motion: if true, ensure CSS transitions are not conflicting
  if (prefersReduced) {
    document.documentElement.classList.add("no-transition");
    setTimeout(
      () => document.documentElement.classList.remove("no-transition"),
      50,
    );
  }
})();
