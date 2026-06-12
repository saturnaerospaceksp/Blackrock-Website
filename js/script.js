/* ============================================================
   Blackrock Dynamics - script.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu after choosing a link
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll-reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Animated stat counters ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statEls = document.querySelectorAll(".stat-number[data-count]");
  const statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(function (el) { statObserver.observe(el); });

  /* ---------- Contact form (client-side only) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;
    const fields = form.querySelectorAll("input, textarea");

    fields.forEach(function (field) {
      const ok = field.checkValidity() && field.value.trim() !== "";
      field.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "Please fill in all fields with a valid email address.";
      status.className = "form-status error";
      return;
    }

    // No backend; acknowledge locally and reset.
    status.textContent = "Thanks, " + form.name.value.trim() +
      "! Your message has been recorded. We'll be in touch soon.";
    status.className = "form-status success";
    form.reset();
    fields.forEach(function (field) { field.classList.remove("invalid"); });
  });

  // Clear the error styling as the user types
  if (form) form.addEventListener("input", function (e) {
    if (e.target.classList.contains("invalid") && e.target.checkValidity()) {
      e.target.classList.remove("invalid");
    }
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
