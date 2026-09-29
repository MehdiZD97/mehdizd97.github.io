// Temporary (Stage 2 style guide): Direction C, the live bistatic figure.
// A transmitting and a receiving access point on a baseline; the drone target
// follows the pointer; the ellipse of constant range sum passes through it.
// The static markup comes from _local/tools/hero_static.py (same math).

import { mountHero } from "./hero-core.js";

// Antenna tips (the ellipse's foci), 20 units above the ground line at y = 206.
const TX = [110, 186];
const RX = [450, 186];
const BASE = RX[0] - TX[0];
const BOUNDS = { minX: 44, maxX: 516, minY: 36, maxY: 160 };
const ARC_R = 20;

const figure = document.querySelector("[data-hero='proceedings']");

if (figure) {
  const svg = figure.querySelector("svg");
  const q = (sel) => svg.querySelector(sel);
  const pathTx = q(".bi-path--tx");
  const pathRx = q(".bi-path--rx");
  const ellipse = q(".bi-ellipse");
  const drone = q(".bi-drone");
  const arc = q(".bi-arc");
  const labelT = q(".bi-label--rt");
  const labelR = q(".bi-label--rr");
  const labelB = q(".bi-label--beta");
  const outRange = figure.querySelector("[data-out='range']");
  const outBeta = figure.querySelector("[data-out='beta']");
  const f = (v) => v.toFixed(1);

  const render = ({ x, y }) => {
    const rt = Math.hypot(x - TX[0], y - TX[1]);
    const rr = Math.hypot(RX[0] - x, RX[1] - y);
    const a = (rt + rr) / 2;
    const c = BASE / 2;
    pathTx.setAttribute("x2", f(x));
    pathTx.setAttribute("y2", f(y));
    pathRx.setAttribute("x1", f(x));
    pathRx.setAttribute("y1", f(y));
    ellipse.setAttribute("rx", f(a));
    ellipse.setAttribute("ry", f(Math.sqrt(Math.max(a * a - c * c, 0))));
    drone.setAttribute("transform", `translate(${f(x)} ${f(y)})`);

    // Labels sit just outside each path, on the side away from the ellipse center.
    const place = (label, x1, y1, x2, y2) => {
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const ux = (x2 - x1) / len;
      const uy = (y2 - y1) / len;
      label.setAttribute("x", f((x1 + x2) / 2 + uy * 14));
      label.setAttribute("y", f((y1 + y2) / 2 - ux * 14 + 4));
    };
    place(labelT, TX[0], TX[1], x, y);
    place(labelR, x, y, RX[0], RX[1]);

    // Bistatic angle between the paths back to the two access points.
    const at = Math.atan2(TX[1] - y, TX[0] - x);
    const ar = Math.atan2(RX[1] - y, RX[0] - x);
    arc.setAttribute("d", `M${f(x + ARC_R * Math.cos(at))} ${f(y + ARC_R * Math.sin(at))}`
      + `A${ARC_R} ${ARC_R} 0 0 0 ${f(x + ARC_R * Math.cos(ar))} ${f(y + ARC_R * Math.sin(ar))}`);
    const bx = Math.cos(at) + Math.cos(ar);
    const by = Math.sin(at) + Math.sin(ar);
    const bl = Math.hypot(bx, by) || 1;
    labelB.setAttribute("x", f(x + (bx / bl) * 33));
    labelB.setAttribute("y", f(y + (by / bl) * 33 + 4));

    const cosBeta = ((TX[0] - x) * (RX[0] - x) + (TX[1] - y) * (RX[1] - y)) / (rt * rr);
    outRange.textContent = ((rt + rr) / BASE).toFixed(2);
    outBeta.textContent = String(Math.round((Math.acos(Math.min(1, Math.max(-1, cosBeta))) * 180) / Math.PI));
  };

  const fromPoint = ({ x, y }) => ({
    x: Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, x)),
    y: Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, y)),
  });

  mountHero({ root: figure, svg, initial: { x: 318, y: 70 }, fromPoint, render });
}
