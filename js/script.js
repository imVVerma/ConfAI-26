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
      var now = Date.now();
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
      var days = Math.floor(totalSecs / 86400);
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

  /* ── RELIVE VIDEO YEAR SELECTOR ────────────────────────────────────────── */
  (function initReliveVideo() {
    var filters = document.querySelectorAll(".video-year-filter");
    var iframe = document.querySelector(".video-wrapper iframe");
    var heading = document.getElementById("relive-heading");
    var wrapper = document.querySelector(".video-wrapper");

    if (!iframe || !heading || !wrapper || filters.length === 0) { return; }

    function switchVideoToYear(targetYear) {
      var targetBtn = null;
      filters.forEach(function (button) {
        if (button.getAttribute("data-video-year") === String(targetYear)) {
          targetBtn = button;
        }
      });
      if (!targetBtn) return;

      var videoUrl = targetBtn.getAttribute("data-video-url");
      var videoTitle = targetBtn.getAttribute("data-video-title");
      if (!videoUrl || !videoTitle) return;

      iframe.src = videoUrl;
      iframe.title = videoTitle;
      heading.textContent = "Relive ConfAI";
      wrapper.setAttribute("aria-label", videoTitle);

      filters.forEach(function (button) {
        var isActive = button === targetBtn;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        var year = filter.getAttribute("data-video-year");
        if (year) switchVideoToYear(year);
      });
    });

    // Support year clicks from header nav dropdown
    var dropdownYearLinks = document.querySelectorAll("[data-video-year]");
    dropdownYearLinks.forEach(function (link) {
      if (link.classList.contains("video-year-filter")) return;
      link.addEventListener("click", function () {
        var year = link.getAttribute("data-video-year");
        if (year) switchVideoToYear(year);
      });
    });

    // Check URL hash on page load (e.g. #relive-2023) or on hash change
    function handleHash() {
      if (window.location.hash) {
        var hashMatch = window.location.hash.match(/relive-(\d{4})/);
        if (hashMatch && hashMatch[1]) {
          switchVideoToYear(hashMatch[1]);
        }
      }
    }
    handleHash();
    window.addEventListener("hashchange", handleHash);
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

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openModal(trigger);
      });
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
        closeModal();
      }
    });

    // Focus trap inside modal
    modal.addEventListener("keydown", function (event) {
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

      photoModalImg.onerror = function () {
        this.onerror = null;
        this.style.display = "none";
      };
      photoModalImg.style.display = "";
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
      photoModalPrev.addEventListener("click", function (e) {
        e.stopPropagation();
        updatePhotoModal(currentPhotoIndex - 1);
      });
    }
    if (photoModalNext) {
      photoModalNext.addEventListener("click", function (e) {
        e.stopPropagation();
        updatePhotoModal(currentPhotoIndex + 1);
      });
    }

    photoModal.addEventListener("click", function (event) {
      if (event.target === photoModal || event.target.classList.contains("photo-modal-viewer") || event.target.classList.contains("photo-modal-img-wrap")) {
        closePhotoModal();
      }
    });

    document.addEventListener("keydown", function (event) {
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
        slice.forEach(function (photo, localIdx) {
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
          img.onerror = function () {
            this.onerror = null;
            this.style.display = "none";
            btn.classList.add("gallery-item--broken");
          };
          btn.appendChild(img);

          var overlay = document.createElement("div");
          overlay.className = "gallery-item-overlay";
          var caption = document.createElement("span");
          caption.className = "gallery-item-caption";
          caption.textContent = altText;
          overlay.appendChild(caption);
          btn.appendChild(overlay);

          btn.addEventListener("click", function () {
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
          (function (targetSlide) {
            dot.addEventListener("click", function () {
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
          dots.forEach(function (d, i) {
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
        previousButton.addEventListener("click", function () {
          showSlide(currentSlide - 1);
        });
      }
      if (nextButton) {
        nextButton.addEventListener("click", function () {
          showSlide(currentSlide + 1);
        });
      }

      // Touch swipe gestures
      var touchStartX = 0;
      var touchEndX = 0;
      grid.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });

      grid.addEventListener("touchend", function (e) {
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
        autoplayTimer = setInterval(function () {
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
      .then(function (res) {
        if (!res.ok) { throw new Error("Manifest not found"); }
        return res.json();
      })
      .then(function (data) {
        renderGallery(data.photos || []);
      })
      .catch(function (err) {
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

    openButton.addEventListener("click", function () {
      modal.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      closeButton.focus();
    });
    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) { closeModal(); }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hasAttribute("hidden")) { closeModal(); }
    });
  })();
  /* ── TRACK MODAL ────────────────────────────────────────────────────────── */
  (function initTrackModal() {
    var triggers = document.querySelectorAll(".track-node");
    var modal = document.getElementById("track-modal");
    if (!modal || triggers.length === 0) { return; }

    var closeBtn = modal.querySelector(".modal-close");
    var numEl = document.getElementById("track-modal-num");
    var nameEl = document.getElementById("track-modal-name");
    var chairsEl = document.getElementById("track-modal-chairs");
    var descEl = document.getElementById("track-modal-desc");
    var activeTrackTrigger = null;

    // ── Faculty URL lookup map ───────────────────────────────────────────────
    var CHAIR_URLS = {
      "Alok Ranjan": "https://plaksha.edu.in/faculty-details/alok-ranjan",
      "Nikhil George": "https://plaksha.edu.in/faculty-details/nikhil-george",
      "Divyanshu Jain": "https://plaksha.edu.in/faculty-details/divyanshu-jain",
      "Dr. Sunita Chauhan": "https://plaksha.edu.in/faculty-details/dr-sunita-chauhan",
      "Dr. Sandeep Manjanna": "https://plaksha.edu.in/faculty-details/dr-sandeep-manjanna",
      "Dr. Monika Sharma": "https://plaksha.edu.in/faculty-details/dr-monika-sharma",
      "Dr. Chaitanya Lekshmi Indira": "https://plaksha.edu.in/faculty-details/dr-chaitanya-lekshmi-indira",
      "Arshdeep Sidhu": "https://plaksha.edu.in/faculty-details/arshdeep-sidhu",
      "Dr. Amruta R Behera": "https://plaksha.edu.in/faculty-details/dr-amruta-r-behera",
      "Dr. Rucha Joshi": "https://plaksha.edu.in/faculty-details/dr-rucha-joshi",
      "Dr. Swagata Halder": "https://plaksha.edu.in/faculty-details/dr-swagata-halder",
      "Sanjeev Khosla": "https://plaksha.edu.in/faculty-details/sanjeev-khosla",
      "Dr. Anupam Sobti": "https://plaksha.edu.in/faculty-details/dr-anupam-sobti",
      "Dr. Malini Balakrishnan": "https://plaksha.edu.in/faculty-details/dr-malini-balakrishnan",
      "Dr. Prashanth Suresh Kumar": "https://plaksha.edu.in/faculty-details/dr-prashanth-suresh-kumar",
      "Pankaj Pansari": "https://plaksha.edu.in/faculty-details/pankaj-pansari",
      "Anil Roy": "https://plaksha.edu.in/faculty-details/anil-roy",
      "Praveen Kumar": "https://plaksha.edu.in/faculty-details/praveen-kumar",
      "Deepan Muthirayan": "https://plaksha.edu.in/faculty-details/deepan-muthirayan",
      "Rajesh Sharma": "https://plaksha.edu.in/faculty-details/rajesh-sharma",
      "Shachindra Nath": "http://linkedin.com/in/shachindranath",
      "Dr. Deepak Khemani": "https://plaksha.edu.in/faculty-details/dr-deepak-khemani",
      "Saeed Salehi": "https://plaksha.edu.in/faculty-details/saeed-salehi",
      "Dr. Tapas Pandit": "https://plaksha.edu.in/faculty-details/dr-tapas-pandit",
      "Sandilya Garimella": "https://plaksha.edu.in/faculty-details/sandilya-garimella"
    };

    function buildChairsHTML(chairsStr) {
      var names = chairsStr.split("|").map(function (s) { return s.trim(); }).filter(Boolean);
      return names.map(function (name) {
        var url = CHAIR_URLS[name];
        if (url) {
          return "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + name + "</a>";
        }
        return name;
      }).join(" &nbsp;|&nbsp; ");
    }

    function openTrackModal(trigger) {
      activeTrackTrigger = trigger;
      var chairs = trigger.getAttribute("data-track-chairs");
      numEl.textContent = "Track " + trigger.getAttribute("data-track-num");
      nameEl.textContent = trigger.getAttribute("data-track-name");
      descEl.textContent = trigger.getAttribute("data-track-desc");

      if (chairs) {
        chairsEl.innerHTML = "Track Co-Chairs: " + buildChairsHTML(chairs);
        chairsEl.style.display = "";
      } else {
        chairsEl.innerHTML = "";
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

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () { openTrackModal(trigger); });
    });

    closeBtn.addEventListener("click", closeTrackModal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) { closeTrackModal(); }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
        closeTrackModal();
      }
    });

    // Focus trap inside modal
    modal.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") { return; }
      var focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
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

    // Accommodation is handled externally via Google Forms link
  })();

  /* ── CONFAI 2026 GANTT TIMETABLE CONTROLLER & DATABASE ──────────────────── */
  (function initGanttBoard() {
    var sessionsDb = {
      'd1-s1': {
        category: 'Arrival & Registration',
        badgeClass: 'tag-green',
        time: '08:30 AM - 09:30 AM (60 mins)',
        venue: 'A1-005 (Tentative)',
        title: 'Arrival / Registration & Refreshments',
        desc: 'Delegate check-in, conference kit distribution, attendee badge pickup, and welcome morning refreshments.'
      },
      'd1-s2': {
        category: 'Opening Ceremony',
        badgeClass: 'tag-green',
        time: '09:30 AM - 10:00 AM (30 mins)',
        venue: 'Auditorium',
        title: 'Welcome Address & ConfAI Vision',
        desc: 'Inaugural address and vision presentation for ConfAI 2026 by Plaksha University leadership and organizing committees.'
      },
      'd1-s3': {
        category: 'Plenary Keynote',
        badgeClass: 'tag-green',
        time: '10:00 AM - 10:50 AM (50 mins)',
        venue: 'Auditorium',
        title: 'Keynote Address 1',
        speaker: 'Dr. Santanu Chaudhury',
        affiliation: 'Dean, Vachani School of Advanced Computing, Ashoka University | Professor of CS, Ph.D. IIT Kharagpur',
        desc: 'Plenary keynote address focusing on fundamental frontiers in artificial intelligence, learning representations, and intelligent systems.'
      },
      'd1-s4': {
        category: 'Refreshment Break',
        badgeClass: 'tag-green',
        time: '10:50 AM - 11:15 AM (25 mins)',
        venue: 'Dining & Corridor Area',
        title: 'Tea Break',
        desc: 'Morning tea, coffee, and informal networking for all delegates.'
      },
      'd1-s5a': {
        category: 'Oral Track Session',
        badgeClass: 'tag-lavender',
        time: '11:15 AM - 12:45 PM (90 mins)',
        venue: 'Room: A3 - 3202',
        title: 'Track Presentations: AI In Healthcare',
        chairs: 'Dr. Sunita Chauhan, Dr. Sandeep Manjanna, Dr. Monika Sharma, Dr. Chaitanya Lekshmi Indira, Dr. Appan Rakaraddi, Dr. Arshdeep Sidhu, Dr. Amruta R Behera, Dr. Rucha Joshi, Dr. Swagata Halder, Dr. Sanjeev Khosla',
        desc: 'Exploring how AI technologies deliver tailored healthcare solutions, precision diagnostics, adaptive care pathways, and language-inclusive clinical tools.',
        schedule: [
          { time: '11:15 AM - 11:45 AM', event: 'Track Keynote Presentation' },
          { time: '11:45 AM - 12:45 PM', event: 'Track Oral Paper Presentations' }
        ]
      },
      'd1-s5b': {
        category: 'Oral Track Session',
        badgeClass: 'tag-lavender',
        time: '11:15 AM - 12:45 PM (90 mins)',
        venue: 'Room: A3 - 3203 (MSAI Classroom)',
        title: 'Track Presentations: AI and Logic: Relations and Applications',
        chairs: 'Dr. Deepak Khemani, Dr. Saeed Salehi, Dr. Tapas Pandit',
        desc: 'The interaction of logical frameworks, formal methods, theorem proving, model checking, and multi-agent epistemic reasoning in modern AI.',
        schedule: [
          { time: '11:15 AM - 11:45 AM', event: 'Track Keynote Presentation' },
          { time: '11:45 AM - 12:45 PM', event: 'Track Oral Paper Presentations' }
        ]
      },
      'd1-s6': {
        category: 'Photo Session',
        badgeClass: 'tag-green',
        time: '12:45 PM - 01:10 PM (25 mins)',
        venue: 'Grand Staircase',
        title: 'Group Photograph',
        desc: 'Official conference group photograph with keynote speakers, organizing chairs, authors, delegates, and guests on the Grand Staircase.'
      },
      'd1-s7': {
        category: 'Lunch & Networking',
        badgeClass: 'tag-green',
        time: '01:10 PM - 02:10 PM (60 mins)',
        venue: 'Dining Hall (First Floor)',
        title: 'Lunch',
        desc: 'Buffet lunch in the First Floor Dining Hall with dedicated discussion tables.'
      },
      'd1-s8': {
        category: 'Invited Talk',
        badgeClass: 'tag-green',
        time: '02:10 PM - 03:00 PM (50 mins)',
        venue: 'Auditorium',
        title: 'Invited Speaker Talk 1',
        speaker: 'Dr. Parag Singla',
        affiliation: 'Professor, Department of Computer Science & Engineering, IIT Delhi | Ph.D. University of Washington',
        desc: 'Invited talk exploring statistical relational AI, neuro-symbolic reasoning, and scalable probabilistic models.',
        buffer: 'The 10-minute gap is retained as a transition/buffer.'
      },
      'd1-s9a': {
        category: 'Oral Track Session',
        badgeClass: 'tag-lavender',
        time: '03:10 PM - 04:40 PM (90 mins)',
        venue: 'Room: A3 - 3103',
        title: 'Track Presentations: AI In the Economy',
        speaker: 'Mr. Sajjid Chinoy (Track Keynote)',
        affiliation: 'Chief India Economist, J.P. Morgan',
        chairs: 'Dr. Alok Ranjan, Dr. Nikhil George, Dr. Divyanshu Jain',
        desc: 'Focusing on AI as a transformative force in labor markets, algorithmic trading, fraud detection, credit scoring, and public resource allocation.',
        schedule: [
          { time: '03:10 PM - 03:40 PM', event: 'Track Keynote: Mr. Sajjid Chinoy (Chief India Economist, J.P. Morgan)' },
          { time: '03:40 PM - 04:40 PM', event: 'Track Oral Paper Presentations' }
        ]
      },
      'd1-s9b': {
        category: 'Oral Track Session',
        badgeClass: 'tag-lavender',
        time: '03:10 PM - 04:40 PM (90 mins)',
        venue: 'Room: A3 - 3102',
        title: 'Track Presentations: AI 4 cities: Enhancing Resilience, Improving Liveability',
        speaker: 'Dr. Nipun Batra (Track Keynote)',
        affiliation: 'Associate Professor of Computer Science, IIT Gandhinagar',
        chairs: 'Dr. Anupam Sobti, Dr. Malini Balakrishnan, Dr. Prashanth Suresh Kumar, Dr. Pankaj Pansari',
        desc: 'Predictive urban management through real-time AI, smart mobility optimization, urban flooding forecasting, and municipal resource planning.',
        schedule: [
          { time: '03:10 PM - 03:40 PM', event: 'Track Keynote: Dr. Nipun Batra (IIT Gandhinagar)' },
          { time: '03:40 PM - 04:40 PM', event: 'Track Oral Paper Presentations' }
        ]
      },
      'd1-s10': {
        category: 'Poster Showcase & High Tea',
        badgeClass: 'tag-pink',
        time: '04:40 PM - 05:40 PM (60 mins)',
        venue: 'Corridor & Foyer Area',
        title: 'High Tea Break / Poster Presentation',
        desc: 'Interactive research posters and discussions with authors across 4 tracks: 1) AI in Healthcare, 2) AI and Logic, 3) AI in the Economy, 4) AI 4 Cities.'
      },
      'd1-s11': {
        category: 'Campus Experience',
        badgeClass: 'tag-green',
        time: '05:40 PM - 06:00 PM (20 mins)',
        venue: 'Plaksha University Campus',
        title: 'Campus Tour',
        desc: 'Guided tour of Plaksha state-of-the-art research laboratories, Makerspace, and sustainable campus architecture.'
      },
      'd1-s12': {
        category: 'Evening Break',
        badgeClass: 'tag-green',
        time: '06:00 PM - 07:15 PM (75 mins)',
        venue: 'Campus Area',
        title: 'Break',
        desc: 'Evening intermission before dinner proceedings.'
      },
      'd1-s13': {
        category: 'Networking Banquet',
        badgeClass: 'tag-green',
        time: '07:15 PM Onwards',
        venue: 'Axis Building Dining Area',
        title: 'Networking Dinner',
        desc: 'Evening dinner banquet connecting delegates, authors, keynote speakers, and academic partners in a relaxed atmosphere.'
      },
      'd2-s1': {
        category: 'Morning Refreshments',
        badgeClass: 'tag-green',
        time: '08:30 AM - 09:00 AM (30 mins)',
        venue: 'A1-005',
        title: 'Refreshments',
        desc: 'Morning tea and coffee at A1-005.'
      },
      'd2-s2': {
        category: 'Opening Remarks',
        badgeClass: 'tag-green',
        time: '09:00 AM - 09:10 AM (10 mins)',
        venue: 'Auditorium',
        title: 'Day 2 Opening Remarks',
        desc: 'Welcome remarks and agenda briefing for Day 2 sessions.'
      },
      'd2-s3': {
        category: 'Plenary Keynote',
        badgeClass: 'tag-green',
        time: '09:10 AM - 10:00 AM (50 mins)',
        venue: 'Auditorium',
        title: 'Keynote Address 2',
        speaker: 'Prof. Sanghamitra Bandyopadhyay',
        affiliation: 'Ex-Director, Indian Statistical Institute (ISI) Kolkata | Padmashree Awardee | Ph.D. ISI',
        desc: 'Distinguished plenary keynote on machine learning, evolutionary computing, and biological data analytics.',
        buffer: 'The 10-minute gap is retained as a transition/buffer.'
      },
      'd2-s4a': {
        category: 'Oral Track Session',
        badgeClass: 'tag-lavender',
        time: '10:10 AM - 11:40 AM (90 mins)',
        venue: 'Room: A3 - 3007',
        title: 'Track Presentations: AI in Sensors',
        chairs: 'Dr. Anil Roy, Dr. Praveen Kumar, Dr. Sandilya Garimella',
        desc: 'Intelligent transducers, sensor hardware-software co-design, edge AI systems, quantum sensors, environmental monitoring, and wearable devices.',
        schedule: [
          { time: '10:00 AM - 10:30 AM', event: 'Track Keynote Presentation' },
          { time: '10:30 AM - 11:30 AM', event: 'Track Oral Paper Presentations' }
        ]
      },
      'd2-s4b': {
        category: 'Oral Track Session',
        badgeClass: 'tag-lavender',
        time: '10:10 AM - 11:40 AM (90 mins)',
        venue: 'Room: A3 - 3009',
        title: 'Track Presentations: Recent Advances in AI',
        desc: 'Frontier foundation models, reasoning techniques, generative AI paradigms, and scalable inference algorithms.',
        schedule: [
          { time: '10:00 AM - 10:30 AM', event: 'Track Keynote Presentation' },
          { time: '10:30 AM - 11:30 AM', event: 'Track Oral Paper Presentations' }
        ]
      },
      'd2-s5': {
        category: 'Refreshment Break',
        badgeClass: 'tag-green',
        time: '11:40 AM - 12:00 PM (20 mins)',
        venue: 'Corridor Area',
        title: 'Tea Break',
        desc: 'Short tea and refreshment break.'
      },
      'd2-s6': {
        category: 'Mentorship',
        badgeClass: 'tag-pink',
        time: '12:00 PM - 01:00 PM (60 mins)',
        venue: 'Discussion Rooms & Library',
        title: 'One-on-One Mentorship Session',
        desc: 'Individual mentoring sessions connecting PhD students and emerging researchers with distinguished faculty, senior professors, and research directors.'
      },
      'd2-s7': {
        category: 'Photo Session',
        badgeClass: 'tag-green',
        time: '01:00 PM - 01:15 PM (15 mins)',
        venue: 'Auditorium Steps',
        title: 'Group Photograph',
        desc: 'Day 2 group photograph session.'
      },
      'd2-s8': {
        category: 'Lunch & Networking',
        badgeClass: 'tag-green',
        time: '01:15 PM - 02:10 PM (55 mins)',
        venue: 'Axis Building Dining Area',
        title: 'Lunch',
        desc: 'Buffet lunch in the Axis Building Dining Area.'
      },
      'd2-s9': {
        category: 'Invited Talk',
        badgeClass: 'tag-green',
        time: '02:10 PM - 03:00 PM (50 mins)',
        venue: 'Auditorium',
        title: 'Invited Speaker Talk 2',
        speaker: 'Dr. Ponnurangam Kumaraguru (PK)',
        affiliation: 'Visiting Scientist, ANRF | Professor of CS, IIIT Hyderabad | Ph.D. Carnegie Mellon University',
        desc: 'Invited lecture exploring computational social science, cybersecurity, privacy-preserving AI, and online social systems.'
      },
      'd2-s10': {
        category: 'Invited Talk',
        badgeClass: 'tag-green',
        time: '03:00 PM - 03:50 PM (50 mins)',
        venue: 'Auditorium',
        title: 'Invited Speaker Talk 3',
        speaker: 'Dr. Manish Gupta',
        affiliation: 'Senior Director, Google DeepMind | Ph.D. University of Illinois Urbana-Champaign',
        desc: 'Invited lecture on next-generation AI foundation models, multimodality, and societal applications.'
      },
      'd2-s11': {
        category: 'Poster Showcase & High Tea',
        badgeClass: 'tag-pink',
        time: '04:00 PM - 05:00 PM (60 mins)',
        venue: 'Auditorium corridor/porch',
        title: 'High Tea Break / Poster Presentation',
        desc: 'Poster presentations across 4 tracks: 1) AI in Sensors, 2) Recent Advances in AI, 3) VLM, 4) Responsible and Ethical AI.'
      },
      'd2-s12': {
        category: 'Plenary Panel',
        badgeClass: 'tag-green',
        time: '05:00 PM - 06:15 PM (75 mins)',
        venue: 'Auditorium',
        title: 'Panel Discussion',
        desc: 'Interactive plenary panel featuring senior leaders exploring key opportunities, governance frameworks, and technological breakthroughs in AI.'
      },
      'd2-s13': {
        category: 'Cultural Showcase',
        badgeClass: 'tag-pink',
        time: '06:30 PM - 07:30 PM (60 mins)',
        venue: 'Multipurpose Hall (MPH)',
        title: 'Plaksha Cultural Event',
        desc: 'Celebration of music, dance, and creative arts presented by student performance clubs of Plaksha University.'
      },
      'd2-s14': {
        category: 'Gala Banquet',
        badgeClass: 'tag-pink',
        time: '07:30 PM Onwards',
        venue: 'Multipurpose Hall (MPH)',
        title: 'Gala Dinner',
        desc: 'Formal conference gala banquet for all registered attendees, dignitaries, authors, and speakers.'
      },
      'd3-s1': {
        category: 'Morning Refreshments',
        badgeClass: 'tag-green',
        time: '08:30 AM - 09:00 AM (30 mins)',
        venue: 'A1-005',
        title: 'Refreshments',
        desc: 'Morning tea and breakfast refreshments.'
      },
      'd3-s2': {
        category: 'Opening Remarks',
        badgeClass: 'tag-green',
        time: '09:00 AM - 09:10 AM (10 mins)',
        venue: 'Auditorium',
        title: 'Day 3 Opening Remarks',
        desc: 'Opening orientation for Day 3 proceedings.'
      },
      'd3-s3': {
        category: 'Plenary Keynote',
        badgeClass: 'tag-green',
        time: '09:10 AM - 10:00 AM (50 mins)',
        venue: 'Auditorium',
        title: 'Keynote Address 3',
        speaker: 'Dr. Balaraman Ravindran',
        affiliation: 'Head, Dept. of Data Science & AI, IIT Madras | Ph.D. University of Massachusetts Amherst',
        desc: 'Plenary keynote on reinforcement learning, graph neural representations, and scalable AI frameworks.'
      },
      'd3-s4': {
        category: 'Oral Track Session',
        badgeClass: 'tag-pink',
        time: '10:00 AM - 11:00 AM (60 mins)',
        venue: 'Room: A3 - 3007',
        title: 'Track Presentations: VLM (Reasoning in Vision Language Models)',
        speaker: 'Vineeth N Balasubramanian (Track Keynote)',
        affiliation: 'Professor of CS, IIT Hyderabad',
        chairs: 'Dr. Pankaj Pansari, Dr. Deepan Muthirayan',
        desc: 'Benchmarking reasoning in VLMs, fine-tuning, test-time scaling, interpretability, and multimodal understanding.',
        schedule: [
          { time: '10:00 AM - 10:30 AM', event: 'Track Keynote: Vineeth N Balasubramanian (IIT Hyderabad)' },
          { time: '10:30 AM - 11:00 AM', event: 'Track Oral Paper Presentations' }
        ]
      },
      'd3-s5': {
        category: 'Oral Track Session',
        badgeClass: 'tag-pink',
        time: '11:00 AM - 12:00 PM (60 mins)',
        venue: 'Room: A3 - 3009',
        title: 'Track Presentations: Responsible and Ethical AI',
        chairs: 'Dr. Rajesh Sharma, Dr. Sachindranath',
        desc: 'Ethical, legal, and sociotechnical dimensions of AI, algorithmic fairness, governance models, epistemic risks, and compliance standards.',
        schedule: [
          { time: '11:00 AM - 12:00 PM', event: 'Track Oral Paper Presentations (11:00 AM - 12:00 PM)' }
        ]
      },
      'd3-s6': {
        category: 'Awards & Recognition',
        badgeClass: 'tag-pink',
        time: '12:00 PM - 12:30 PM (30 mins)',
        venue: 'Auditorium',
        title: 'Award Ceremony',
        desc: 'Presentation of Best Paper Awards across all research tracks, student recognition, and research grant honors.'
      },
      'd3-s7': {
        category: 'Valedictory',
        badgeClass: 'tag-pink',
        time: '12:30 PM - 01:00 PM (30 mins)',
        venue: 'Auditorium',
        title: 'Valedictory & Concluding Remarks',
        desc: 'Closing address, conference summary, vote of thanks, and preview of ConfAI 2027.'
      },
      'd3-s8': {
        category: 'Farewell Lunch',
        badgeClass: 'tag-green',
        time: '01:00 PM - 02:00 PM (60 mins)',
        venue: 'Dining Hall (First Floor)',
        title: 'Lunch',
        desc: 'Farewell lunch buffet for all attendees and guests.'
      },
      'd3-s9': {
        category: 'Local Excursion & Departure',
        badgeClass: 'tag-pink',
        time: '02:00 PM - 06:00 PM',
        venue: 'Departure for Local Tour',
        title: 'Chandigarh Tour & Departure',
        desc: 'Guided tour of Chandigarh landmarks (Rock Garden, Sukhna Lake, Capitol Complex) followed by airport/railway station drop-offs.'
      }
    };

    var modal = document.getElementById("gantt-detail-modal");
    var modalCloseBtn = document.getElementById("modal-close-btn");
    var modalCategoryBadge = document.getElementById("modal-category-badge");
    var modalTimeText = document.getElementById("modal-time-text");
    var modalVenueText = document.getElementById("modal-venue-text");
    var modalSessionTitle = document.getElementById("modal-session-title");
    var modalSpeakerCard = document.getElementById("modal-speaker-card");
    var modalSpeakerName = document.getElementById("modal-speaker-name");
    var modalSpeakerAffil = document.getElementById("modal-speaker-affiliation");
    var modalChairsBox = document.getElementById("modal-chairs-box");
    var modalChairsText = document.getElementById("modal-chairs-text");
    var modalDescText = document.getElementById("modal-description-text");
    var modalScheduleBox = document.getElementById("modal-schedule-box");
    var modalScheduleItems = document.getElementById("modal-schedule-items");
    var modalBufferBox = document.getElementById("modal-buffer-box");
    var modalBufferText = document.getElementById("modal-buffer-text");

    function openModal(sessionData) {
      if (!modal || !sessionData) return;

      modalCategoryBadge.textContent = sessionData.category || "Conference Session";
      modalTimeText.textContent = sessionData.time || "";
      modalVenueText.textContent = sessionData.venue ? "Venue: " + sessionData.venue : "";
      modalSessionTitle.textContent = sessionData.title || "";
      modalDescText.textContent = sessionData.desc || "";

      // Speaker
      if (sessionData.speaker) {
        modalSpeakerCard.hidden = false;
        modalSpeakerName.textContent = sessionData.speaker;
        modalSpeakerAffil.textContent = sessionData.affiliation || "";
      } else {
        modalSpeakerCard.hidden = true;
      }

      // Track Chairs
      if (sessionData.chairs) {
        modalChairsBox.hidden = false;
        modalChairsText.textContent = sessionData.chairs;
      } else {
        modalChairsBox.hidden = true;
      }

      // Sub-schedule
      if (sessionData.schedule && sessionData.schedule.length > 0) {
        modalScheduleBox.hidden = false;
        modalScheduleItems.innerHTML = "";
        sessionData.schedule.forEach(function (item) {
          var itemDiv = document.createElement("div");
          itemDiv.className = "modal-schedule-item-row";
          itemDiv.innerHTML = "<span class='modal-sub-time'>" + item.time + "</span><span class='modal-sub-event'>" + item.event + "</span>";
          modalScheduleItems.appendChild(itemDiv);
        });
      } else {
        modalScheduleBox.hidden = true;
      }

      // Buffer
      if (sessionData.buffer) {
        modalBufferBox.hidden = false;
        modalBufferText.textContent = sessionData.buffer;
      } else {
        modalBufferBox.hidden = true;
      }

      modal.hidden = false;
      setTimeout(function () {
        modal.classList.add("is-open");
      }, 10);
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove("is-open");
      setTimeout(function () {
        modal.hidden = true;
        document.body.style.overflow = "";
      }, 220);
    }

    // Attach click listeners to all session bars
    var bars = document.querySelectorAll(".gantt-bar");
    bars.forEach(function (bar) {
      bar.addEventListener("click", function () {
        var sid = bar.getAttribute("data-session-id");
        if (sid && sessionsDb[sid]) {
          openModal(sessionsDb[sid]);
        }
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }

    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && !modal.hidden) {
        closeModal();
      }
    });

    // Day Tabs Filtering
    var dayButtons = document.querySelectorAll(".gantt-day-btn");
    var daySections = document.querySelectorAll(".gantt-section-block");

    dayButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var day = btn.getAttribute("data-day");
        dayButtons.forEach(function (b) {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });

        daySections.forEach(function (sec) {
          var secDay = sec.getAttribute("data-gantt-day");
          if (day === "all" || day === secDay) {
            sec.classList.remove("is-hidden");
          } else {
            sec.classList.add("is-hidden");
          }
        });
      });
    });

    // Live Search
    var searchInput = document.getElementById("gantt-search-input");
    var clearSearchBtn = document.getElementById("gantt-search-clear");

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.hidden = (q.length === 0);
        }

        bars.forEach(function (bar) {
          var sid = bar.getAttribute("data-session-id");
          var sData = sessionsDb[sid];
          if (!sData) return;

          if (q.length === 0) {
            bar.classList.remove("is-highlighted", "is-dimmed");
            return;
          }

          var haystack = (sData.title + " " + (sData.speaker || "") + " " + (sData.venue || "") + " " + (sData.chairs || "") + " " + (sData.affiliation || "") + " " + sData.desc).toLowerCase();
          if (haystack.indexOf(q) !== -1) {
            bar.classList.add("is-highlighted");
            bar.classList.remove("is-dimmed");
          } else {
            bar.classList.remove("is-highlighted");
            bar.classList.add("is-dimmed");
          }
        });
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", function () {
        if (searchInput) {
          searchInput.value = "";
          searchInput.dispatchEvent(new Event("input"));
          searchInput.focus();
        }
      });
    }

  })();

})();



/* ==========================================================================
   CONFAI 2026 - SHARP TIMETABLE INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.sharp-tab-btn');
  const daySections = document.querySelectorAll('.sharp-day-section');
  const searchInput = document.getElementById('sharp-search-input');
  const clearButton = document.getElementById('sharp-search-clear');
  const noResultsBox = document.getElementById('sharp-no-results');
  const allRows = document.querySelectorAll('.sharp-row');

  if (!tabButtons.length || !daySections.length) {
    return; // Not on sharp timetable page
  }

  let currentDay = 'all';

  // Day Filter Tabs
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      currentDay = btn.getAttribute('data-day');
      applyFilters();
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim().length > 0) {
        if (clearButton) clearButton.style.display = 'block';
      } else {
        if (clearButton) clearButton.style.display = 'none';
      }
      applyFilters();
    });
  }

  // Clear Search Handler
  if (clearButton && searchInput) {
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      clearButton.style.display = 'none';
      searchInput.focus();
      applyFilters();
    });
  }

  // Filter function
  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let totalVisibleRows = 0;

    daySections.forEach((section) => {
      const sectionDay = section.getAttribute('data-day');
      const matchesDay = (currentDay === 'all' || currentDay === sectionDay);

      if (!matchesDay) {
        section.classList.add('is-hidden');
        return;
      }

      let visibleInThisSection = 0;
      const rows = section.querySelectorAll('.sharp-row');
      rows.forEach((row) => {
        const searchData = (row.getAttribute('data-search') || '').toLowerCase();
        const rowText = row.textContent.toLowerCase();

        const matchesQuery = !query || searchData.includes(query) || rowText.includes(query);

        if (matchesQuery) {
          row.classList.remove('is-hidden');
          visibleInThisSection++;
          totalVisibleRows++;
        } else {
          row.classList.add('is-hidden');
        }
      });

      if (visibleInThisSection > 0) {
        section.classList.remove('is-hidden');
      } else {
        section.classList.add('is-hidden');
      }
    });

    if (noResultsBox) {
      if (totalVisibleRows === 0) {
        noResultsBox.style.display = 'block';
      } else {
        noResultsBox.style.display = 'none';
      }
    }
  }
});


/* ==========================================================================
   CONFAI 2026 - POSTER HERO DYNAMIC BACKGROUND SLIDESHOW CONTROLLER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.poster-slide');
  if (!slides.length) return;

  let currentSlideIndex = 0;
  const slideIntervalMs = 7000; // 7 seconds per slide for calm, elegant transitions

  function nextSlide() {
    slides[currentSlideIndex].classList.remove('is-active');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add('is-active');
  }

  // Start continuous smooth crossfade slideshow
  let slideshowTimer = setInterval(nextSlide, slideIntervalMs);

  // Pause on tab unfocus to conserve resources, resume on focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(slideshowTimer);
    } else {
      slideshowTimer = setInterval(nextSlide, slideIntervalMs);
    }
  });
});


/* ==========================================================================
   CONFAI 2026 - TWO-LAYER HERO SLIDESHOW CONTROLLER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const photoSlides = document.querySelectorAll('.hero-photo-showcase .photo-slide');
  if (!photoSlides.length) return;

  let currentSlide = 0;
  const slideInterval = 7500; // 7.5 seconds per slide for calm, smooth transitions

  function advanceSlide() {
    photoSlides[currentSlide].classList.remove('is-active');
    currentSlide = (currentSlide + 1) % photoSlides.length;
    photoSlides[currentSlide].classList.add('is-active');
  }

  let timer = setInterval(advanceSlide, slideInterval);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      timer = setInterval(advanceSlide, slideInterval);
    }
  });
});


/* ==========================================================================
   CONFAI 2026 - SINGLE FULL-WIDTH PHOTO SLIDESHOW CONTROLLER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const singleSlides = document.querySelectorAll('.hero-photo-showcase .photo-slide');
  if (!singleSlides.length) return;

  let slideIdx = 0;
  const slideDuration = 6500; // 6.5s smooth continuous slideshow

  function transitionSlide() {
    singleSlides[slideIdx].classList.remove('is-active');
    slideIdx = (slideIdx + 1) % singleSlides.length;
    singleSlides[slideIdx].classList.add('is-active');
  }

  let singleSlideTimer = setInterval(transitionSlide, slideDuration);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(singleSlideTimer);
    } else {
      singleSlideTimer = setInterval(transitionSlide, slideDuration);
    }
  });
});


/* ==========================================================================
   CONFAI 2026 - ORGANIC NEURAL NETWORK TRANSITION ANIMATOR
   Luminous visual bridge between cinematic hero video and off-white section
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('neural-transition-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var hero = document.getElementById('hero') || canvas.closest('.cinema-video-hero') || document.body;
  var nodes = [];
  var connections = [];
  var dataSignals = [];
  var animationFrameId = null;
  var isRunning = true;
  var width = 0;
  var height = 0;
  var dpr = window.devicePixelRatio || 1;

  // Plaksha Teal Brand Colors
  var TEAL_R = 0;
  var TEAL_G = 120;
  var TEAL_B = 120;

  // Interactive Cursor Tracking
  var mouse = {
    x: -9999,
    y: -9999,
    radius: 140,
    active: false
  };

  function updateMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }

  function clearMousePosition() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  if (hero) {
    hero.addEventListener('mousemove', updateMousePosition, { passive: true });
    hero.addEventListener('mouseleave', clearMousePosition, { passive: true });
    hero.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches.length > 0) {
        updateMousePosition(e.touches[0]);
      }
    }, { passive: true });
    hero.addEventListener('touchend', clearMousePosition, { passive: true });
  }

  // Calculate SVG curve Y position at given X coordinate
  function getCurveY(x) {
    var isMobile = width <= 640;
    var svgH = isMobile ? 28 : 48;
    var bottomOffset = isMobile ? 60 : 90;
    var u = Math.max(0, Math.min(1, x / width));
    // Cubic bezier matching SVG curve: M0,0 C480,48 960,48 1440,0
    var curveDepth = svgH * 0.75 * 4 * u * (1 - u);
    return (height - bottomOffset - svgH) + curveDepth;
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    var isMobile = width <= 640;
    height = rect.height || (isMobile ? 220 : 310);
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    initNetwork();
  }

  function initNetwork() {
    nodes = [];
    connections = [];
    dataSignals = [];

    var isMobile = width <= 640;
    // Sparse, refined node density
    var nodeCount = isMobile ? Math.max(16, Math.min(22, Math.floor(width / 34))) : Math.max(22, Math.min(34, Math.floor(width / 44)));

    // 1. Generate Nodes flowing organically across and below the boundary curve
    for (var i = 0; i < nodeCount; i++) {
      var normI = i / (nodeCount - 1);
      var jitter = (Math.random() - 0.5) * (width / nodeCount) * 1.35;
      var x = Math.max(20, Math.min(width - 20, normI * width + jitter));
      var curveAtX = getCurveY(x);

      var normX = x / width;
      var centerFactor = Math.sin(Math.PI * normX); // 0 at edges, 1 in center

      // Vertical distribution smoothly spanning both sides of the curve without bounding
      var randPos = Math.random();
      var yOffset;
      if (randPos < 0.42) {
        // Above curve in dark hero video (-95px to -16px)
        yOffset = -16 - Math.random() * 75 * (0.65 + 0.35 * centerFactor);
      } else if (randPos < 0.70) {
        // Straddling right across the boundary line (-16px to +16px)
        yOffset = -16 + Math.random() * 32;
      } else {
        // Flowing below boundary into off-white section (+16px to +72px)
        yOffset = 16 + Math.random() * 56 * (0.65 + 0.35 * centerFactor);
      }

      var y = Math.max(16, Math.min(height - 16, curveAtX + yOffset));
      var isMain = Math.random() < 0.32;
      // Refined micro-nodes: delicate, sleek dots
      var baseRadius = isMain ? (2.2 + Math.random() * 0.8) : (1.1 + Math.random() * 0.6);

      nodes.push({
        id: i,
        x: x,
        y: y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.06,
        radius: baseRadius,
        isMain: isMain,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.007 + Math.random() * 0.010,
        baseAlpha: isMain ? (0.75 + Math.random() * 0.20) : (0.55 + Math.random() * 0.25),
        neighborIds: []
      });
    }

    // 2. Build Sparse, Organic Connections
    var maxDist = isMobile ? 85 : 125;
    for (var a = 0; a < nodes.length; a++) {
      var nodeA = nodes[a];
      var candidates = [];

      for (var b = a + 1; b < nodes.length; b++) {
        var nodeB = nodes[b];
        var dx = nodeA.x - nodeB.x;
        var dy = nodeA.y - nodeB.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          candidates.push({ nodeIndex: b, dist: dist });
        }
      }

      // Sort by proximity and keep at most 3 connections per node for sparse elegance
      candidates.sort(function (p1, p2) { return p1.dist - p2.dist; });
      var maxConnForNode = nodeA.isMain ? 3 : 2;
      var connCount = 0;

      for (var c = 0; c < candidates.length && connCount < maxConnForNode; c++) {
        var bIdx = candidates[c].nodeIndex;
        var nodeB = nodes[bIdx];

        if (nodeB.neighborIds.length < (nodeB.isMain ? 4 : 3)) {
          nodeA.neighborIds.push(bIdx);
          nodeB.neighborIds.push(a);

          connections.push({
            nodeAIndex: a,
            nodeBIndex: bIdx,
            maxDist: maxDist,
            activeSignal: false
          });
          connCount++;
        }
      }
    }

    // 3. Initialize Data-Flow Packets
    var signalCount = isMobile ? 2 : (connections.length > 8 ? 4 : 3);
    for (var s = 0; s < signalCount && connections.length > 0; s++) {
      var randConnIdx = Math.floor(Math.random() * connections.length);
      dataSignals.push({
        connIndex: randConnIdx,
        progress: Math.random(),
        speed: 0.0028 + Math.random() * 0.0035,
        direction: Math.random() < 0.5 ? 1 : -1,
        size: 1.1 + Math.random() * 0.5
      });
    }
  }

  function render(time) {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Update Physics & Force Field
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.pulsePhase += n.pulseSpeed;

      // Soft elastic spring to anchor position
      var dxOrigin = n.originX - n.x;
      var dyOrigin = n.originY - n.y;
      n.vx += dxOrigin * 0.0010;
      n.vy += dyOrigin * 0.0010;

      // Interactive Cursor Force Field
      if (mouse.active) {
        var dxMouse = n.x - mouse.x;
        var dyMouse = n.y - mouse.y;
        var distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius && distMouse > 0) {
          var force = (1 - distMouse / mouse.radius) * 1.3;
          n.vx += (dxMouse / distMouse) * force;
          n.vy += (dyMouse / distMouse) * force;
        }
      }

      // Velocity damping & movement
      n.vx *= 0.96;
      n.vy *= 0.96;
      n.x += n.vx;
      n.y += n.vy;
    }

    // Reset connection active signal states
    for (var ci = 0; ci < connections.length; ci++) {
      connections[ci].activeSignal = false;
    }
    for (var si = 0; si < dataSignals.length; si++) {
      if (dataSignals[si].connIndex < connections.length) {
        connections[dataSignals[si].connIndex].activeSignal = true;
      }
    }

    // 2. Draw Connecting Neural Lines with Delicate, Clean Strokes
    for (var c = 0; c < connections.length; c++) {
      var conn = connections[c];
      var nodeA = nodes[conn.nodeAIndex];
      var nodeB = nodes[conn.nodeBIndex];

      var dx = nodeA.x - nodeB.x;
      var dy = nodeA.y - nodeB.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < conn.maxDist) {
        var distFactor = 1 - (dist / conn.maxDist);
        var midX = (nodeA.x + nodeB.x) / 2;
        var edgeTaper = Math.sin(Math.PI * Math.max(0, Math.min(1, midX / width)));
        var signalBoost = conn.activeSignal ? 0.35 : 0;
        var lineAlpha = Math.min(1.0, distFactor * edgeTaper * (0.65 + signalBoost));

        if (lineAlpha > 0.03) {
          var midY = (nodeA.y + nodeB.y) / 2;
          var curveAtMid = getCurveY(midX);
          var onLightSide = midY > curveAtMid;

          // If active signal, draw subtle outer glow line
          if (conn.activeSignal) {
            ctx.beginPath();
            ctx.lineWidth = 2.0;
            ctx.strokeStyle = onLightSide
              ? 'rgba(0, 120, 120, ' + (lineAlpha * 0.22).toFixed(3) + ')'
              : 'rgba(0, 210, 210, ' + (lineAlpha * 0.28).toFixed(3) + ')';
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }

          // Crisp delicate connection line
          ctx.beginPath();
          ctx.lineWidth = conn.activeSignal ? 1.2 : 0.8;
          ctx.strokeStyle = onLightSide
            ? 'rgba(0, 105, 105, ' + (lineAlpha * 0.40).toFixed(3) + ')'
            : 'rgba(0, 200, 200, ' + (lineAlpha * 0.50).toFixed(3) + ')';
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();
        }
      }
    }

    // 3. Draw and Advance Data-Flow Pulses
    for (var s = 0; s < dataSignals.length; s++) {
      var sig = dataSignals[s];
      if (sig.connIndex >= connections.length) continue;

      var sigConn = connections[sig.connIndex];
      var fromNode = sig.direction === 1 ? nodes[sigConn.nodeAIndex] : nodes[sigConn.nodeBIndex];
      var toNode = sig.direction === 1 ? nodes[sigConn.nodeBIndex] : nodes[sigConn.nodeAIndex];

      sig.progress += sig.speed;
      if (sig.progress >= 1.0) {
        sig.progress = 0;
        var targetNode = toNode;
        if (targetNode.neighborIds && targetNode.neighborIds.length > 0) {
          var nextNeighbor = targetNode.neighborIds[Math.floor(Math.random() * targetNode.neighborIds.length)];
          var foundConn = false;
          for (var cj = 0; cj < connections.length; cj++) {
            var cand = connections[cj];
            if ((cand.nodeAIndex === targetNode.id && cand.nodeBIndex === nextNeighbor) ||
              (cand.nodeBIndex === targetNode.id && cand.nodeAIndex === nextNeighbor)) {
              sig.connIndex = cj;
              sig.direction = (cand.nodeAIndex === targetNode.id) ? 1 : -1;
              foundConn = true;
              break;
            }
          }
          if (!foundConn) {
            sig.connIndex = Math.floor(Math.random() * connections.length);
          }
        } else {
          sig.connIndex = Math.floor(Math.random() * connections.length);
        }
        continue;
      }

      var sigX = fromNode.x + (toNode.x - fromNode.x) * sig.progress;
      var sigY = fromNode.y + (toNode.y - fromNode.y) * sig.progress;
      var sigCurveY = getCurveY(sigX);
      var sigOnLight = sigY > sigCurveY;

      // Packet Outer Soft Glow
      ctx.beginPath();
      ctx.arc(sigX, sigY, sig.size * 2.0, 0, Math.PI * 2);
      ctx.fillStyle = sigOnLight
        ? 'rgba(0, 140, 140, 0.35)'
        : 'rgba(0, 220, 220, 0.45)';
      ctx.fill();

      // Packet Bright Core
      ctx.beginPath();
      ctx.arc(sigX, sigY, sig.size * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = sigOnLight ? '#007878' : '#FFFFFF';
      ctx.fill();
    }

    // 4. Draw Nodes with Sleek, Minimalist Micro-Aesthetic (No Oversized Concentric Rings)
    for (var k = 0; k < nodes.length; k++) {
      var node = nodes[k];
      var pulse = Math.sin(node.pulsePhase);
      var curveY = getCurveY(node.x);
      var diffY = node.y - curveY;
      var onLightSide = diffY > 0;
      var edgeFade = Math.sin(Math.PI * Math.max(0, Math.min(1, node.x / width)));

      // Gently fade out nodes as they flow deeper into the numbers section
      var verticalFade = 1.0;
      if (diffY > 15) {
        verticalFade = Math.max(0.12, Math.min(1.0, 1.0 - (diffY - 15) / 80));
      }

      var nodeAlpha = Math.max(0.20, Math.min(0.95, (node.baseAlpha + pulse * 0.12) * edgeFade * verticalFade));
      var drawRadius = Math.max(1.1, node.radius + pulse * (node.isMain ? 0.35 : 0.20));

      if (onLightSide) {
        // ── In Off-White Numbers Section (Clean, subtle teal micro-node) ──
        if (node.isMain) {
          // Soft subtle teal aura (no white rings)
          var aura = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, drawRadius * 2.2);
          aura.addColorStop(0, 'rgba(0, 130, 130, ' + (nodeAlpha * 0.18).toFixed(3) + ')');
          aura.addColorStop(1, 'rgba(0, 130, 130, 0)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, drawRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = aura;
          ctx.fill();
        }

        // Crisp solid teal body
        ctx.beginPath();
        ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 105, 105, ' + (nodeAlpha * 0.88).toFixed(3) + ')';
        ctx.fill();

        // Subtle micro center dot for main nodes
        if (node.isMain) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(0.7, drawRadius * 0.40), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(242, 240, 236, ' + (nodeAlpha * 0.95).toFixed(3) + ')';
          ctx.fill();
        }
      } else {
        // ── In Dark Hero Video Background (Luminous cyan/teal micro-node) ──
        if (node.isMain) {
          // Single subtle bloom (no oversized rings)
          var bloom = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, drawRadius * 2.2);
          bloom.addColorStop(0, 'rgba(0, 220, 220, ' + (nodeAlpha * 0.35).toFixed(3) + ')');
          bloom.addColorStop(1, 'rgba(0, 160, 160, 0)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, drawRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = bloom;
          ctx.fill();
        }

        // Vibrant cyan/teal body
        ctx.beginPath();
        ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 195, 195, ' + (nodeAlpha * 0.95).toFixed(3) + ')';
        ctx.fill();

        // Small white pinpoint
        if (node.isMain) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(0.7, drawRadius * 0.42), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (nodeAlpha * 0.95).toFixed(3) + ')';
          ctx.fill();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Handle Reduced Motion preferences
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    resizeCanvas();
    render();
    isRunning = false;
    return;
  }

  window.addEventListener('resize', function () {
    resizeCanvas();
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    }
  });

  resizeCanvas();
  animationFrameId = requestAnimationFrame(render);
});


/* ══════════════════════════════════════════════════════════════════════════
   CONFAI 2026 - SECTION SIDE NEURAL-NETWORK FRAMING
   Fine, subtle neural network framing the far left and right edges
   (Speakers & Technical Programme Committee sections)
   ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  function setupSectionSideNeural(canvasId, sectionSelector) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var section = canvas.closest(sectionSelector);
    if (!section) return;

    var nodes = [];
    var connections = [];
    var dataSignals = [];
    var animationFrameId = null;
    var isRunning = false;
    var width = 0;
    var height = 0;
    var dpr = window.devicePixelRatio || 1;

    var TEAL_R = 0;
    var TEAL_G = 120;
    var TEAL_B = 120;

    function resizeCanvas() {
      var rect = section.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || 500;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      initSideNetwork();
    }

    function initSideNetwork() {
      nodes = [];
      connections = [];
      dataSignals = [];

      if (width < 768) {
        // On mobile, keep completely clear or very minimal
        return;
      }

      var contentMax = 1320;
      var containerWidth = Math.min(width - 48, contentMax);
      var sideGutter = Math.max(0, (width - containerWidth) / 2);
      var sideBandWidth = Math.max(90, sideGutter + 40);

      var nodesPerSide = width >= 1200 ? 12 : 8;

      function createSideCluster(isLeft) {
        var startIdx = nodes.length;
        var minX = isLeft ? 16 : (width - sideBandWidth + 12);
        var maxX = isLeft ? (sideBandWidth - 12) : (width - 16);

        for (var i = 0; i < nodesPerSide; i++) {
          var normY = (i + 0.5) / nodesPerSide;
          var y = normY * height + (Math.random() - 0.5) * (height / nodesPerSide) * 0.8;
          y = Math.max(25, Math.min(height - 25, y));

          var x = minX + Math.random() * (maxX - minX);
          var isMain = Math.random() < 0.35;
          var radius = isMain ? (2.2 + Math.random() * 1.2) : (1.2 + Math.random() * 0.8);

          nodes.push({
            id: nodes.length,
            isLeft: isLeft,
            x: x,
            y: y,
            originX: x,
            originY: y,
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.08,
            radius: radius,
            isMain: isMain,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.007 + Math.random() * 0.010,
            baseAlpha: isMain ? (0.65 + Math.random() * 0.25) : (0.40 + Math.random() * 0.25),
            neighborIds: []
          });
        }

        var maxDist = 140;
        for (var a = startIdx; a < nodes.length; a++) {
          var nodeA = nodes[a];
          var count = 0;
          for (var b = a + 1; b < nodes.length; b++) {
            var nodeB = nodes[b];
            var dx = nodeA.x - nodeB.x;
            var dy = nodeA.y - nodeB.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist && count < 3 && nodeB.neighborIds.length < 3) {
              nodeA.neighborIds.push(b);
              nodeB.neighborIds.push(a);
              connections.push({
                nodeAIndex: a,
                nodeBIndex: b,
                maxDist: maxDist
              });
              count++;
            }
          }
        }
      }

      createSideCluster(true);
      createSideCluster(false);

      var signalCount = connections.length > 8 ? 4 : 2;
      for (var s = 0; s < signalCount; s++) {
        dataSignals.push({
          connIndex: Math.floor(Math.random() * connections.length),
          progress: Math.random(),
          speed: 0.0028 + Math.random() * 0.0035,
          direction: Math.random() < 0.5 ? 1 : -1,
          size: 1.4 + Math.random() * 0.8
        });
      }
    }

    function renderSideNetwork() {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      if (nodes.length === 0) {
        animationFrameId = requestAnimationFrame(renderSideNetwork);
        return;
      }

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.pulsePhase += n.pulseSpeed;

        var dx = n.originX - n.x;
        var dy = n.originY - n.y;
        n.vx += dx * 0.0008;
        n.vy += dy * 0.0008;
        n.vx *= 0.97;
        n.vy *= 0.97;
        n.x += n.vx;
        n.y += n.vy;
      }

      for (var c = 0; c < connections.length; c++) {
        var conn = connections[c];
        var nodeA = nodes[conn.nodeAIndex];
        var nodeB = nodes[conn.nodeBIndex];

        var dx = nodeA.x - nodeB.x;
        var dy = nodeA.y - nodeB.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < conn.maxDist) {
          var distFactor = 1 - (dist / conn.maxDist);
          var midY = (nodeA.y + nodeB.y) / 2;
          var vertFade = Math.sin(Math.PI * Math.max(0.05, Math.min(0.95, midY / height)));
          var lineAlpha = distFactor * vertFade * 0.45;

          if (lineAlpha > 0.02) {
            ctx.beginPath();
            ctx.lineWidth = 0.75;
            ctx.strokeStyle = 'rgba(' + TEAL_R + ',' + TEAL_G + ',' + TEAL_B + ',' + lineAlpha.toFixed(3) + ')';
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      for (var s = 0; s < dataSignals.length; s++) {
        var sig = dataSignals[s];
        if (sig.connIndex >= connections.length) continue;

        var sigConn = connections[sig.connIndex];
        var fromNode = sig.direction === 1 ? nodes[sigConn.nodeAIndex] : nodes[sigConn.nodeBIndex];
        var toNode = sig.direction === 1 ? nodes[sigConn.nodeBIndex] : nodes[sigConn.nodeAIndex];

        sig.progress += sig.speed;
        if (sig.progress >= 1.0) {
          sig.progress = 0;
          sig.connIndex = Math.floor(Math.random() * connections.length);
          continue;
        }

        var sigX = fromNode.x + (toNode.x - fromNode.x) * sig.progress;
        var sigY = fromNode.y + (toNode.y - fromNode.y) * sig.progress;

        ctx.beginPath();
        ctx.arc(sigX, sigY, sig.size * 2.0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 160, 160, 0.40)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sigX, sigY, sig.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      // 4. Draw Small Fine Nodes
      for (var k = 0; k < nodes.length; k++) {
        var node = nodes[k];
        var pulse = Math.sin(node.pulsePhase);
        var vertFade = Math.sin(Math.PI * Math.max(0.05, Math.min(0.95, node.y / height)));
        var nodeAlpha = Math.max(0.15, Math.min(0.85, (node.baseAlpha + pulse * 0.15) * vertFade));
        var drawRadius = Math.max(1.0, node.radius + pulse * 0.3);

        if (node.isMain) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, drawRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + TEAL_R + ',' + TEAL_G + ',' + TEAL_B + ',' + (nodeAlpha * 0.28).toFixed(3) + ')';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + TEAL_R + ',' + TEAL_G + ',' + TEAL_B + ',' + nodeAlpha.toFixed(3) + ')';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(0.7, drawRadius * 0.42), 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + TEAL_R + ',' + TEAL_G + ',' + TEAL_B + ',' + (nodeAlpha * 0.85).toFixed(3) + ')';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(renderSideNetwork);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            canvas.classList.add('is-visible');
            if (!isRunning) {
              isRunning = true;
              resizeCanvas();
              animationFrameId = requestAnimationFrame(renderSideNetwork);
            }
          } else {
            if (isRunning) {
              isRunning = false;
              if (animationFrameId) cancelAnimationFrame(animationFrameId);
            }
          }
        });
      }, { threshold: 0.1 });

      observer.observe(section);
    } else {
      canvas.classList.add('is-visible');
      isRunning = true;
      resizeCanvas();
      animationFrameId = requestAnimationFrame(renderSideNetwork);
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      resizeCanvas();
      renderSideNetwork();
      isRunning = false;
      return;
    }

    window.addEventListener('resize', function () {
      if (isRunning) resizeCanvas();
    }, { passive: true });
  }

  setupSectionSideNeural('speakers-neural-canvas', '.section-speakers');
  setupSectionSideNeural('tpc-neural-canvas', '.section-tpc');
});

/* ══════════════════════════════════════════════════════════════════════════
   Conference Tracks Radial Diagram Scroll-Trigger & Precision Connectors
   ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  var tracksContainer = document.getElementById('radial-tracks-container');
  var section = document.getElementById('tracks-diagram');
  if (!tracksContainer || !section) return;

  var svg = tracksContainer.querySelector('.radial-spokes');
  var hub = tracksContainer.querySelector('.radial-hub');

  function updateRadialSpokes() {
    if (!tracksContainer || !svg || !hub) return;
    if (window.getComputedStyle(svg).display === 'none') return;

    var cRect = tracksContainer.getBoundingClientRect();
    var hRect = hub.getBoundingClientRect();
    if (cRect.width === 0 || hRect.width === 0) return;

    var cx = (hRect.left - cRect.left) + hRect.width / 2;
    var cy = (hRect.top - cRect.top) + hRect.height / 2;
    var hubRadius = hRect.width / 2;
    var GAP = 3; // Crisp 3px clearance at the card perimeter

    svg.setAttribute('viewBox', '0 0 ' + Math.round(cRect.width) + ' ' + Math.round(cRect.height));

    for (var i = 1; i <= 8; i++) {
      var track = tracksContainer.querySelector('.track-pos-' + i);
      var spoke = document.getElementById('radial-spoke-' + i);
      var hubNode = document.getElementById('radial-hub-node-' + i);
      var cardNode = document.getElementById('radial-card-node-' + i);
      if (!track || !spoke) continue;

      var btn = track.querySelector('.track-node') || track;
      var bRect = btn.getBoundingClientRect();
      var bxMin = bRect.left - cRect.left;
      var bxMax = bRect.right - cRect.left;
      var byMin = bRect.top - cRect.top;
      var byMax = bRect.bottom - cRect.top;
      var bx = (bxMin + bxMax) / 2;
      var by = (byMin + byMax) / 2;

      var angle = Math.atan2(by - cy, bx - cx);
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);

      // Start line precisely at hub perimeter circle
      var x1 = cx + (hubRadius + 1) * cos;
      var y1 = cy + (hubRadius + 1) * sin;

      // Mathematical ray-AABB intersection with expanded card boundary [boxL, boxR] x [boxT, boxB]
      var boxL = bxMin - GAP;
      var boxR = bxMax + GAP;
      var boxT = byMin - GAP;
      var boxB = byMax + GAP;

      var candidates = [];
      if (Math.abs(cos) > 1e-6) {
        var targetX = cos > 0 ? boxL : boxR;
        var tX = (targetX - cx) / cos;
        if (tX > hubRadius) {
          var yHit = cy + tX * sin;
          if (yHit >= boxT - 1 && yHit <= boxB + 1) {
            candidates.push({ t: tX, x: targetX, y: yHit });
          }
        }
      }

      if (Math.abs(sin) > 1e-6) {
        var targetY = sin > 0 ? boxT : boxB;
        var tY = (targetY - cy) / sin;
        if (tY > hubRadius) {
          var xHit = cx + tY * cos;
          if (xHit >= boxL - 1 && xHit <= boxR + 1) {
            candidates.push({ t: tY, x: xHit, y: targetY });
          }
        }
      }

      var x2, y2;
      if (candidates.length > 0) {
        candidates.sort(function (a, b) { return a.t - b.t; });
        x2 = candidates[0].x;
        y2 = candidates[0].y;
      } else {
        x2 = bx;
        y2 = by;
      }

      spoke.setAttribute('x1', x1.toFixed(1));
      spoke.setAttribute('y1', y1.toFixed(1));
      spoke.setAttribute('x2', x2.toFixed(1));
      spoke.setAttribute('y2', y2.toFixed(1));

      if (hubNode) {
        hubNode.setAttribute('cx', x1.toFixed(1));
        hubNode.setAttribute('cy', y1.toFixed(1));
      }

      if (cardNode) {
        cardNode.setAttribute('cx', x2.toFixed(1));
        cardNode.setAttribute('cy', y2.toFixed(1));
      }
    }
  }

  // Initial calculation + resize listener with debounce
  var resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateRadialSpokes, 25);
  }

  updateRadialSpokes();
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('load', updateRadialSpokes);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateRadialSpokes);
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    tracksContainer.classList.add('has-animation');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            updateRadialSpokes();
            tracksContainer.classList.add('is-animated');
            obs.unobserve(section);
          }
        });
      }, { threshold: 0.15 });

      observer.observe(section);
    } else {
      tracksContainer.classList.add('is-animated');
    }
  }

  // Interactive connector highlight
  var trackButtons = tracksContainer.querySelectorAll('.track-node');
  trackButtons.forEach(function (btn) {
    var num = btn.getAttribute('data-track-num');
    var spoke = document.getElementById('radial-spoke-' + num);
    var hubNode = document.getElementById('radial-hub-node-' + num);
    var cardNode = document.getElementById('radial-card-node-' + num);

    btn.addEventListener('mouseenter', function () {
      if (spoke) {
        spoke.style.stroke = 'var(--color-teal, #007878)';
        spoke.style.strokeWidth = '2.25px';
        spoke.style.strokeOpacity = '1';
      }
      if (hubNode) {
        hubNode.style.opacity = '1';
        hubNode.setAttribute('r', '3.5');
      }
      if (cardNode) {
        cardNode.style.opacity = '1';
        cardNode.setAttribute('r', '3.5');
      }
    });

    btn.addEventListener('mouseleave', function () {
      if (spoke) {
        spoke.style.stroke = '';
        spoke.style.strokeWidth = '';
        spoke.style.strokeOpacity = '';
      }
      if (hubNode) {
        hubNode.style.opacity = '';
        hubNode.setAttribute('r', '3');
      }
      if (cardNode) {
        cardNode.style.opacity = '';
        cardNode.setAttribute('r', '2.5');
      }
    });
  });

  // Center Hub hover: network illumination
  if (hub) {
    hub.addEventListener('mouseenter', function () {
      for (var k = 1; k <= 8; k++) {
        var spk = document.getElementById('radial-spoke-' + k);
        var hn = document.getElementById('radial-hub-node-' + k);
        var cn = document.getElementById('radial-card-node-' + k);
        if (spk) {
          spk.style.stroke = 'var(--color-teal, #007878)';
          spk.style.strokeOpacity = '0.65';
          spk.style.strokeWidth = '1.75px';
        }
        if (hn) hn.style.opacity = '1';
        if (cn) cn.style.opacity = '1';
      }
    });

    hub.addEventListener('mouseleave', function () {
      for (var k = 1; k <= 8; k++) {
        var spk = document.getElementById('radial-spoke-' + k);
        var hn = document.getElementById('radial-hub-node-' + k);
        var cn = document.getElementById('radial-card-node-' + k);
        if (spk) {
          spk.style.stroke = '';
          spk.style.strokeOpacity = '';
          spk.style.strokeWidth = '';
        }
        if (hn) hn.style.opacity = '';
        if (cn) cn.style.opacity = '';
      }
    });
  }
});

/* ── Announcement Ticker Banner Click-to-Card Handler ──────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  var tickerBar = document.querySelector('.announcement-ticker-bar');
  var phdCard = document.getElementById('phd-aspirants');

  if (!tickerBar || !phdCard) return;

  function scrollToPhdCard(e) {
    // If the click is on or inside the 'here' button, let it navigate to external link
    if (e.target.closest('.ticker-link')) {
      return;
    }
    e.preventDefault();
    phdCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    phdCard.classList.add('is-highlighted');
    setTimeout(function () {
      phdCard.classList.remove('is-highlighted');
    }, 2500);
    if (history.pushState) {
      history.pushState(null, null, '#phd-aspirants');
    } else {
      location.hash = '#phd-aspirants';
    }
  }

  tickerBar.addEventListener('click', scrollToPhdCard);

  // Keyboard accessibility: Enter or Space on .ticker-item
  var tickerItems = tickerBar.querySelectorAll('.ticker-item[tabindex="0"]');
  tickerItems.forEach(function (item) {
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('.ticker-link')) {
          e.preventDefault();
          scrollToPhdCard(e);
        }
      }
    });
  });
});


