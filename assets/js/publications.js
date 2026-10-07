// Publications page (PLAN 6.1): search titles, authors, and venues, and
// filter by type and topic. Without JavaScript the whole list shows and the
// controls stay hidden. The filters live in the URL (?kind=journal&topic=isac&q=admm),
// so a filtered view can be linked, as the topic links on publication pages do.

const form = document.querySelector("[data-pub-filters]");

if (form) {
  const entries = [...document.querySelectorAll(".pub[data-type]")];
  const groups = [...document.querySelectorAll("[data-pub-group]")];
  const search = form.querySelector("[data-pub-search]");
  const count = form.querySelector("[data-pub-count]");
  const empty = document.querySelector("[data-pub-empty]");
  const reset = document.querySelector("[data-pub-reset]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Search ignores case and accents ("Bjorn" finds "Björn").
  const fold = (text) => text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const fields = [".pub-title", ".pub-authors", ".pub-venue", ".pub-venue-short"];
  const haystack = new Map(entries.map((entry) => [
    entry,
    fold(fields.map((selector) => entry.querySelector(selector)?.textContent ?? "").join(" ")),
  ]));
  entries.forEach((entry) => entry.addEventListener("animationend", () => entry.classList.remove("is-entering")));

  const radios = (name) => [...form.querySelectorAll(`input[name="${name}"]`)];
  const checked = (name) => radios(name).find((radio) => radio.checked)?.value ?? "";
  const check = (name, value) => {
    const radio = radios(name).find((r) => r.value === value) ?? radios(name).find((r) => r.value === "");
    if (radio) radio.checked = true;
  };

  const matches = (entry, { kind, topic, words }) => {
    if (kind === "under-review" ? entry.dataset.status !== "under-review" : kind && entry.dataset.type !== kind) return false;
    if (topic && !entry.dataset.topics.split(" ").includes(topic)) return false;
    return words.every((word) => haystack.get(entry).includes(word));
  };

  let announce = 0;
  const apply = ({ updateUrl = true } = {}) => {
    const kind = checked("kind");
    const topic = checked("topic");
    const query = search.value.trim();
    const words = fold(query).split(/\s+/).filter(Boolean);
    let shown = 0;
    entries.forEach((entry) => {
      const show = matches(entry, { kind, topic, words });
      if (show && entry.hidden && !reducedMotion.matches) entry.classList.add("is-entering");
      entry.hidden = !show;
      if (show) shown += 1;
    });
    groups.forEach((group) => { group.hidden = !group.querySelector(".pub:not([hidden])"); });
    empty.hidden = shown > 0;

    // The count is a live region: wait for a pause in typing before it speaks.
    clearTimeout(announce);
    announce = setTimeout(() => {
      count.textContent = shown === entries.length ? `${shown} publications` : `${shown} of ${entries.length} publications`;
    }, 250);

    if (updateUrl) {
      const params = new URLSearchParams();
      if (kind) params.set("kind", kind);
      if (topic) params.set("topic", topic);
      if (query) params.set("q", query);
      const next = params.toString();
      history.replaceState(null, "", next ? `?${next}` : location.pathname);
    }
  };

  // Start from the URL, so linked views open filtered.
  const params = new URLSearchParams(location.search);
  check("kind", params.get("kind") ?? "");
  check("topic", params.get("topic") ?? "");
  search.value = params.get("q") ?? "";
  if (params.toString()) apply({ updateUrl: false });

  form.addEventListener("change", () => apply());
  search.addEventListener("input", () => apply());
  form.addEventListener("submit", (event) => event.preventDefault());
  reset?.addEventListener("click", () => {
    check("kind", "");
    check("topic", "");
    search.value = "";
    apply();
    search.focus();
  });
}
