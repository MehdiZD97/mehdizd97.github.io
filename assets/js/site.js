// Site behavior (PLAN 3.2, 3.5, and 6.3): the theme toggle, the phone menu,
// the header underline that follows the section in view (pages with in-page
// sections), BibTeX panels with a Copy button, and the lightbox for zoomable
// figures. Loaded as a module on every page.

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

// Zoomable figures: a link marked data-zoom opens its image in a dialog.
// Escape, the Close button, or a click outside the image closes it, and
// focus returns to the link. Without a dialog element the link just opens
// the image.
const zoomLinks = document.querySelectorAll("a[data-zoom]");
if (zoomLinks.length && typeof HTMLDialogElement === "function") {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Enlarged image");
  dialog.innerHTML = '<button class="lightbox__close" type="button">Close</button><img alt="">';
  document.body.append(dialog);
  const image = dialog.querySelector("img");
  dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => image.removeAttribute("src"));
  zoomLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      image.alt = link.querySelector("img")?.alt ?? "";
      image.src = link.href;
      dialog.showModal();
    });
  });
}
