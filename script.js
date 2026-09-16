/* -------------------------------------------------
   Footer year
------------------------------------------------- */
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* -------------------------------------------------
   Highlight the nav link for the section in view
------------------------------------------------- */
const navLinks = new Map();

document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
  navLinks.set(link.getAttribute("href").slice(1), link);
});

const sections = Array.from(document.querySelectorAll("main section[id]")).filter((section) =>
  navLinks.has(section.id)
);

if (sections.length) {
  const header = document.querySelector(".site-header");

  const updateActiveNav = () => {
    const line = (header ? header.offsetHeight : 0) + 24;

    // The last section whose top has scrolled past the header is the one we are in.
    let current = null;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= line) {
        current = section;
      }
    });

    // The final section may be too short to ever reach the line, so claim it at the bottom.
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (atBottom) {
      current = sections[sections.length - 1];
    }

    navLinks.forEach((link, id) => {
      link.classList.toggle("active", current !== null && id === current.id);
    });
  };

  let queued = false;

  const onScroll = () => {
    if (queued) {
      return;
    }

    queued = true;

    window.requestAnimationFrame(() => {
      updateActiveNav();
      queued = false;
    });
  };

  updateActiveNav();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}
