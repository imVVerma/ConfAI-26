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

  /* ── COUNTDOWN CLOCK ────────────────────────────────────────────────────── */
  (function initCountdown() {
    var TARGET_START = Date.UTC(2026, 9, 30, 4, 0, 0); // Oct 30 2026 09:30 IST
    var navDays = document.getElementById("nav-countdown-days");
    var navHours = document.getElementById("nav-countdown-hours");
    var navMinutes = document.getElementById("nav-countdown-minutes");
    var navSeconds = document.getElementById("nav-countdown-seconds");

    if (!navDays || !navHours || !navMinutes || !navSeconds) { return; }

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function tick() {
      var now  = Date.now();
      var diff = TARGET_START - now;

      if (diff <= 0) {
        navDays.textContent = "00";
        navHours.textContent = "00";
        navMinutes.textContent = "00";
        navSeconds.textContent = "00";
        clearInterval(timer);
        return;
      }

      var totalSecs = Math.floor(diff / 1000);
      var days  = Math.floor(totalSecs / 86400);
      var hours = Math.floor((totalSecs % 86400) / 3600);
      var minutes = Math.floor((totalSecs % 3600) / 60);
      var seconds = totalSecs % 60;
      navDays.textContent = pad(days);
      navHours.textContent = pad(hours);
      navMinutes.textContent = pad(minutes);
      navSeconds.textContent = pad(seconds);
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

    var wrapper = grid.closest(".gallery-carousel-wrapper") || grid.closest(".gallery-carousel");
    var previousButton = wrapper ? wrapper.querySelector(".gallery-control--prev") : null;
    var nextButton = wrapper ? wrapper.querySelector(".gallery-control--next") : null;
    var dotsContainer = document.getElementById("gallery-dots");
    var slideCounterCurrent = document.getElementById("gallery-current-slide");
    var slideCounterTotal = document.getElementById("gallery-total-slides");

    var photoModalImg = document.getElementById("photo-modal-img");
    var photoModalCaption = document.getElementById("photo-modal-caption");
    var photoModalCounter = document.getElementById("photo-modal-counter");
    var photoModalPrev = document.getElementById("photo-modal-prev");
    var photoModalNext = document.getElementById("photo-modal-next");
    var photoModalClose = document.getElementById("photo-modal-close") || photoModal.querySelector(".modal-close");

    var allPhotos = [];
    var currentPhotoIndex = 0;
    var activeGalleryTrigger = null;
    var autoplayTimer = null;
    var currentSlide = 0;
    var totalSlides = 0;

    // ── Lightbox Navigation ──────────────────────────────────────────────
    function updatePhotoModal(index) {
      if (!allPhotos.length) { return; }
      currentPhotoIndex = (index + allPhotos.length) % allPhotos.length;
      var photo = allPhotos[currentPhotoIndex];
      var photoSrc = "img/gallery-2025/" + photo.file;
      var altText = photo.alt || ("ConfAI 2025 Photo " + (currentPhotoIndex + 1));

      photoModalImg.src = photoSrc;
      photoModalImg.alt = altText;
      if (photoModalCaption) {
        photoModalCaption.textContent = altText;
      }
      if (photoModalCounter) {
        photoModalCounter.textContent = (currentPhotoIndex + 1) + " / " + allPhotos.length;
      }
    }

    function openPhotoModal(index, trigger) {
      activeGalleryTrigger = trigger;
      updatePhotoModal(index);
      photoModal.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      if (photoModalClose) {
        photoModalClose.focus();
      }
      stopAutoplay();
    }

    function closePhotoModal() {
      photoModal.setAttribute("hidden", "true");
      document.body.classList.remove("modal-open");
      if (activeGalleryTrigger) {
        activeGalleryTrigger.focus();
        activeGalleryTrigger = null;
      }
      startAutoplay();
    }

    if (photoModalClose) {
      photoModalClose.addEventListener("click", closePhotoModal);
    }
    if (photoModalPrev) {
      photoModalPrev.addEventListener("click", function(e) {
        e.stopPropagation();
        updatePhotoModal(currentPhotoIndex - 1);
      });
    }
    if (photoModalNext) {
      photoModalNext.addEventListener("click", function(e) {
        e.stopPropagation();
        updatePhotoModal(currentPhotoIndex + 1);
      });
    }

    photoModal.addEventListener("click", function(event) {
      if (event.target === photoModal || event.target.classList.contains("photo-modal-viewer") || event.target.classList.contains("photo-modal-img-wrap")) {
        closePhotoModal();
      }
    });

    document.addEventListener("keydown", function(event) {
      if (photoModal.hasAttribute("hidden")) { return; }
      if (event.key === "Escape") {
        closePhotoModal();
      } else if (event.key === "ArrowLeft") {
        updatePhotoModal(currentPhotoIndex - 1);
      } else if (event.key === "ArrowRight") {
        updatePhotoModal(currentPhotoIndex + 1);
      }
    });

    // ── Carousel Render & Logic ──────────────────────────────────────────
    function renderGallery(photos) {
      allPhotos = photos;
      grid.innerHTML = "";
      if (dotsContainer) { dotsContainer.innerHTML = ""; }

      var itemsPerSlide = 4;
      totalSlides = Math.ceil(photos.length / itemsPerSlide);
      if (totalSlides < 1) { return; }

      if (slideCounterTotal) {
        slideCounterTotal.textContent = totalSlides;
      }

      for (var s = 0; s < totalSlides; s += 1) {
        var slide = document.createElement("div");
        slide.className = "gallery-slide";
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-label", "Gallery slide " + (s + 1) + " of " + totalSlides);

        var slice = photos.slice(s * itemsPerSlide, s * itemsPerSlide + itemsPerSlide);
        slice.forEach(function(photo, localIdx) {
          var globalIdx = s * itemsPerSlide + localIdx;
          var altText = photo.alt || ("ConfAI 2025 conference photo " + (globalIdx + 1));

          var btn = document.createElement("button");
          btn.className = "gallery-item";
          btn.setAttribute("type", "button");
          btn.setAttribute("aria-label", "View photo: " + altText);

          var img = document.createElement("img");
          img.src = "img/gallery-2025/" + photo.file;
          img.alt = altText;
          img.className = "gallery-img";
          img.loading = globalIdx < 8 ? "eager" : "lazy";
          img.decoding = "async";
          btn.appendChild(img);

          var overlay = document.createElement("div");
          overlay.className = "gallery-item-overlay";
          var caption = document.createElement("span");
          caption.className = "gallery-item-caption";
          caption.textContent = altText;
          overlay.appendChild(caption);
          btn.appendChild(overlay);

          btn.addEventListener("click", function() {
            openPhotoModal(globalIdx, btn);
          });

          slide.appendChild(btn);
        });

        grid.appendChild(slide);

        // Dot indicator
        if (dotsContainer) {
          var dot = document.createElement("button");
          dot.className = "gallery-dot" + (s === 0 ? " is-active" : "");
          dot.setAttribute("type", "button");
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", "Go to gallery slide " + (s + 1));
          dot.setAttribute("aria-selected", s === 0 ? "true" : "false");
          (function(targetSlide) {
            dot.addEventListener("click", function() {
              showSlide(targetSlide);
            });
          })(s);
          dotsContainer.appendChild(dot);
        }
      }

      function showSlide(nextSlide) {
        currentSlide = (nextSlide + totalSlides) % totalSlides;
        grid.style.transform = "translateX(-" + (currentSlide * 100) + "%)";
        if (slideCounterCurrent) {
          slideCounterCurrent.textContent = currentSlide + 1;
        }

        if (dotsContainer) {
          var dots = dotsContainer.querySelectorAll(".gallery-dot");
          dots.forEach(function(d, i) {
            if (i === currentSlide) {
              d.classList.add("is-active");
              d.setAttribute("aria-selected", "true");
            } else {
              d.classList.remove("is-active");
              d.setAttribute("aria-selected", "false");
            }
          });
        }
      }

      if (previousButton) {
        previousButton.addEventListener("click", function() {
          showSlide(currentSlide - 1);
        });
      }
      if (nextButton) {
        nextButton.addEventListener("click", function() {
          showSlide(currentSlide + 1);
        });
      }

      // Touch swipe gestures
      var touchStartX = 0;
      var touchEndX = 0;
      grid.addEventListener("touchstart", function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });

      grid.addEventListener("touchend", function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            showSlide(currentSlide + 1);
          } else {
            showSlide(currentSlide - 1);
          }
        }
        startAutoplay();
      }, { passive: true });

      // Autoplay with pause-on-hover
      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(function() {
          showSlide(currentSlide + 1);
        }, 4500);
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      if (wrapper) {
        wrapper.addEventListener("mouseenter", stopAutoplay);
        wrapper.addEventListener("mouseleave", startAutoplay);
      }

      showSlide(0);
      startAutoplay();
    }

    fetch("img/gallery-2025/manifest.json")
      .then(function(res) {
        if (!res.ok) { throw new Error("Manifest not found"); }
        return res.json();
      })
      .then(function(data) {
        renderGallery(data.photos || []);
      })
      .catch(function(err) {
        grid.innerHTML = "<p class=\"gallery-error\">Gallery photos are temporarily unavailable.</p>";
        console.warn("Gallery manifest error:", err);
      });
  })();

  (function initTravelModal() {
    var modal = document.getElementById("travel-modal");
    var openButton = document.querySelector("[data-travel-open]");
    if (!modal || !openButton) { return; }

    var closeButton = modal.querySelector(".modal-close");
    function closeModal() {
      modal.setAttribute("hidden", "true");
      document.body.classList.remove("modal-open");
      openButton.focus();
    }

    openButton.addEventListener("click", function() {
      modal.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      closeButton.focus();
    });
    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", function(event) {
      if (event.target === modal) { closeModal(); }
    });
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && !modal.hasAttribute("hidden")) { closeModal(); }
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

  /* ── REGISTRATION PAGE INTERACTIONS ────────────────────────────────────── */
  (function initRegistrationPage() {
    // 1. Pass Comparison Table Toggle
    var tableToggleBtn = document.getElementById("toggle-pass-table-btn");
    var tableContainer = document.getElementById("passes-comparison-table-wrap");

    if (tableToggleBtn && tableContainer) {
      tableToggleBtn.addEventListener("click", function () {
        var isExpanded = tableToggleBtn.getAttribute("aria-expanded") === "true";
        var nextState = !isExpanded;

        tableToggleBtn.setAttribute("aria-expanded", String(nextState));
        if (nextState) {
          tableContainer.removeAttribute("hidden");
          var textSpan = tableToggleBtn.querySelector(".toggle-btn-text");
          if (textSpan) textSpan.textContent = "Hide Pass Comparison Table";
        } else {
          tableContainer.setAttribute("hidden", "");
          var textSpan = tableToggleBtn.querySelector(".toggle-btn-text");
          if (textSpan) textSpan.textContent = "View Detailed Pass Comparison Table";
        }
      });
    }

    // 2. Post-Payment Confirmation Modal
    var paymentModal = document.getElementById("payment-confirm-modal");
    var paymentModalTriggers = document.querySelectorAll("[data-payment-modal-open]");
    var paymentModalClose = document.getElementById("payment-modal-close");
    var paymentModalDone = document.getElementById("payment-modal-done-btn");
    var modalToAccLink = document.getElementById("modal-to-acc-link");

    function openPaymentModal() {
      if (!paymentModal) return;
      paymentModal.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
      if (paymentModalClose) paymentModalClose.focus();
    }

    function closePaymentModal() {
      if (!paymentModal) return;
      paymentModal.setAttribute("hidden", "");
      document.body.style.overflow = "";
    }

    paymentModalTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        openPaymentModal();
      });
    });

    if (paymentModalClose) {
      paymentModalClose.addEventListener("click", closePaymentModal);
    }
    if (paymentModalDone) {
      paymentModalDone.addEventListener("click", closePaymentModal);
    }
    if (modalToAccLink) {
      modalToAccLink.addEventListener("click", function () {
        closePaymentModal();
      });
    }

    if (paymentModal) {
      paymentModal.addEventListener("click", function (e) {
        if (e.target === paymentModal) {
          closePaymentModal();
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && paymentModal && !paymentModal.hasAttribute("hidden")) {
        closePaymentModal();
      }
    });

    // Auto-open if query param is set
    try {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("status") === "success" || urlParams.get("payment") === "confirmed") {
        openPaymentModal();
      }
    } catch (err) {
      // Ignore URLSearchParams error in older environments
    }

    // 3. Accommodation Request Form
    var accForm = document.getElementById("accommodation-request-form");
    var statusAlert = document.getElementById("accommodation-status-alert");
    var statusFeedbackText = document.getElementById("status-feedback-text");

    if (accForm) {
      accForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Clear previous validation states
        var errorFields = accForm.querySelectorAll(".is-invalid");
        errorFields.forEach(function (f) { f.classList.remove("is-invalid"); });
        var errorMsgs = accForm.querySelectorAll(".form-error-msg");
        errorMsgs.forEach(function (m) { m.textContent = ""; });

        var fullname = (document.getElementById("acc-fullname").value || "").trim();
        var email = (document.getElementById("acc-email").value || "").trim();
        var phone = (document.getElementById("acc-phone").value || "").trim();
        var regid = (document.getElementById("acc-regid").value || "").trim();
        var checkin = (document.getElementById("acc-checkin").value || "").trim();
        var checkout = (document.getElementById("acc-checkout").value || "").trim();
        var notesEl = document.getElementById("acc-notes");
        var notes = notesEl ? (notesEl.value || "").trim() : "";

        var isValid = true;
        var firstInvalidField = null;

        function markInvalid(id, errId, msg) {
          var input = document.getElementById(id);
          var errSpan = document.getElementById(errId);
          if (input) input.classList.add("is-invalid");
          if (errSpan) errSpan.textContent = msg;
          if (!firstInvalidField && input) firstInvalidField = input;
          isValid = false;
        }

        if (!fullname) {
          markInvalid("acc-fullname", "error-fullname", "Please provide your full name.");
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          markInvalid("acc-email", "error-email", "Please provide a valid email address.");
        }
        if (!phone) {
          markInvalid("acc-phone", "error-phone", "Please provide a contact phone number.");
        }
        if (!regid) {
          markInvalid("acc-regid", "error-regid", "Please provide your registration or payment ID.");
        }
        if (!checkin) {
          markInvalid("acc-checkin", "error-checkin", "Please choose a check-in date.");
        }
        if (!checkout) {
          markInvalid("acc-checkout", "error-checkout", "Please choose a check-out date.");
        }

        if (!isValid) {
          if (firstInvalidField) firstInvalidField.focus();
          return;
        }

        // Show on-screen confirmation
        if (statusAlert) {
          statusAlert.removeAttribute("hidden");
          if (statusFeedbackText) {
            statusFeedbackText.textContent = "Thank you, " + fullname + "! Your accommodation request has been recorded. Opening your email to forward to confai@plaksha.edu.in.";
          }
          statusAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        // Open mailto with prefilled details
        var emailSubject = encodeURIComponent("ConfAI 2026 Accommodation Request - " + fullname + " (" + regid + ")");
        var emailBody = encodeURIComponent(
          "Dear ConfAI 2026 Organizing Committee,\n\n" +
          "I have registered for ConfAI 2026 and would like to request campus accommodation. Here are my details:\n\n" +
          "• Full Name: " + fullname + "\n" +
          "• Email Address: " + email + "\n" +
          "• Phone Number: " + phone + "\n" +
          "• Registration / Payment ID: " + regid + "\n" +
          "• Check-in Date: " + checkin + "\n" +
          "• Check-out Date: " + checkout + "\n" +
          "• Notes / Requests: " + (notes || "None") + "\n\n" +
          "Kindly confirm room availability and booking procedures.\n\n" +
          "Best regards,\n" + fullname
        );

        setTimeout(function () {
          window.location.href = "mailto:confai@plaksha.edu.in?subject=" + emailSubject + "&body=" + emailBody;
        }, 800);
      });
    }
  })();

})();
