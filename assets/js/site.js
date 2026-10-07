// Site behavior (PLAN 3.2, 3.5, 6.3, and 7.2): the theme toggle, smooth
// scrolling for in-page links, the phone menu, the header underline that
// follows the section in view (pages with in-page sections), BibTeX panels
// with a Copy button, the lightbox for zoomable images, and the Back button
// on publication and story pages.
// Loaded as a module on every page.

const root = document.documentElement;

// Theme: light unless the visitor picked dark with the toggle (D9); the
// choice is remembered. The inline head script applies it before paint.
const isDark = () => root.getAttribute("data-theme") === "dark";
const toggles = document.querySelectorAll("[data-theme-toggle]");
const syncToggles = () => {
  toggles.forEach((button) => button.setAttribute("aria-pressed", String(isDark())));
};
toggles.forEach((button) => {
  button.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (error) { /* storage unavailable */ }
    syncToggles();
  });
});
syncToggles();

// Smooth scrolling for in-page links (Mehdi, Stage 6), switched on just
// before the jump: with it always on, Chrome also glides through its scroll
// restoration when a page is reloaded or reached with Back.
document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a[href*='#']");
  if (link && link.hash && link.pathname === location.pathname && link.search === location.search) {
    root.classList.add("smooth-scroll");
  }
}, true);

// Phone menu: a disclosure; Escape closes it and returns focus to the button.
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
if (menuButton && menu) {
  const setOpen = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  };
  menuButton.addEventListener("click", () => setOpen(menuButton.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      menuButton.focus();
    }
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
}

// On pages with in-page sections, the last section whose top has passed a
// reading line 35% down the window is current; the first item (Home) is
// current above the first section.
const spyLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
if (spyLinks.length) {
  const targets = spyLinks.map((link) => document.getElementById(link.hash.slice(1)));
  let queued = false;
  const update = () => {
    queued = false;
    const line = window.innerHeight * 0.35;
    let current = 0;
    targets.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= line) current = i;
    });
    spyLinks.forEach((link, i) => {
      if (i === current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
}

// BibTeX panels: the BibTeX button opens its panel; Copy puts the entry on
// the clipboard and says whether that worked.
document.querySelectorAll("[data-bib-toggle]").forEach((button) => {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  if (!panel) return;
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
  });
});
document.querySelectorAll("[data-copy]").forEach((button) => {
  const source = document.getElementById(button.dataset.copy);
  const status = button.parentElement.querySelector("[data-copy-status]");
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(source.textContent);
      status.textContent = "Copied";
    } catch (error) {
      status.textContent = "Copy failed; select the text instead";
    }
  });
});

// Zoomable images: a link marked data-zoom opens its image in a dialog.
// With several on a page, Previous and Next (also the arrow keys and a
// swipe) step through them. Escape, Close, or a click outside the image
// closes the dialog, and focus returns to the link of the image last shown.
// Without a dialog element the link just opens the image.
const zoomLinks = [...document.querySelectorAll("a[data-zoom]")];
if (zoomLinks.length && typeof HTMLDialogElement === "function") {
  const chevron = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}" /></svg>`;
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Enlarged image");
  dialog.innerHTML = `
    <div class="lightbox__bar">
      <p class="lightbox__count" role="status"></p>
      <button class="lightbox__close" type="button">Close</button>
    </div>
    <div class="lightbox__stage">
      <img alt="">
      <button class="lightbox__step lightbox__step--prev" type="button" aria-label="Previous image" data-step="-1">${chevron("m15 18-6-6 6-6")}</button>
      <button class="lightbox__step lightbox__step--next" type="button" aria-label="Next image" data-step="1">${chevron("m9 18 6-6-6-6")}</button>
    </div>
    <p class="lightbox__caption"></p>`;
  document.body.append(dialog);
  const image = dialog.querySelector("img");
  const count = dialog.querySelector(".lightbox__count");
  const caption = dialog.querySelector(".lightbox__caption");
  const steps = dialog.querySelectorAll("[data-step]");
  const many = zoomLinks.length > 1;
  steps.forEach((button) => { button.hidden = !many; });
  count.hidden = !many;
  let current = 0;

  const show = (index) => {
    current = (index + zoomLinks.length) % zoomLinks.length;
    const link = zoomLinks[current];
    image.alt = link.querySelector("img")?.alt ?? "";
    image.src = link.href;
    const text = link.closest("figure")?.querySelector("figcaption")?.textContent.trim() ?? "";
    caption.textContent = text;
    caption.hidden = !text;
    if (many) count.textContent = `${current + 1} of ${zoomLinks.length}`;
  };

  dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
  steps.forEach((button) => button.addEventListener("click", () => show(current + Number(button.dataset.step))));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (!many || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft") show(current - 1);
    else if (event.key === "ArrowRight") show(current + 1);
    else return;
    event.preventDefault();
  });
  // A horizontal swipe on a touch screen steps through the images.
  let swipeX = null;
  dialog.addEventListener("pointerdown", (event) => {
    swipeX = many && event.pointerType === "touch" ? event.clientX : null;
  });
  dialog.addEventListener("pointerup", (event) => {
    if (swipeX === null) return;
    const dx = event.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 48) show(current + (dx < 0 ? 1 : -1));
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    zoomLinks[current].focus();
  });
  zoomLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      show(index);
      dialog.showModal();
    });
  });
}

// Back button (publication and story pages; Mehdi, Stage 7): after a visit
// from another page of this site it works like the browser's Back button, so
// the visitor returns to the same place on the page they came from. Arriving
// from elsewhere, through an old URL's redirect, or in a new tab, it stays a
// link to the list page. Every page notes its path in this tab's session
// storage; a visit counts as "from this site" when the referrer is the page
// noted last. The decision is kept in history.state for reloads.
let lastPage = null;
const notePage = () => {
  try {
    sessionStorage.setItem("last-page", location.pathname);
    return true;
  } catch (error) {
    return false;
  }
};
try { lastPage = sessionStorage.getItem("last-page"); } catch (error) { /* storage unavailable */ }
const pageNoted = notePage();
window.addEventListener("pageshow", (event) => { if (event.persisted) notePage(); });

const backLink = document.querySelector("[data-back]");
if (backLink) {
  let fromSite = history.state?.backFromSite;
  if (typeof fromSite !== "boolean") {
    let referrer = null;
    try { referrer = new URL(document.referrer); } catch (error) { /* no referrer */ }
    fromSite = Boolean(referrer) && referrer.origin === location.origin && history.length > 1
      && (!pageNoted || referrer.pathname === lastPage);
    try { history.replaceState({ ...history.state, backFromSite: fromSite }, ""); } catch (error) { /* keep going */ }
  }
  if (fromSite) {
    backLink.querySelector("[data-back-label]").textContent = "Back";
    backLink.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      // In-page links (such as the skip link) add history entries for this
      // same page; keep stepping back until the previous page loads.
      const again = () => history.back();
      window.addEventListener("popstate", again);
      window.addEventListener("pagehide", () => window.removeEventListener("popstate", again), { once: true });
      history.back();
    });
  }
}
