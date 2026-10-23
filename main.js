const revealTargets = document.querySelectorAll(".section, .footer");

if ("IntersectionObserver" in window && revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  for (const el of revealTargets) {
    el.classList.add("reveal");
    observer.observe(el);
  }
}

document.documentElement.style.setProperty(
  "--vh",
  `${window.innerHeight * 0.01}px`
);
