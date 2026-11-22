// Interlinkz Variant 9, D9 sequence: the journey line grows as frames,
// the rest is scroll-drawn, and the steps light as the line reaches them.
// Desktop only. Without JS the line is fully drawn and all content is visible.
// ScrollTrigger from tweens set immediateRender: false, so nothing is
// pre-hidden: elements sit fully visible until their animation moment.
(function () {
  if (!window.gsap) return;
  if (window.matchMedia("(max-width: 860px)").matches) return;
  gsap.registerPlugin(ScrollTrigger);

  /* The journey line: first stretch grows as a timed frame sequence when
     the wrap enters, the continuation draws with the scroll */
  var wrap = document.querySelector(".journey-wrap");
  var lineA = document.querySelector(".journey-line .jl-a");
  var lineB = document.querySelector(".journey-line .jl-b");
  var dot = document.querySelector(".journey-line .jl-dot");
  if (wrap && lineA) {
    var lenA = lineA.getTotalLength();
    lineA.style.strokeDasharray = lenA;
    lineA.style.strokeDashoffset = lenA;
    gsap.to(lineA, {
      strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: 0.2,
      scrollTrigger: { trigger: wrap, start: "top 88%", once: true }
    });
    if (lineB) {
      var lenB = lineB.getTotalLength();
      lineB.style.strokeDasharray = lenB;
      lineB.style.strokeDashoffset = lenB;
      gsap.to(lineB, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: ".j-steps", start: "top 45%", end: "top -15%", scrub: 0.6 }
      });
    }
    if (dot) {
      gsap.fromTo(dot, { opacity: 0 }, {
        opacity: 1, duration: 0.4,
        scrollTrigger: { trigger: ".j-steps", start: "top -5%", once: true }
      });
    }
  }

  /* The steps light in sequence as they arrive */
  gsap.utils.toArray(".j-step").forEach(function (step, i) {
    var num = step.querySelector(".j-num");
    if (!num) return;
    ScrollTrigger.create({
      trigger: step, start: "top 86%", once: true,
      onEnter: function () {
        gsap.to(num, {
          scale: 1.22, boxShadow: "0 0 0 7px rgba(255,204,1,0.35)",
          duration: 0.32, delay: i * 0.16, yoyo: true, repeat: 1, ease: "power1.inOut"
        });
      }
    });
  });

  /* The Link Chain row: the lines draw and the steps light in sequence */
  document.querySelectorAll(".chain-row").forEach(function (row) {
    var links = row.querySelectorAll(".chain-link");
    var steps = row.querySelectorAll(".chain-step, .ws-step");
    if (!links.length && !steps.length) return;
    var tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
    if (links.length) tl.from(links, { scaleX: 0, transformOrigin: "left center", duration: 0.45, stagger: 0.16, ease: "power2.out", immediateRender: false }, 0);
    if (steps.length) tl.from(steps, { opacity: 0.25, duration: 0.3, stagger: 0.16, immediateRender: false }, 0);
  });
})();
