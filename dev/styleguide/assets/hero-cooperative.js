// Temporary (Stage 2 style guide): Direction B, cell-free beams.
// Five distributed access points jointly steer beams onto one target that
// follows the pointer; the target emits sensing echoes (CSS animation).
// The static markup comes from _local/tools/hero_static.py (same math).

import { mountHero } from "./hero-core.js";

const APS = [[48, 70], [204, 32], [356, 64], [366, 222], [54, 236]];
const BOUNDS = { minX: 84, maxX: 326, minY: 78, maxY: 236 };
const HALF_WIDTH_DEG = 6;
const REACH = 1.35; // beams continue past the target, as real beams do

const section = document.querySelector("[data-hero='cooperative']");

if (section) {
  const svg = section.querySelector(".network svg");
  const beams = [...svg.querySelectorAll(".coop-beam")];
  const grads = [...svg.querySelectorAll(".coop-grad")];
  const target = svg.querySelector(".coop-target");
  const tan = Math.tan((HALF_WIDTH_DEG * Math.PI) / 180);
  const f = (v) => v.toFixed(1);

  // A beam widens with distance from its access point and fades past the target.
  const cone = ([ax, ay], tx, ty) => {
    const dx = tx - ax;
    const dy = ty - ay;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const reach = len * REACH;
    const half = reach * tan + 3;
    const ex = ax + ux * reach;
    const ey = ay + uy * reach;
    const end = { x: ex, y: ey };
    const d = `M${ax} ${ay}L${f(ex - uy * half)} ${f(ey + ux * half)}`
      + `Q${f(ex + ux * half)} ${f(ey + uy * half)} ${f(ex + uy * half)} ${f(ey - ux * half)}Z`;
    return { d, end };
  };

  const render = ({ x, y }) => {
    APS.forEach((ap, i) => {
      const { d, end } = cone(ap, x, y);
      beams[i].setAttribute("d", d);
      grads[i].setAttribute("x2", f(end.x));
      grads[i].setAttribute("y2", f(end.y));
    });
    target.setAttribute("transform", `translate(${f(x)} ${f(y)})`);
  };

  const fromPoint = ({ x, y }) => ({
    x: Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, x)),
    y: Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, y)),
  });

  mountHero({ root: section, svg, initial: { x: 236, y: 136 }, fromPoint, render });
}
