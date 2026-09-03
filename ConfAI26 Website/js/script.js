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

    if (!cdDays) { return; }

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function showEnded(message) {
      if (heroCards) {
        heroCards.innerHTML = '<div class="countdown-message">' + message + '</div>';
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

  /* ── GALLERY 2025 ────────────────────────────────────────────────────────
   * Loads img/gallery-2025/manifest.json, renders clickable gallery tiles,
   * and wires them to the #photo-modal lightbox.
   *
   * HOW TO ADD A REAL PHOTO LATER:
   *   1. Drop the image file into  img/gallery-2025/
   *   2. Open  img/gallery-2025/manifest.json
   *   3. Add one entry to the "photos" array:
   *        { "file": "your-filename.jpg", "alt": "ConfAI 2025 — short description" }
   *   4. Save. No HTML changes needed.
   *
   * NOTE: The "placeholder": true flag is for dev only. The gallery renders
   * placeholder blocks for entries that have it set, so layout can be
   * verified before real photos are ready. Remove the flag (or the whole
   * field) when a real photo is in place.
   * ──────────────────────────────────────────────────────────────────────── */
  (function initGallery() {
    var grid = document.getElementById("gallery-2025");
    var photoModal = document.getElementById("photo-modal");
    if (!grid || !photoModal) { return; }

    var photoModalImg     = document.getElementById("photo-modal-img");
    var photoModalCaption = document.getElementById("photo-modal-caption");
    var photoModalClose   = photoModal.querySelector(".modal-close");
    var activeGalleryTrigger = null;

    // ── Lightbox open/close ──────────────────────────────────────────────
    function openPhotoModal(trigger, src, alt) {
      activeGalleryTrigger = trigger;
      if (!trigger.getAttribute("data-is-placeholder")) {
        photoModalImg.src = src;
        photoModalImg.alt = alt;
        photoModalImg.style.display = "";
      } else {
        photoModalImg.src = "";
        photoModalImg.alt = "";
        photoModalImg.style.display = "none";
      }
      photoModalCaption.textContent = alt;
      photoModal.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      photoModalClose.focus();
    }

    function closePhotoModal() {
      photoModal.setAttribute("hidden", "true");
      document.body.classList.remove("modal-open");
      if (activeGalleryTrigger) {
        activeGalleryTrigger.focus();
        activeGalleryTrigger = null;
      }
    }

    if (photoModalClose) {
      photoModalClose.addEventListener("click", closePhotoModal);
    }

    photoModal.addEventListener("click", function(event) {
      if (event.target === photoModal) { closePhotoModal(); }
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && !photoModal.hasAttribute("hidden")) {
        closePhotoModal();
      }
    });

    // Focus trap inside photo modal
    photoModal.addEventListener("keydown", function(event) {
      if (event.key !== "Tab") { return; }
      var focusable = photoModal.querySelectorAll('button, [href], img[tabindex], [tabindex]:not([tabindex="-1"])');
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) { last.focus(); event.preventDefault(); }
      } else {
        if (document.activeElement === last) { first.focus(); event.preventDefault(); }
      }
    });

    // ── Manifest fetch & render ──────────────────────────────────────────
    fetch("img/gallery-2025/manifest.json")
      .then(function(res) {
        if (!res.ok) { throw new Error("Manifest not found"); }
        return res.json();
      })
      .then(function(data) {
        var photos = data.photos || [];
        photos.forEach(function(photo, idx) {
          var isPlaceholder = !!photo.placeholder;
          var altText = photo.alt || ("ConfAI 2025 conference photo " + (idx + 1));

          // Outer wrapper acts as the clickable trigger
          var btn = document.createElement("button");
          btn.className = "gallery-item" + (isPlaceholder ? " gallery-item--placeholder" : "");
          btn.setAttribute("type", "button");
          btn.setAttribute("role", "listitem");
          btn.setAttribute("aria-label", "View enlarged: " + altText);
          if (isPlaceholder) { btn.setAttribute("data-is-placeholder", "true"); }

          if (isPlaceholder) {
            // Placeholder block — neutral fill, shows photo number
            var plabel = document.createElement("span");
            plabel.className = "gallery-placeholder-label";
            plabel.textContent = "Photo " + (idx + 1);
            plabel.setAttribute("aria-hidden", "true");
            btn.appendChild(plabel);
          } else {
            var img = document.createElement("img");
            img.src   = "img/gallery-2025/" + photo.file;
            img.alt   = altText;
            img.className = "gallery-img";
            img.loading = "lazy";
            img.decoding = "async";
            btn.appendChild(img);
          }

          btn.addEventListener("click", function() {
            openPhotoModal(
              btn,
              isPlaceholder ? "" : "img/gallery-2025/" + photo.file,
              altText
            );
          });

          grid.appendChild(btn);
        });
      })
      .catch(function(err) {
        // Silently degrade — if manifest fails just hide the grid
        grid.style.display = "none";
        console.warn("Gallery manifest error:", err);
      });
  })();
  /* ── TRACK MODAL ────────────────────────────────────────────────────────── */
  (function initTrackModal() {
    var triggers = document.querySelectorAll(".track-node");
    var modal    = document.getElementById("track-modal");
    if (!modal || triggers.length === 0) { return; }

    var closeBtn  = modal.querySelector(".modal-close");
    var numEl     = document.getElementById("track-modal-num");
    var nameEl    = document.getElementById("track-modal-name");
    var chairsEl  = document.getElementById("track-modal-chairs");
    var descEl    = document.getElementById("track-modal-desc");
    var activeTrackTrigger = null;

    function openTrackModal(trigger) {
      activeTrackTrigger = trigger;
      var chairs = trigger.getAttribute("data-track-chairs");
      numEl.textContent    = "Track " + trigger.getAttribute("data-track-num");
      nameEl.textContent   = trigger.getAttribute("data-track-name");
      descEl.textContent   = trigger.getAttribute("data-track-desc");

      if (chairs) {
        chairsEl.textContent = "Track Co-Chairs: " + chairs;
        chairsEl.style.display = "";
      } else {
        chairsEl.textContent = "";
        chairsEl.style.display = "none";
      }

      modal.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      closeBtn.focus();
    }

    function closeTrackModal() {
      modal.setAttribute("hidden", "true");
      document.body.classList.remove("modal-open");
      if (activeTrackTrigger) {
        activeTrackTrigger.focus();
        activeTrackTrigger = null;
      }
    }

    triggers.forEach(function(trigger) {
      trigger.addEventListener("click", function() { openTrackModal(trigger); });
    });

    closeBtn.addEventListener("click", closeTrackModal);

    modal.addEventListener("click", function(event) {
      if (event.target === modal) { closeTrackModal(); }
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
        closeTrackModal();
      }
    });

    // Focus trap inside modal
    modal.addEventListener("keydown", function(event) {
      if (event.key !== "Tab") { return; }
      var focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) { last.focus(); event.preventDefault(); }
      } else {
        if (document.activeElement === last) { first.focus(); event.preventDefault(); }
      }
    });
  })();

  /* ── FAQ ACCORDION ──────────────────────────────────────────────────────── */
  (function initFaqAccordion() {
    var accordion = document.getElementById("faq-accordion");
    if (!accordion) return;

    var buttons = accordion.querySelectorAll(".faq-question-btn");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var isExpanded = button.getAttribute("aria-expanded") === "true";
        var targetId = button.getAttribute("aria-controls");
        var panel = document.getElementById(targetId);
        var item = button.closest(".faq-item");

        if (!panel || !item) return;

        var nextState = !isExpanded;

        buttons.forEach(function (otherButton) {
          var otherTargetId = otherButton.getAttribute("aria-controls");
          var otherPanel = otherTargetId ? document.getElementById(otherTargetId) : null;
          var otherItem = otherButton.closest(".faq-item");

          if (otherButton !== button && otherPanel && otherItem) {
            otherButton.setAttribute("aria-expanded", "false");
            otherPanel.setAttribute("aria-hidden", "true");
            otherItem.classList.remove("is-open");
          }
        });

        button.setAttribute("aria-expanded", String(nextState));
        panel.setAttribute("aria-hidden", String(!nextState));
        item.classList.toggle("is-open", nextState);
      });
    });
  })();

})();
