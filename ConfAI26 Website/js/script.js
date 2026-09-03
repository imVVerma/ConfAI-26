(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var dropdownItems = document.querySelectorAll(".has-dropdown");

  function setNavOpen(isOpen) {
    if (!navToggle || !siteNav) {
      return;
    }
    navToggle.setAttribute("aria-expanded", String(isOpen));
    siteNav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  }

  function closeDropdowns() {
    dropdownItems.forEach(function (item) {
      item.classList.remove("is-open");
      var toggle = item.querySelector(".dropdown-toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!isOpen);
      if (isOpen) {
        closeDropdowns();
      }
    });
  }

  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector(".dropdown-toggle");
    var link = item.querySelector(".nav-more-link");
    if (!toggle) {
      return;
    }
    function toggleDropdown(event) {
      event.stopPropagation();
      var isOpen = item.classList.contains("is-open");
      closeDropdowns();
      item.classList.toggle("is-open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    }
    toggle.addEventListener("click", toggleDropdown);
    if (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        toggleDropdown(event);
      });
    }
  });

  document.addEventListener("click", function (event) {
    dropdownItems.forEach(function (item) {
      if (!item.contains(event.target)) {
        item.classList.remove("is-open");
        var toggle = item.querySelector(".dropdown-toggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDropdowns();
      if (navToggle && navToggle.getAttribute("aria-expanded") === "true") {
        setNavOpen(false);
        navToggle.focus();
      }
    }
  });

  function updateHeaderState() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 64rem)").matches) {
      setNavOpen(false);
    }
  });

  /* ── COUNTDOWN CLOCK ──────────────────────────────────────────────────────
   * Target: October 30, 2026, 00:00:00 IST (Asia/Kolkata = UTC+5:30).
   * IST is UTC+05:30, so midnight IST = 18:30 UTC on the previous day.
   * Date.UTC(2026, 9, 29, 18, 30, 0)  →  Oct 29 2026 18:30:00 UTC
   *   which equals Oct 30 2026 00:00:00 IST.
   *
   * Conference window: Oct 30 (start) through Nov 1 (last day), inclusive.
   * Nov 2 00:00 IST = Oct 31 18:30 UTC + 2 days = Nov  2 18:30 UTC - 24h
   *   → Date.UTC(2026, 10, 1, 18, 30, 0)  (Nov 1 18:30 UTC = Nov 2 00:00 IST)
   * ─────────────────────────────────────────────────────────────────────── */
  (function initCountdown() {
    var TARGET_START = Date.UTC(2026, 9, 29, 18, 30, 0); // Oct 30 2026 00:00 IST
    var TARGET_END   = Date.UTC(2026, 10, 1, 18, 30, 0); // Nov 2  2026 00:00 IST

    var cdDays    = document.getElementById("cd-days");
    var cdHours   = document.getElementById("cd-hours");
    var cdMinutes = document.getElementById("cd-minutes");
    var cdSeconds = document.getElementById("cd-seconds");
    var heroCards = document.getElementById("hero-countdown");
    var navContainer = document.getElementById("nav-countdown");

    if (!cdDays && !navContainer) { return; }

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function showEnded(message) {
      if (heroCards) {
        heroCards.innerHTML = '<div class="countdown-message">' + message + '</div>';
      }
      if (navContainer) {
        navContainer.textContent = message;
        navContainer.classList.add("countdown-ended");
      }
    }

    function tick() {
      var now  = Date.now();
      var diff = TARGET_START - now;

      if (diff <= 0) {
        if (now < TARGET_END) {
          showEnded("Happening now");
        } else {
          showEnded("Concluded");
        }
        clearInterval(timer);
        return;
      }

      var totalSecs = Math.floor(diff / 1000);
      var days  = Math.floor(totalSecs / 86400);
      var hours = Math.floor((totalSecs % 86400) / 3600);
      var mins  = Math.floor((totalSecs % 3600) / 60);
      var secs  = totalSecs % 60;

      if (cdDays && cdHours && cdMinutes && cdSeconds) {
        cdDays.textContent    = String(days);
        cdHours.textContent   = pad(hours);
        cdMinutes.textContent = pad(mins);
        cdSeconds.textContent = pad(secs);
      }

      if (navContainer) {
        navContainer.innerHTML = '<span class="cd-full">' + days + 'd ' + pad(hours) + 'h ' + pad(mins) + 'm ' + pad(secs) + 's</span>' +
                                 '<span class="cd-short">' + days + ' days</span>';
      }
    }

    // Run immediately to avoid a 1-second blank flash, then tick every second
    tick();
    var timer = setInterval(tick, 1000);
  })();

  /* ── SPEAKER MODAL ──────────────────────────────────────────────────────── */
  (function initSpeakerModal() {
    var triggers = document.querySelectorAll(".speaker-trigger");
    var modal = document.getElementById("speaker-modal");
    if (!modal || triggers.length === 0) return;

    var closeBtn = modal.querySelector(".modal-close");
    var nameEl = document.getElementById("modal-speaker-name");
    var roleEl = document.getElementById("modal-speaker-role");
    var photoEl = document.getElementById("modal-speaker-photo");
    var linkEl = document.getElementById("modal-speaker-link");

    var activeTrigger = null;

    function openModal(trigger) {
      activeTrigger = trigger;
      nameEl.textContent = trigger.getAttribute("data-name");
      roleEl.textContent = trigger.getAttribute("data-role");
      photoEl.setAttribute("data-initials", trigger.getAttribute("data-initials"));
      linkEl.href = trigger.getAttribute("data-url");

      modal.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      
      closeBtn.focus();
    }

    function closeModal() {
      modal.setAttribute("hidden", "true");
      document.body.classList.remove("modal-open");
      if (activeTrigger) {
        activeTrigger.focus();
        activeTrigger = null;
      }
    }

    triggers.forEach(function(trigger) {
      trigger.addEventListener("click", function() {
        openModal(trigger);
      });
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
        closeModal();
      }
    });
    
    // Focus trap inside modal
    modal.addEventListener("keydown", function(event) {
      if (event.key === "Tab") {
        var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            event.preventDefault();
          }
        }
      }
    });
  })();

})();
