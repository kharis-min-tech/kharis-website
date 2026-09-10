(function () {
  function ytId(value) {
    return /^[A-Za-z0-9_-]{6,20}$/.test(value || "") ? value : "";
  }

  function openDialog(id) {
    var dialog = id && document.getElementById(id);
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
  }

  function closeDialog(el) {
    var dialog = el && el.closest && el.closest("dialog");
    if (dialog && typeof dialog.close === "function") dialog.close();
  }

  function playYoutube(trigger) {
    var id = ytId(trigger.getAttribute("data-yt-play"));
    var box = trigger.closest("[data-yt-box]") || trigger.parentElement;
    if (!id || !box) return;
    var title = trigger.getAttribute("data-yt-title") || "YouTube video";
    var frame = document.createElement("iframe");
    frame.className = "absolute inset-0 h-full w-full";
    frame.src =
      "https://www.youtube-nocookie.com/embed/" +
      id +
      "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    frame.title = title;
    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    box.innerHTML = "";
    box.appendChild(frame);
  }

  function scrollStories(dir) {
    var vp = document.querySelector("[data-stories-viewport]");
    if (!vp) return;
    var card = vp.querySelector("[data-stories-card]");
    var width = card ? card.getBoundingClientRect().width : vp.clientWidth / 3;
    vp.scrollBy({ left: dir * width, behavior: "smooth" });
  }

  var branchOrigin = null;
  var branchLocating = false;

  function distanceMiles(aLat, aLng, bLat, bLng) {
    function toRad(d) {
      return (d * Math.PI) / 180;
    }
    var R = 3958.8;
    var dLat = toRad(bLat - aLat);
    var dLng = toRad(bLng - aLng);
    var h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function branchRoot() {
    return document.querySelector("[data-branches]");
  }

  function branchCards() {
    var root = branchRoot();
    if (!root) return [];
    return Array.prototype.slice.call(root.querySelectorAll("[data-branch-card]"));
  }

  function setHidden(el, hidden) {
    if (!el) return;
    if (hidden) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  function locationText() {
    var root = branchRoot();
    return root && root.querySelector("[data-location-text]");
  }

  function setLocating(on) {
    branchLocating = on;
    var label = locationText();
    if (label) label.textContent = on ? "Locating…" : "Use my location";
  }

  function showLocationError(message) {
    var root = branchRoot();
    if (!root) return;
    var errorEl = root.querySelector("[data-location-error]");
    var statusEl = root.querySelector("[data-location-status]");
    if (errorEl) {
      errorEl.textContent = message;
      setHidden(errorEl, !message);
    }
    if (statusEl && message) setHidden(statusEl, true);
  }

  function activeRegion() {
    var root = branchRoot();
    var btn = root && root.querySelector('[data-ui="branch-region"][data-active="true"]');
    if (btn && btn.getAttribute("data-region")) return btn.getAttribute("data-region");
    return "All";
  }

  function searchQuery() {
    var root = branchRoot();
    var input = root && root.querySelector("[data-branch-search]");
    return input && input.value ? String(input.value).trim().toLowerCase() : "";
  }

  function selectBranch(slug, opts) {
    var root = branchRoot();
    if (!root || !slug) return;
    var card = root.querySelector('[data-branch-card][data-slug="' + slug + '"]');
    if (!card) return;

    var cards = branchCards();
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute("data-slug") === slug) {
        cards[i].classList.add("ring-4", "ring-primary");
      } else {
        cards[i].classList.remove("ring-4", "ring-primary");
      }
    }

    var city = root.querySelector("[data-branch-featured-city]");
    var map = root.querySelector("[data-branch-featured-map]");
    var address = root.querySelector("[data-branch-featured-address]");
    var directions = root.querySelector("[data-branch-featured-directions]");
    var link = root.querySelector("[data-branch-featured-link]");
    if (city) city.textContent = card.getAttribute("data-city") || "";
    if (address) address.textContent = card.getAttribute("data-address") || "";
    if (map) {
      var src = card.getAttribute("data-map-src") || "";
      if (src && map.getAttribute("src") !== src) map.setAttribute("src", src);
      map.setAttribute("title", "Map of " + (card.getAttribute("data-name") || ""));
    }
    if (directions) {
      var href = card.getAttribute("data-directions") || "";
      if (href) {
        directions.setAttribute("href", href);
        setHidden(directions, false);
      } else {
        directions.removeAttribute("href");
        setHidden(directions, true);
      }
    }
    if (link) {
      var to = card.getAttribute("data-href") || "/branches/" + slug;
      link.setAttribute("href", to);
    }

    var plans = root.querySelectorAll("[data-featured-plan]");
    Array.prototype.forEach.call(plans, function (el) {
      setHidden(el, el.getAttribute("data-featured-plan") !== slug);
    });

    if (opts && opts.scroll) {
      var featured = root.querySelector("[data-branch-featured]");
      if (featured && featured.scrollIntoView) {
        featured.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (card.scrollIntoView) {
        window.setTimeout(function () {
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 250);
      }
    }
  }

  function applyBranchFilters(opts) {
    var root = branchRoot();
    if (!root) return;
    var list = root.querySelector("[data-branch-list]");
    var empty = root.querySelector("[data-branch-empty]");
    var count = root.querySelector("[data-branch-count]");
    var statusEl = root.querySelector("[data-location-status]");
    var closestLine = root.querySelector("[data-closest-line]");
    var clearBtn = root.querySelector('[data-ui="branch-search-clear"]');
    var q = searchQuery();
    var region = activeRegion();
    var cards = branchCards();
    var visible = [];
    var hidden = [];

    setHidden(clearBtn, !q);

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var hay = (card.getAttribute("data-search") || "").toLowerCase();
      var cardRegion = card.getAttribute("data-region") || "";
      var matchesQuery = !q || hay.indexOf(q) !== -1;
      var matchesRegion = region === "All" || cardRegion === region;
      var show = matchesQuery && matchesRegion;
      card.style.display = show ? "" : "none";
      var milesBadge = card.querySelector("[data-miles-badge]");
      var nearestBadge = card.querySelector("[data-nearest-badge]");
      setHidden(nearestBadge, true);
      var lat = parseFloat(card.getAttribute("data-lat") || "");
      var lng = parseFloat(card.getAttribute("data-lng") || "");
      var miles = Infinity;
      if (branchOrigin && isFinite(lat) && isFinite(lng) && (lat !== 0 || lng !== 0)) {
        miles = distanceMiles(branchOrigin.lat, branchOrigin.lng, lat, lng);
        if (milesBadge) {
          milesBadge.textContent = miles < 1 ? "<1 mi" : Math.round(miles) + " mi";
          setHidden(milesBadge, false);
        }
      } else if (milesBadge) {
        milesBadge.textContent = "";
        setHidden(milesBadge, true);
      }
      if (show) visible.push({ card: card, miles: miles, index: Number(card.getAttribute("data-index") || 0) });
      else hidden.push(card);
    }

    visible.sort(function (a, b) {
      if (branchOrigin) {
        if (a.miles !== b.miles) return a.miles - b.miles;
      }
      return a.index - b.index;
    });

    if (list) {
      for (var v = 0; v < visible.length; v++) list.appendChild(visible[v].card);
      for (var h = 0; h < hidden.length; h++) list.appendChild(hidden[h]);
    }

    if (count) count.textContent = String(visible.length);
    setHidden(empty, visible.length !== 0);
    if (list) list.style.display = visible.length ? "" : "none";

    if (branchOrigin && statusEl) {
      var nearest = null;
      for (var n = 0; n < visible.length; n++) {
        if (visible[n].miles !== Infinity) {
          nearest = visible[n];
          break;
        }
      }
      if (!nearest && visible[0]) nearest = visible[0];
      if (nearest) {
        var nearestBadgeOn = nearest.card.querySelector("[data-nearest-badge]");
        setHidden(nearestBadgeOn, false);
        var name = nearest.card.getAttribute("data-name") || nearest.card.getAttribute("data-city") || "";
        var milesLabel =
          nearest.miles !== Infinity
            ? nearest.miles < 1
              ? " (<1 mi)"
              : " (" + Math.round(nearest.miles) + " mi)"
            : "";
        if (closestLine) closestLine.textContent = "Closest: " + name + milesLabel + ".";
        setHidden(statusEl, false);
        showLocationError("");
        selectBranch(nearest.card.getAttribute("data-slug"), {
          scroll: opts && opts.scrollNearest,
        });
      } else {
        if (closestLine) closestLine.textContent = "";
        setHidden(statusEl, true);
      }
    } else if (statusEl) {
      setHidden(statusEl, true);
      if (visible[0] && opts && opts.selectFirst) {
        selectBranch(visible[0].card.getAttribute("data-slug"), { scroll: false });
      }
    }
  }

  function geolocationErrorMessage(error) {
    if (!window.isSecureContext) {
      return "Location needs a secure connection (HTTPS). Search by city or postcode instead.";
    }
    var code = error && typeof error.code === "number" ? error.code : null;
    if (code === 1) return "Location permission was denied. Search by city or postcode instead.";
    if (code === 2) return "Your position is unavailable. Search by city or postcode instead.";
    if (code === 3) return "Location timed out. Search by city or postcode instead.";
    return "We couldn't get your location. Search by city or postcode instead.";
  }

  function useMyLocation() {
    var root = branchRoot();
    if (!root) return;
    if (branchLocating) return;
    showLocationError("");
    if (!window.isSecureContext) {
      showLocationError(geolocationErrorMessage({ code: 0 }));
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      showLocationError("Location isn't supported in this browser. Search by city or postcode instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        branchOrigin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocating(false);
        applyBranchFilters({ scrollNearest: true });
      },
      function (error) {
        setLocating(false);
        showLocationError(geolocationErrorMessage(error));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  function resetLocation() {
    branchOrigin = null;
    setLocating(false);
    showLocationError("");
    applyBranchFilters({ selectFirst: true });
  }

  function setRegion(region) {
    var root = branchRoot();
    if (!root) return;
    var buttons = root.querySelectorAll('[data-ui="branch-region"]');
    Array.prototype.forEach.call(buttons, function (btn) {
      var on = btn.getAttribute("data-region") === region;
      btn.setAttribute("data-active", on ? "true" : "false");
      btn.className =
        "px-4 py-2 font-body-md text-[12px] font-bold uppercase tracking-wide brutalist-border transition-colors " +
        (on
          ? "bg-primary text-on-primary"
          : "bg-surface-container-lowest hover:bg-secondary-container hover:text-on-secondary-container");
    });
    applyBranchFilters({ selectFirst: !branchOrigin, scrollNearest: !!branchOrigin });
  }

  function bootBranches() {
    var root = branchRoot();
    if (!root) return;
    var input = root.querySelector("[data-branch-search]");
    if (input && !input.getAttribute("data-bound")) {
      input.setAttribute("data-bound", "1");
      input.addEventListener("input", function () {
        applyBranchFilters({ selectFirst: true });
      });
    }
    window.__kp2ApplyBranchOrigin = function (lat, lng) {
      branchOrigin = { lat: lat, lng: lng };
      setLocating(false);
      showLocationError("");
      applyBranchFilters({ scrollNearest: true });
    };
  }

  document.addEventListener(
    "submit",
    function (event) {
      var form = event.target;
      if (form && form.getAttribute && form.getAttribute("data-newsletter")) {
        event.preventDefault();
      }
    },
    true,
  );

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target && event.target.closest && event.target.closest("[data-ui]");
      if (!target) return;
      var action = target.getAttribute("data-ui");
      if (!action) return;
      event.preventDefault();
      event.stopPropagation();
      if (action === "yt-play") {
        playYoutube(target);
      } else if (action === "open-dialog") {
        openDialog(target.getAttribute("data-dialog"));
      } else if (action === "close-dialog") {
        closeDialog(target);
      } else if (action === "stories-next") {
        scrollStories(1);
      } else if (action === "stories-prev") {
        scrollStories(-1);
      } else if (action === "lot-open") {
        var src = target.getAttribute("data-lot-src") || "";
        var kind = target.getAttribute("data-lot-kind") || "image";
        var alt = target.getAttribute("data-lot-alt") || "";
        var dialog = document.getElementById("lot-lightbox");
        var stage = dialog && dialog.querySelector("[data-lot-stage]");
        if (!dialog || !stage || !src) return;
        stage.innerHTML = "";
        if (kind === "video") {
          var video = document.createElement("video");
          video.src = src;
          video.controls = true;
          video.autoplay = true;
          video.className = "w-full max-h-[80vh] object-contain";
          stage.appendChild(video);
        } else {
          var image = document.createElement("img");
          image.src = src;
          image.alt = alt;
          image.className = "w-full max-h-[80vh] object-contain";
          stage.appendChild(image);
        }
        if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
      } else if (action === "expand-faith") {
        var items = document.querySelectorAll(".faith-item");
        var openAll = false;
        Array.prototype.forEach.call(items, function (el) {
          if (!el.open) openAll = true;
        });
        Array.prototype.forEach.call(items, function (el) {
          el.open = openAll;
        });
        var label = target.querySelector("[data-expand-label]") || target;
        if (label) label.textContent = openAll ? "Collapse All" : "Expand All";
      } else if (action === "share-video") {
        var url = target.getAttribute("data-url");
        var title = target.getAttribute("data-title") || "";
        if (!url) return;
        if (navigator.share) {
          navigator.share({ title: title, url: url }).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url);
        } else {
          window.open(url, "_blank", "noreferrer");
        }
      } else if (action === "use-location") {
        useMyLocation();
      } else if (action === "reset-location") {
        resetLocation();
      } else if (action === "branch-region") {
        setRegion(target.getAttribute("data-region") || "All");
      } else if (action === "select-branch") {
        selectBranch(target.getAttribute("data-slug"), { scroll: true });
      } else if (action === "branch-search-clear") {
        var root = branchRoot();
        var input = root && root.querySelector("[data-branch-search]");
        if (input) input.value = "";
        applyBranchFilters({ selectFirst: true });
      }
    },
    true,
  );

  function bootHash() {
    if (window.location.hash === "#share-testimony") {
      openDialog("testimony-form-dialog");
    }
  }

  function boot() {
    bootHash();
    bootBranches();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("hashchange", bootHash);

  document.addEventListener(
    "close",
    function (event) {
      if (event.target && event.target.id === "lot-lightbox") {
        var stage = event.target.querySelector("[data-lot-stage]");
        if (stage) stage.innerHTML = "";
      }
    },
    true,
  );

  window.setInterval(function () {
    var vp = document.querySelector("[data-stories-viewport]");
    if (!vp || vp.matches(":hover") || document.querySelector("dialog[open]")) return;
    var max = vp.scrollWidth - vp.clientWidth - 8;
    if (max <= 0) return;
    if (vp.scrollLeft >= max) vp.scrollTo({ left: 0, behavior: "smooth" });
    else scrollStories(1);
  }, 5000);
})();
