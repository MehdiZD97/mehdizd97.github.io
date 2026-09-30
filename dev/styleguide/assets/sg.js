// Style guide only: BibTeX panels (Stage 6 moves them into the site's
// publication script) and live contrast ratios for the palette table.
// The theme toggle, the phone menu, and the header underline come from
// the site's own script (/assets/js/site.js).

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
