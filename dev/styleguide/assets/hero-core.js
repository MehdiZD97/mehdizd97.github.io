// Temporary (Stage 2 style guide): shared behavior for the hero prototypes.
// Pointer and touch input, easing toward the target, reduced motion, and
// pausing while the hero is off screen or the tab is hidden.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/**
 * @param {object} options
 * @param {Element} options.root       element that receives pointer input
 * @param {SVGSVGElement} options.svg  drawing whose coordinates the state uses
 * @param {object} options.initial    static state, e.g. { theta: 115 }
 * @param {(point: {x: number, y: number}) => object} options.fromPoint
 *        maps a point in SVG coordinates to a (clamped) state
 * @param {(state: object) => void} options.render
 * @param {number} [options.tau]       easing time constant in milliseconds
 */
export function mountHero({ root, svg, initial, fromPoint, render, tau = 120 }) {
  let state = { ...initial };
  let target = { ...initial };
  let frame = 0;
  let last = 0;
  let visible = true;
  let pressed = false;

  const toState = (event) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return fromPoint({ x: point.x, y: point.y });
  };

  const step = (now) => {
    frame = 0;
    const dt = last ? Math.min(now - last, 64) : 16;
    last = now;
    const k = 1 - Math.exp(-dt / tau);
    let settled = true;
    for (const key of Object.keys(target)) {
      state[key] += (target[key] - state[key]) * k;
      if (Math.abs(target[key] - state[key]) > 0.02) settled = false;
    }
    render(state);
    if (settled) last = 0;
    else request();
  };

  const request = () => {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(step);
  };

  const set = (next, { instant = false } = {}) => {
    if (!next) return;
    target = { ...next };
    if (instant || reducedMotion.matches) {
      state = { ...next };
      render(state);
    } else {
      request();
    }
  };

  root.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches) return;
    if (event.pointerType === "mouse" || pressed) set(toState(event));
  });
  root.addEventListener("pointerdown", (event) => {
    if (reducedMotion.matches || event.pointerType === "mouse") return;
    pressed = true;
    set(toState(event));
  });
  const release = () => { pressed = false; };
  root.addEventListener("pointerup", release);
  root.addEventListener("pointercancel", release);
  root.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !reducedMotion.matches) set(initial);
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    root.classList.toggle("is-paused", !visible);
    if (visible) request();
  }).observe(root);

  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("is-paused", document.hidden);
    if (!document.hidden) request();
  });

  reducedMotion.addEventListener("change", () => set(initial, { instant: true }));

  root.classList.add("is-live");
  return { set };
}
