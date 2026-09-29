// Temporary (Stage 2 style guide): Direction A, the steerable array.
// A 16-element uniform linear array with half-wavelength spacing; the polar
// plot shows its array factor from 0 to -30 dB, steered toward the pointer.
// The static markup comes from _local/tools/hero_static.py (same math).

import { mountHero } from "./hero-core.js";

const N = 16;
const CX = 240;
const CY = 236;
const R = 200;
const FLOOR_DB = -30;
const MIN_DEG = 10;
const MAX_DEG = 170;

const figure = document.querySelector("[data-hero='instrument']");

if (figure) {
  const svg = figure.querySelector("svg");
  const beam = svg.querySelector(".scope__beam");
  const ray = svg.querySelector(".scope__ray");
  const needles = [...svg.querySelectorAll(".scope__needle")];
  const outTheta = figure.querySelector("[data-out='theta']");
  const outWidth = figure.querySelector("[data-out='beamwidth']");
  const slider = figure.querySelector("[data-steer]");
  const rad = (deg) => (deg * Math.PI) / 180;
  const clampDeg = (deg) => Math.min(MAX_DEG, Math.max(MIN_DEG, deg));

  const beamPath = (theta0) => {
    const c0 = Math.cos(rad(theta0));
    let d = `M${CX} ${CY}`;
    for (let i = 0; i <= 360; i += 1) {
      const theta = rad(i / 2);
      const psi = Math.PI * (Math.cos(theta) - c0);
      const den = N * Math.sin(psi / 2);
      const af = Math.abs(den) < 1e-9 ? 1 : Math.abs(Math.sin((N * psi) / 2) / den);
      const db = Math.max(20 * Math.log10(Math.max(af, 1e-6)), FLOOR_DB);
      const r = R * (1 - db / FLOOR_DB);
      d += `L${(CX + r * Math.cos(theta)).toFixed(1)} ${(CY - r * Math.sin(theta)).toFixed(1)}`;
    }
    return `${d}Z`;
  };

  // Half-power beamwidth of a uniform array with d = lambda/2, in degrees.
  const beamwidth = (theta0) => ((0.886 * 2) / N / Math.sin(rad(theta0))) * (180 / Math.PI);

  const render = ({ theta }) => {
    beam.setAttribute("d", beamPath(theta));
    ray.setAttribute("x2", (CX + (R + 8) * Math.cos(rad(theta))).toFixed(1));
    ray.setAttribute("y2", (CY - (R + 8) * Math.sin(rad(theta))).toFixed(1));
    const step = -180 * Math.cos(rad(theta)); // progressive phase per element, degrees
    needles.forEach((needle, n) => {
      const x = needle.getAttribute("x1");
      const y = needle.getAttribute("y1");
      needle.setAttribute("transform", `rotate(${(-(n * step) % 360).toFixed(1)} ${x} ${y})`);
    });
    const deg = Math.round(theta);
    outTheta.textContent = String(deg);
    outWidth.textContent = beamwidth(theta).toFixed(1);
    if (document.activeElement !== slider) slider.value = String(deg);
    slider.setAttribute("aria-valuetext", `${deg} degrees`);
  };

  const fromPoint = ({ x, y }) => {
    let deg = (Math.atan2(CY - y, x - CX) * 180) / Math.PI;
    if (deg < 0) deg = x >= CX ? MIN_DEG : MAX_DEG;
    return { theta: clampDeg(deg) };
  };

  const hero = mountHero({
    root: figure.closest(".hero") || figure,
    svg,
    initial: { theta: 115 },
    fromPoint,
    render,
  });

  slider.addEventListener("input", () => hero.set({ theta: Number(slider.value) }));
}
