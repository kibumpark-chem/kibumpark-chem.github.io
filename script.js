/* -------------------------------------------------
   Footer year
------------------------------------------------- */
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* -------------------------------------------------
   Highlight the link for the section in view
   Two sets of links want this: the primary nav on the home page, and the
   "on this page" rail on a research page. Each marks its current link
   .active, and each is inert on the pages where its links do not exist.
------------------------------------------------- */
const createScrollSpy = (linkSelector) => {
  const links = new Map();

  document.querySelectorAll(linkSelector).forEach((link) => {
    links.set(link.getAttribute("href").slice(1), link);
  });

  const sections = Array.from(document.querySelectorAll("main section[id]")).filter((section) =>
    links.has(section.id)
  );

  if (!sections.length) {
    return;
  }

  const updateActiveLink = () => {
    // Read the offset from the CSS rather than re-deriving it here: an anchor
    // jump lands a section at its own scroll-margin-top, so the spy line has to
    // be that same number or the two disagree wherever the header height changes.
    const line = parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0;

    // The last section whose top has scrolled past the header is the one we are in.
    // An anchor jump lands a section within a sub-pixel of the line rather than
    // exactly on it -- layout positions are fractional, scroll offsets are not --
    // so allow a pixel of slack, or the comparison flips at some viewport widths.
    let current = null;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top - line <= 1) {
        current = section;
      }
    });

    // The final section may be too short to ever reach the line, so claim it at the bottom.
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (atBottom) {
      current = sections[sections.length - 1];
    }

    links.forEach((link, id) => {
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
      updateActiveLink();
      queued = false;
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
};

// On a research page the primary nav points back at index.html, so its links
// do not match and only the rail spins up. On the home page, the reverse.
createScrollSpy('.nav a[href^="#"]');
createScrollSpy('.toc a[href^="#"]');

/* -------------------------------------------------
   Widen each research card's hit area to the whole row
   The title and "Read more" links are the real navigation targets; this only
   saves aiming at them. It stays out of the way of a nested link, of a
   modified click, and of a drag that was selecting text rather than clicking,
   so the summaries remain selectable and copyable.
------------------------------------------------- */
document.querySelectorAll(".project").forEach((card) => {
  const link = card.querySelector(".project-more");

  if (!link) {
    return;
  }

  // Added from script so the pointer and hover styles never promise a click
  // that would not happen -- with JS off the card is plain text again.
  card.classList.add("is-clickable");

  card.addEventListener("click", (event) => {
    // A link of its own handles the navigation.
    if (event.target.closest("a")) {
      return;
    }

    // The drag selected text; treat it as a selection, not a click.
    const selection = window.getSelection();

    if (selection && selection.toString().length > 0) {
      return;
    }

    // Honour the usual "open elsewhere" modifiers.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      window.open(link.href, "_blank", "noopener");
      return;
    }

    window.location.href = link.href;
  });
});
