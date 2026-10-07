// Style guide only: live contrast ratios for the palette table. The theme
// toggle, the phone menu, the header underline, the hero, and the BibTeX
// panels come from the site's own scripts (/assets/js/).

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
