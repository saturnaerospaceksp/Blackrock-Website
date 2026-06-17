/* ============================================================
   Blackrock Dynamics - waves.js
   Animated dotted wave-terrain background.
   Renders a perspective grid of dots displaced by flowing
   sine waves, fading to black toward the horizon (top).
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("bg-waves");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, dpr = 1, cols = 0, rows = 0;
  var raf = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Dot density scales with viewport; lighter on small/touch screens.
    var step = W < 720 ? 20 : 15;
    cols = Math.max(36, Math.floor(W / step));
    rows = Math.max(30, Math.floor(H / step));
  }

  // Layered sines -> smooth pseudo-terrain in the range ~[-1, 1].
  // Big rolling swells dominate; smaller ripples add detail.
  function wave(fx, fz, t) {
    return (
      Math.sin(fx * 4.0 + t * 0.55) * 0.70 +
      Math.sin(fz * 3.2 - t * 0.45) * 0.65 +
      Math.sin((fx * 2.2 + fz * 2.8) + t * 0.80) * 0.55 +
      Math.sin((fx - fz) * 6.5 - t * 0.60) * 0.30 +
      Math.sin((fx * 1.4 - fz * 1.1) - t * 0.35) * 0.45
    ) / 1.9;
  }

  function frame(time) {
    if (!reduce) raf = requestAnimationFrame(frame);
    if (document.hidden) return;

    var t = time * 0.001;
    ctx.clearRect(0, 0, W, H);

    var horizon = H * 0.16;          // waves fade to black above this
    var rowGap = H / rows;

    for (var j = 0; j < rows; j++) {
      var fz = j / (rows - 1);       // 0 = far (top), 1 = near (bottom)
      var depth = Math.pow(fz, 1.7); // compress far rows toward the horizon
      var rowY = horizon + depth * (H * 1.04 - horizon);
      var size = 0.6 + fz * 1.5;
      var amp = rowGap * 7.0 * (0.30 + fz);

      for (var i = 0; i < cols; i++) {
        var fx = i / (cols - 1);
        var n = wave(fx, fz, t);
        var x = fx * W;                    // full-width row, no centre fan
        var y = rowY - n * amp;

        var n01 = (n + 1) * 0.5;
        var a = fz * (0.20 + 0.55 * n01);  // brighter on crests + nearer
        a *= Math.min(1, fz * 2.4);        // fade out toward the horizon
        if (a <= 0.012) continue;

        ctx.fillStyle = "rgba(188,192,200," + a.toFixed(3) + ")";
        ctx.fillRect(x, y, size, size);
      }
    }
  }

  function start() {
    resize();
    cancelAnimationFrame(raf);
    if (reduce) frame(0);                  // single static frame
    else raf = requestAnimationFrame(frame);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 150);
  });

  start();
})();
