/* Halftone ink globe: points on a sphere, rotating, drawn as engraved dots */
(function () {
  var canvas = document.getElementById("sphere");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COUNT = 420;
  var TILT = -0.35;
  var points = [];
  var i, y, r, phi;

  /* fibonacci sphere distribution */
  var golden = Math.PI * (3 - Math.sqrt(5));
  for (i = 0; i < COUNT; i++) {
    y = 1 - (i / (COUNT - 1)) * 2;
    r = Math.sqrt(1 - y * y);
    phi = golden * i;
    points.push({ x: Math.cos(phi) * r, y: y, z: Math.sin(phi) * r });
  }

  var size = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    var rect = canvas.getBoundingClientRect();
    size = rect.width;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
  }

  function draw(angle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var cx = (size * dpr) / 2;
    var cy = (size * dpr) / 2;
    var radius = (size * dpr) / 2 - 4 * dpr;
    var cosA = Math.cos(angle), sinA = Math.sin(angle);
    var cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    var p, x1, z1, y2, z2, depth, alpha, dot;

    for (var j = 0; j < COUNT; j++) {
      p = points[j];
      x1 = p.x * cosA + p.z * sinA;
      z1 = -p.x * sinA + p.z * cosA;
      y2 = p.y * cosT - z1 * sinT;
      z2 = p.y * sinT + z1 * cosT;
      depth = (z2 + 1) / 2;
      alpha = 0.08 + depth * 0.55;
      dot = (0.6 + depth * 1.1) * dpr;
      ctx.beginPath();
      ctx.arc(cx + x1 * radius, cy + y2 * radius, dot, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20, 20, 18, " + alpha.toFixed(3) + ")";
      ctx.fill();
    }
  }

  resize();

  if (prefersReduced) {
    draw(0.6);
  } else {
    var start = null;
    var running = true;
    function frame(t) {
      if (!start) start = t;
      if (running) draw(((t - start) / 1000) * 0.22);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
    });
  }

  window.addEventListener("resize", function () {
    resize();
    if (prefersReduced) draw(0.6);
  });
})();

/* Expect page: scroll-scrubbed simulated lead feed */
(function () {
  var wrap = document.querySelector(".feed-scroll");
  if (!wrap) return;

  var cards = Array.prototype.slice.call(wrap.querySelectorAll(".feed-card"));
  var N = cards.length;
  var statLeads = document.getElementById("stat-leads");
  var statPipe = document.getElementById("stat-pipe");
  var FINAL_LEADS = 24;
  var FINAL_PIPE = 8140;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    cards.forEach(function (c) { c.classList.add("in"); });
    return;
  }

  var ticking = false;

  function update() {
    ticking = false;
    var rect = wrap.getBoundingClientRect();
    var total = wrap.offsetHeight - window.innerHeight;
    if (total <= 0) total = 1;
    var p = Math.min(1, Math.max(0, -rect.top / total));

    for (var i = 0; i < N; i++) {
      var idx = parseInt(cards[i].getAttribute("data-i"), 10) || (i + 1);
      cards[i].classList.toggle("in", p * (N + 1) >= idx);
    }

    if (statLeads) statLeads.textContent = String(Math.round(p * FINAL_LEADS));
    if (statPipe) statPipe.textContent = "$" + Math.round(p * FINAL_PIPE).toLocaleString("en-US");
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".fade-item");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
})();
