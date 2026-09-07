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

  function useLocation(trigger) {
    var label = trigger.querySelector("[data-location-label]");
    var errorEl = document.getElementById("location-error");
    function setLabel(text) {
      if (label) label.textContent = text;
    }
    function showError(msg) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = msg;
      }
      setLabel("Use my location");
      trigger.removeAttribute("disabled");
      trigger.removeAttribute("aria-busy");
    }
    if (!navigator.geolocation) {
      showError("Location isn't supported on this device.");
      return;
    }
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }
    trigger.setAttribute("disabled", "true");
    trigger.setAttribute("aria-busy", "true");
    setLabel("Locating…");
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var next = new URL(window.location.href);
        next.searchParams.set("lat", String(pos.coords.latitude));
        next.searchParams.set("lng", String(pos.coords.longitude));
        window.location.assign(next.pathname + next.search + next.hash);
      },
      function () {
        showError("We couldn't get your location. Try searching by city instead.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }

  function scrollStories(dir) {
    var vp = document.querySelector("[data-stories-viewport]");
    if (!vp) return;
    var card = vp.querySelector("[data-stories-card]");
    var width = card ? card.getBoundingClientRect().width : vp.clientWidth / 3;
    vp.scrollBy({ left: dir * width, behavior: "smooth" });
  }

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
        useLocation(target);
      }
    },
    true,
  );

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target && event.target.closest && event.target.closest(".mobile-nav a");
      if (!link) return;
      var box = document.getElementById("site-nav-toggle");
      if (box) box.checked = false;
      document.body.style.overflow = "";
    },
    true,
  );

  document.addEventListener(
    "change",
    function (event) {
      if (!event.target || event.target.id !== "site-nav-toggle") return;
      document.body.style.overflow = event.target.checked ? "hidden" : "";
    },
    true,
  );

  function bootHash() {
    if (window.location.hash === "#share-testimony") {
      openDialog("testimony-form-dialog");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootHash);
  } else {
    bootHash();
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
