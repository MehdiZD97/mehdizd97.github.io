// The hero's two views and tabs (Home and the style guide; both styles).
// View 1 (default): cell-free beams; five access points steer onto the pointer.
// View 2: a 16-element uniform linear array (half-wavelength spacing) whose
// beam pattern, from 0 to -30 dB, steers toward the pointer.
// The static markup comes from _local/tools/hero_static.py (same math).

import { cone, mountHero } from "./hero-core.js";

const hero = document.querySelector("[data-hero]");

if (hero) {
  const f = (v) => v.toFixed(1);
  const rad = (deg) => (deg * Math.PI) / 180;
  const tabs = [...hero.querySelectorAll("[role='tab']")];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  let current = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
  const isShown = (panel) => () => panels[current] === panel;

  // Tabs: click, or arrow keys and Home/End (automatic activation).
  const select = (index, { focus = false } = {}) => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].classList.toggle("is-hidden", !on);
      panels[i].inert = !on;
    });
    current = index;
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, { focus: true });
    });
  });
  select(current);

  // View 1: cell-free beams.
  const cellfree = panels.find((panel) => panel.dataset.view === "cellfree");
  if (cellfree) {
    const APS = [[70, 78], [262, 38], [452, 70], [470, 212], [58, 220]];
    const BOUNDS = { minX: 110, maxX: 420, minY: 70, maxY: 222 };
    const svg = cellfree.querySelector("svg");
    const beams = [...svg.querySelectorAll(".hv-beam")];
    const grads = [...svg.querySelectorAll(".hv-grad")];
    const target = svg.querySelector(".hv-target");
    const azimuths = [...cellfree.querySelectorAll("[data-out^='az']")];

    mountHero({
      root: hero,
      svg,
      initial: { x: 300, y: 140 },
      active: isShown(cellfree),
      fromPoint: ({ x, y }) => ({
        x: Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, x)),
        y: Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, y)),
      }),
      render: ({ x, y }) => {
        APS.forEach((ap, i) => {
          const { d, end } = cone(ap, x, y);
          beams[i].setAttribute("d", d);
          grads[i].setAttribute("x2", f(end.x));
          grads[i].setAttribute("y2", f(end.y));
          // Beam azimuth: 0 degrees points east, counterclockwise positive.
          const az = Math.round((Math.atan2(ap[1] - y, x - ap[0]) * 180) / Math.PI);
          azimuths[i].textContent = String((az + 360) % 360);
        });
        target.setAttribute("transform", `translate(${f(x)} ${f(y)})`);
      },
    });
  }

  // View 2: steerable array.
  const array = panels.find((panel) => panel.dataset.view === "array");
  if (array) {
    const N = 16;
    const CX = 260;
    const CY = 236;
    const R = 200;
    const FLOOR_DB = -30;
    const MIN_DEG = 10;
    const MAX_DEG = 170;
    const svg = array.querySelector("svg");
    const pattern = svg.querySelector(".hv-pattern");
    const ray = svg.querySelector(".hv-ray");
    const needles = [...svg.querySelectorAll(".hv-needle")];
    const outTheta = array.querySelector("[data-out='theta']");
    const outWidth = array.querySelector("[data-out='beamwidth']");
    const slider = array.querySelector("[data-steer]");
    const clampDeg = (deg) => Math.min(MAX_DEG, Math.max(MIN_DEG, deg));

    const patternPath = (theta0) => {
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

    const controller = mountHero({
      root: hero,
      svg,
      initial: { theta: 115 },
      active: isShown(array),
      fromPoint: ({ x, y }) => {
        let deg = (Math.atan2(CY - y, x - CX) * 180) / Math.PI;
        if (deg < 0) deg = x >= CX ? MIN_DEG : MAX_DEG;
        return { theta: clampDeg(deg) };
      },
      render: ({ theta }) => {
        pattern.setAttribute("d", patternPath(theta));
        ray.setAttribute("x2", f(CX + (R + 8) * Math.cos(rad(theta))));
        ray.setAttribute("y2", f(CY - (R + 8) * Math.sin(rad(theta))));
        const step = -180 * Math.cos(rad(theta)); // progressive phase per element, degrees
        needles.forEach((needle, n) => {
          const x = needle.getAttribute("x1");
          const y = needle.getAttribute("y1");
          needle.setAttribute("transform", `rotate(${f(-(n * step) % 360)} ${x} ${y})`);
        });
        const deg = Math.round(theta);
        outTheta.textContent = String(deg);
        outWidth.textContent = beamwidth(theta).toFixed(1);
        if (document.activeElement !== slider) slider.value = String(deg);
        slider.setAttribute("aria-valuetext", `${deg} degrees`);
      },
    });
    slider.addEventListener("input", () => controller.set({ theta: Number(slider.value) }));
  }
}
