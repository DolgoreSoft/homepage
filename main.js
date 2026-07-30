const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const mobileNavQuery = window.matchMedia("(max-width: 720px)");

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const year = document.querySelector("#year");
const spot = document.querySelector("[data-spot]");
const hero = document.querySelector("[data-hero]");
const tiltEl = document.querySelector("[data-tilt]");
const phone = document.querySelector("[data-phone]");
const slides = [...document.querySelectorAll("[data-slide]")];
const dots = [...document.querySelectorAll("[data-dots] span")];
const swapItems = [...document.querySelectorAll("[data-swap] .hero__swap-item")];
const magneticBtns = [...document.querySelectorAll("[data-magnetic]")];

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const pageLang = document.documentElement.lang || "ko";
const labels =
  pageLang === "en"
    ? { open: "Open menu", close: "Close menu" }
    : { open: "메뉴 열기", close: "메뉴 닫기" };

const setNavOpen = (open) => {
  if (!toggle || !nav) return;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? labels.close : labels.open);
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("is-nav-open", open);
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });

  const onNavBreakpoint = (event) => {
    if (!event.matches) setNavOpen(false);
  };

  if (mobileNavQuery.addEventListener) {
    mobileNavQuery.addEventListener("change", onNavBreakpoint);
  } else {
    mobileNavQuery.addListener(onNavBreakpoint);
  }
}

/* Pointer spotlight — desktop pointers only */
if (spot && canHover && !reduceMotion && !mobileNavQuery.matches) {
  let raf = 0;
  let targetX = window.innerWidth * 0.7;
  let targetY = window.innerHeight * 0.2;
  let currentX = targetX;
  let currentY = targetY;

  const renderSpot = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    document.documentElement.style.setProperty("--spot-x", `${currentX}px`);
    document.documentElement.style.setProperty("--spot-y", `${currentY}px`);
    raf = requestAnimationFrame(renderSpot);
  };

  raf = requestAnimationFrame(renderSpot);

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    },
    { passive: true }
  );
}

/* Hero phone tilt */
if (hero && tiltEl && canHover && !reduceMotion) {
  let raf = 0;
  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;

  const renderTilt = () => {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    tiltEl.style.transform = `rotateX(${ty}deg) rotateY(${tx}deg) translateY(${ty * -0.4}px)`;
    raf = requestAnimationFrame(renderTilt);
  };

  raf = requestAnimationFrame(renderTilt);

  hero.addEventListener(
    "pointermove",
    (event) => {
      const rect = hero.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      mx = (px - 0.5) * 14;
      my = (0.5 - py) * 10;
    },
    { passive: true }
  );

  hero.addEventListener("pointerleave", () => {
    mx = 0;
    my = 0;
  });
}

/* Interactive phone slides */
if (phone && slides.length) {
  let index = 0;
  let timer = 0;
  let locked = false;

  const setSlide = (next) => {
    if (locked || next === index) return;
    locked = true;

    const current = slides[index];
    const upcoming = slides[next];

    current.classList.remove("is-active");
    current.classList.add("is-exit");
    upcoming.classList.add("is-active");

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === next);
    });

    window.setTimeout(() => {
      current.classList.remove("is-exit");
      locked = false;
    }, 420);

    index = next;
  };

  const nextSlide = () => setSlide((index + 1) % slides.length);

  const startAuto = () => {
    if (reduceMotion) return;
    stopAuto();
    timer = window.setInterval(nextSlide, 3400);
  };

  const stopAuto = () => {
    if (timer) window.clearInterval(timer);
  };

  phone.addEventListener("click", () => {
    nextSlide();
    startAuto();
  });

  if (canHover) {
    phone.addEventListener("pointerenter", stopAuto);
    phone.addEventListener("pointerleave", startAuto);
  }

  startAuto();
}

/* Headline word swap */
if (swapItems.length > 1 && !reduceMotion) {
  let index = 0;

  window.setInterval(() => {
    const current = swapItems[index];
    const next = (index + 1) % swapItems.length;
    const upcoming = swapItems[next];

    current.classList.remove("is-active");
    current.classList.add("is-exit");
    upcoming.classList.add("is-active");

    window.setTimeout(() => {
      current.classList.remove("is-exit");
    }, 500);

    index = next;
  }, 2800);
}

/* Magnetic CTA */
if (canHover && !reduceMotion) {
  magneticBtns.forEach((btn) => {
    btn.addEventListener("pointermove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
    });

    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

/* Scroll reveal */
const revealSections = [...document.querySelectorAll("[data-reveal]")];

if (revealSections.length) {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: mobileNavQuery.matches ? 0.08 : 0.18,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    revealSections.forEach((section) => observer.observe(section));
  }
}
