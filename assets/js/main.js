/* ============================================================
   Eduard Baroyan, engineering portfolio
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll progress bar ---------- */

  var bar = document.querySelector(".progress");
  if (bar) {
    var ticking = false;
    var paint = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* ---------- nav: pick up a backdrop once scrolled ---------- */

  var nav = document.querySelector(".nav");
  if (nav) {
    var stick = function () { nav.classList.toggle("stuck", window.scrollY > 40); };
    window.addEventListener("scroll", stick, { passive: true });
    stick();
  }

  /* ---------- reveal elements as they enter the viewport ---------- */

  var targets = document.querySelectorAll(".reveal");

  var showAll = function () {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("in"); });
  };

  if (reduced || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { el.classList.add("in"); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    // Landing straight on an anchor (or a restored scroll position) can leave the
    // observer having already made its pass, so sweep anything on screen by hand.
    var sweep = function () {
      Array.prototype.forEach.call(targets, function (el) {
        if (el.classList.contains("in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    };

    window.addEventListener("load", sweep);
    window.addEventListener("hashchange", function () { setTimeout(sweep, 140); });
    setTimeout(sweep, 400);
  }

  /* ---------- highlight the section currently in view ---------- */

  var links = document.querySelectorAll(".nav__links a[href^='#']");
  if (links.length && "IntersectionObserver" in window) {
    var sections = [];
    Array.prototype.forEach.call(links, function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) sections.push(s);
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Array.prototype.forEach.call(links, function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- click a figure to view it full size ---------- */

  var figures = document.querySelectorAll("figure img");
  if (figures.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<button class="lightbox__close" aria-label="Close image">&times;</button><img alt="">';
    document.body.appendChild(box);

    var full = box.querySelector("img");

    var open = function (src, alt) {
      full.src = src;
      full.alt = alt || "";
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    var close = function () {
      box.classList.remove("open");
      document.body.style.overflow = "";
    };

    Array.prototype.forEach.call(figures, function (img) {
      img.addEventListener("click", function () { open(img.currentSrc || img.src, img.alt); });
    });

    box.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- hero: drifting node field ----------
     A procedural stand-in for the network artwork on the original
     portfolio cover, so nothing here depends on a stock image.       */

  var canvas = document.getElementById("field");
  if (!canvas || reduced) return;

  var ctx = canvas.getContext("2d");
  var nodes = [];
  var w = 0;
  var h = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var pointer = { x: -9999, y: -9999 };
  var running = true;
  var LINK = 148;

  function size() {
    var rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // roughly one node per 15k px², clamped so phones and 4k monitors both behave
    var count = Math.round(Math.min(Math.max((w * h) / 15000, 34), 118));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r: Math.random() * 1.7 + 0.9,
        warm: Math.random() < 0.16
      });
    }
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -40) n.x = w + 40;
      if (n.x > w + 40) n.x = -40;
      if (n.y < -40) n.y = h + 40;
      if (n.y > h + 40) n.y = -40;

      // gentle drift away from the cursor
      var pdx = n.x - pointer.x;
      var pdy = n.y - pointer.y;
      var pd = Math.sqrt(pdx * pdx + pdy * pdy);
      if (pd < 130 && pd > 0.1) {
        var push = (130 - pd) / 130 * 0.55;
        n.x += (pdx / pd) * push;
        n.y += (pdy / pd) * push;
      }

      for (var j = i + 1; j < nodes.length; j++) {
        var m = nodes[j];
        var dx = n.x - m.x;
        var dy = n.y - m.y;
        var d2 = dx * dx + dy * dy;
        if (d2 > LINK * LINK) continue;
        var a = (1 - Math.sqrt(d2) / LINK) * 0.2;
        ctx.strokeStyle = "rgba(34, 211, 238, " + a.toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }

      ctx.fillStyle = n.warm ? "rgba(251, 146, 60, 0.75)" : "rgba(125, 211, 252, 0.72)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    window.requestAnimationFrame(frame);
  }

  size();
  frame();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(size, 180);
  });

  window.addEventListener("mousemove", function (e) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener("mouseout", function () { pointer.x = pointer.y = -9999; });

  // stop drawing once the hero has scrolled away
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; frame(); }
      running = visible;
    }, { threshold: 0 }).observe(canvas);
  }
})();
