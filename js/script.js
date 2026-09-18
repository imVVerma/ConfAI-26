// Safety Check: Redirect invalid/malformed hostnames back to the live GitHub Pages site
(function () {
  var validHosts = ["imvverma.github.io", "confai.plaksha.edu.in", "localhost", "127.0.0.1"];
  var hostname = window.location.hostname;

  if (!validHosts.includes(hostname) && !hostname.endsWith(".github.io")) {
    window.location.href = "https://imvverma.github.io/ConfAI-26/";
  }
})();

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

      photoModalImg.onerror = function() {
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
          img.onerror = function() {
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

    // ── Faculty URL lookup map ───────────────────────────────────────────────
    var CHAIR_URLS = {
      "Alok Ranjan":              "https://plaksha.edu.in/faculty-details/alok-ranjan",
      "Nikhil George":            "https://plaksha.edu.in/faculty-details/nikhil-george",
      "Divyanshu Jain":           "https://plaksha.edu.in/faculty-details/divyanshu-jain",
      "Dr. Sunita Chauhan":       "https://plaksha.edu.in/faculty-details/dr-sunita-chauhan",
      "Dr. Sandeep Manjanna":     "https://plaksha.edu.in/faculty-details/dr-sandeep-manjanna",
      "Dr. Monika Sharma":        "https://plaksha.edu.in/faculty-details/dr-monika-sharma",
      "Dr. Chaitanya Lekshmi Indira": "https://plaksha.edu.in/faculty-details/dr-chaitanya-lekshmi-indira",
      "Arshdeep Sidhu":           "https://plaksha.edu.in/faculty-details/arshdeep-sidhu",
      "Dr. Amruta R Behera":      "https://plaksha.edu.in/faculty-details/dr-amruta-r-behera",
      "Dr. Rucha Joshi":          "https://plaksha.edu.in/faculty-details/dr-rucha-joshi",
      "Dr. Swagata Halder":       "https://plaksha.edu.in/faculty-details/dr-swagata-halder",
      "Sanjeev Khosla":           "https://plaksha.edu.in/faculty-details/sanjeev-khosla",
      "Dr. Anupam Sobti":         "https://plaksha.edu.in/faculty-details/dr-anupam-sobti",
      "Dr. Malini Balakrishnan":  "https://plaksha.edu.in/faculty-details/dr-malini-balakrishnan",
      "Dr. Prashanth Suresh Kumar": "https://plaksha.edu.in/faculty-details/dr-prashanth-suresh-kumar",
      "Pankaj Pansari":           "https://plaksha.edu.in/faculty-details/pankaj-pansari",
      "Anil Roy":                 "https://plaksha.edu.in/faculty-details/anil-roy",
      "Praveen Kumar":            "https://plaksha.edu.in/faculty-details/praveen-kumar",
      "Deepan Muthirayan":        "https://plaksha.edu.in/faculty-details/deepan-muthirayan",
      "Rajesh Sharma":            "https://plaksha.edu.in/faculty-details/rajesh-sharma",
      "Shachindra Nath":          "http://linkedin.com/in/shachindranath",
      "Dr. Deepak Khemani":       "https://plaksha.edu.in/faculty-details/dr-deepak-khemani",
      "Saeed Salehi":             "https://plaksha.edu.in/faculty-details/saeed-salehi",
      "Dr. Tapas Pandit":         "https://plaksha.edu.in/faculty-details/dr-tapas-pandit",
      "Sandilya Garimella":       "https://plaksha.edu.in/faculty-details/sandilya-garimella"
    };

    function buildChairsHTML(chairsStr) {
      var names = chairsStr.split("|").map(function(s) { return s.trim(); }).filter(Boolean);
      return names.map(function(name) {
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
      numEl.textContent    = "Track " + trigger.getAttribute("data-track-num");
      nameEl.textContent   = trigger.getAttribute("data-track-name");
      descEl.textContent   = trigger.getAttribute("data-track-desc");

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
        title: 'Keynote Address 4',
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
        time: '02:00 PM Onwards',
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
   CONFAI 2026 - NEURAL NETWORK TRANSITION ANIMATOR
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('neural-transition-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var nodes = [];
  var animationFrameId = null;
  var isRunning = true;
  var width = 0;
  var height = 0;
  var dpr = window.devicePixelRatio || 1;

  // Plaksha Teal: RGB (0, 120, 120)
  var TEAL_R = 0;
  var TEAL_G = 120;
  var TEAL_B = 120;

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || 100;
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    initNodes();
  }

  function initNodes() {
    nodes = [];
    // Number of nodes based on screen width: gentle density (approx 24-38 nodes)
    var nodeCount = Math.max(16, Math.min(36, Math.floor(width / 42)));

    for (var i = 0; i < nodeCount; i++) {
      var x = (width / (nodeCount - 1)) * i + (Math.random() * 24 - 12);
      // Curve equation matching the SVG shallow wave: y_curve = (height - 40) + 32 * sin(pi * x / width)
      var normX = Math.max(0, Math.min(1, x / width));
      var curveY = (height - 48) + Math.sin(Math.PI * normX) * 32;
      var yOffset = (Math.random() - 0.5) * 44; // Concentrated within +/- 22px of the curve
      var y = Math.max(8, Math.min(height - 8, curveY + yOffset));

      nodes.push({
        x: x,
        y: y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.12, // Very slow subtle drift
        vy: (Math.random() - 0.5) * 0.08,
        radius: 1.5 + Math.random() * 1.1, // 1.5px to 2.6px
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018, // Slow, barely noticeable pulse
        baseAlpha: 0.28 + Math.random() * 0.25 // Low opacity: 0.28 to 0.53
      });
    }
  }

  function render(time) {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    var maxDist = 96; // Distance threshold for connection lines

    // 1. Update positions & pulse phases
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      n.pulsePhase += n.pulseSpeed;

      // Soft spring tether back to origin to maintain distribution along curve
      var dx = n.originX - n.x;
      var dy = n.originY - n.y;
      n.vx += dx * 0.0008;
      n.vy += dy * 0.0008;

      // Velocity damping
      n.vx *= 0.985;
      n.vy *= 0.985;
    }

    // 2. Draw Connection Lines (Thin geometric connections)
    ctx.lineWidth = 0.75;
    for (var a = 0; a < nodes.length; a++) {
      var nodeA = nodes[a];
      var pulseA = Math.sin(nodeA.pulsePhase);
      var currentAlphaA = Math.max(0.12, Math.min(0.65, nodeA.baseAlpha + pulseA * 0.12));

      for (var b = a + 1; b < nodes.length; b++) {
        var nodeB = nodes[b];
        var distSq = (nodeA.x - nodeB.x) * (nodeA.x - nodeB.x) + (nodeA.y - nodeB.y) * (nodeA.y - nodeB.y);

        if (distSq < maxDist * maxDist) {
          var dist = Math.sqrt(distSq);
          var distFactor = 1 - (dist / maxDist);
          var pulseB = Math.sin(nodeB.pulsePhase);
          var currentAlphaB = Math.max(0.12, Math.min(0.65, nodeB.baseAlpha + pulseB * 0.12));
          var lineAlpha = distFactor * Math.min(currentAlphaA, currentAlphaB) * 0.48;

          if (lineAlpha > 0.02) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + TEAL_R + ',' + TEAL_G + ',' + TEAL_B + ',' + lineAlpha.toFixed(3) + ')';
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }
    }

    // 3. Draw Nodes (Small subtle pulsing circles)
    for (var k = 0; k < nodes.length; k++) {
      var node = nodes[k];
      var pulse = Math.sin(node.pulsePhase);
      var nodeAlpha = Math.max(0.18, Math.min(0.65, node.baseAlpha + pulse * 0.14));
      var drawRadius = node.radius + pulse * 0.35;

      // Soft micro halo
      ctx.beginPath();
      ctx.arc(node.x, node.y, drawRadius + 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + TEAL_R + ',' + TEAL_G + ',' + TEAL_B + ',' + (nodeAlpha * 0.15).toFixed(3) + ')';
      ctx.fill();

      // Main crisp node
      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(1.0, drawRadius), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + TEAL_R + ',' + TEAL_G + ',' + TEAL_B + ',' + nodeAlpha.toFixed(3) + ')';
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Handle Reduced Motion preferences
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    resizeCanvas();
    // Render single static frame
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
