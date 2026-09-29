// Temporary (Stage 2 style guide): theme toggle, mobile menu, the header
// underline that follows the section in view, BibTeX panels, and live
// contrast ratios for the palette table.

const root = document.documentElement;
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

// Theme: follows the system until the visitor picks one; the choice is remembered.
const effectiveTheme = () => root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");
const syncThemeToggles = () => {
  const dark = effectiveTheme() === "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(dark));
  });
};
document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sg-theme", next); } catch (error) { /* storage unavailable */ }
    syncThemeToggles();
  });
});
systemDark.addEventListener("change", syncThemeToggles);
syncThemeToggles();

// Mobile menu: a disclosure; Escape closes it and returns focus to the button.
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

// The header underline follows the section in view: the last linked section
// whose top has passed a reading line 35% down the window is current.
const spyLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const spyTargets = spyLinks.map((link) => document.getElementById(link.hash.slice(1)));
if (spyLinks.length) {
  let queued = false;
  const updateCurrent = () => {
    queued = false;
    const line = window.innerHeight * 0.35;
    let current = 0;
    spyTargets.forEach((section, i) => {
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
      requestAnimationFrame(updateCurrent);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  updateCurrent();
}

// BibTeX panels with a copy button that reports success or failure.
document.querySelectorAll("[data-bib-toggle]").forEach((button) => {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
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

// WCAG 2.x contrast ratios for the palette table.
const luminance = (hex) => {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(value.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
document.querySelectorAll("[data-contrast]").forEach((cell) => {
  const [fg, bg] = cell.dataset.contrast.split(",");
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  const ratio = (hi + 0.05) / (lo + 0.05);
  cell.textContent = ratio.toFixed(2);
  cell.classList.toggle("is-fail", ratio < Number(cell.dataset.need));
});
