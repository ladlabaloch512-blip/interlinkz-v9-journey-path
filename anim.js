// Interlinkz Variant 9, D9 sequence: the journey line grows as the page scrolls.
// Desktop only. Without JS the line is fully drawn and all content is visible.
(function () {
  if (!window.gsap) return;
  if (window.matchMedia("(max-width: 860px)").matches) return;
  var line = document.querySelector(".journey-line path");
  var wrap = document.querySelector(".journey-wrap");
  if (!line || !wrap) return;
  gsap.registerPlugin(ScrollTrigger);
  var len = line.getTotalLength();
  line.style.strokeDasharray = len;
  line.style.strokeDashoffset = len;
  gsap.to(line, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: { trigger: wrap, start: "top 70%", end: "bottom 60%", scrub: 0.6 }
  });
  gsap.utils.toArray(".j-step").forEach(function (step, i) {
    gsap.from(step, { y: 24, opacity: 0, duration: 0.55, ease: "power3.out", scrollTrigger: { trigger: step, start: "top 88%" } });
  });
})();
