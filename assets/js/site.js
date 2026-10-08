// Site behavior (PLAN 3.2, 3.5, 6.3, 7.2, and 8.1): the theme toggle, smooth
// scrolling for in-page links, the phone menu, the underline that follows
// the section in view (the header menu on Home, the contents list on the
// CV), the BibTeX window and Copy buttons, the lightbox for zoomable
// figures, click-to-play videos, and the Back button on publication and
// story pages. Loaded as a module on every page.

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

// Smooth scrolling for in-page links (Mehdi, Stage 6), switched on just
// before the jump: with it always on, Chrome also glides through its scroll
// restoration when a page is reloaded or reached with Back.
document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a[href*='#']");
  if (link && link.hash && link.pathname === location.pathname && link.search === location.search) {
    root.classList.add("smooth-scroll");
  }
}, true);

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

// The underline that follows the section in view, in the header menu on
// pages with in-page sections (Home) and in the CV's contents list: the last
// section whose top has passed a reading line 35% down the window is current
// (the last one once the page is scrolled to the end); above the first
// section, the first item is.
const spyGroups = [
  [...document.querySelectorAll(".site-nav a[href^='#']")],
  [...document.querySelectorAll("[data-toc] a[href^='#']")],
].filter((links) => links.length);
if (spyGroups.length) {
  let queued = false;
  const update = () => {
    queued = false;
    const line = window.innerHeight * 0.35;
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    spyGroups.forEach((links) => {
      let current = 0;
      links.forEach((link, i) => {
        const section = document.getElementById(link.hash.slice(1));
        if (section && section.getBoundingClientRect().top <= line) current = i;
      });
      if (atEnd && window.scrollY > 0) current = links.length - 1;
      links.forEach((link, i) => {
        if (i === current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
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

// Copying: puts text on the clipboard and says whether that worked; if it
// did not, the text is selected so the visitor can copy it by hand.
const copyText = async (text, status, selectable) => {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied";
  } catch (error) {
    if (selectable) getSelection().selectAllChildren(selectable);
    status.textContent = "Could not copy: the text is selected, so press Ctrl+C (Cmd+C on a Mac)";
  }
};

// BibTeX (Mehdi, Stage 8): the BibTeX button on a publication entry opens a
// small window with the entry and a Copy button. Escape, Close, or a click
// outside closes it, and focus returns to the button.
const bibButtons = document.querySelectorAll("[data-bibtex]");
if (bibButtons.length && typeof HTMLDialogElement === "function") {
  const dialog = document.createElement("dialog");
  dialog.className = "bib-dialog";
  dialog.setAttribute("aria-labelledby", "bib-dialog-title");
  dialog.setAttribute("aria-describedby", "bib-dialog-paper");
  dialog.innerHTML = `
    <div class="bib-dialog__body">
      <div class="bib-dialog__head">
        <h2 class="bib-dialog__title" id="bib-dialog-title">BibTeX</h2>
        <button class="btn btn--secondary btn--small bib-dialog__close" type="button">Close</button>
      </div>
      <p class="bib-dialog__paper" id="bib-dialog-paper"></p>
      <pre class="bib-dialog__text"></pre>
      <p class="bib-dialog__actions">
        <button class="btn btn--primary btn--small" type="button" autofocus data-bib-copy><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>Copy</button>
        <span class="bib-dialog__status" role="status"></span>
      </p>
    </div>`;
  document.body.append(dialog);
  const paper = dialog.querySelector(".bib-dialog__paper");
  const text = dialog.querySelector(".bib-dialog__text");
  const status = dialog.querySelector(".bib-dialog__status");
  let opener = null;
  dialog.querySelector(".bib-dialog__close").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-bib-copy]").addEventListener("click", () => copyText(text.textContent, status, text));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => opener?.focus());
  bibButtons.forEach((button) => {
    button.addEventListener("click", () => {
      opener = button;
      paper.textContent = button.dataset.bibtexTitle ?? "";
      text.textContent = button.dataset.bibtex;
      status.textContent = "";
      dialog.showModal();
    });
  });
}

// Inline Copy buttons (the BibTeX on a publication's own page).
document.querySelectorAll("[data-copy]").forEach((button) => {
  const source = document.getElementById(button.dataset.copy);
  const status = button.parentElement.querySelector("[data-copy-status]");
  button.addEventListener("click", () => copyText(source.textContent, status, source));
});

// Zoomable figures (publication pages): a link marked data-zoom opens its
// image in a dialog with the figure's caption. Escape, Close, or a click
// outside the image closes it, and focus returns to the link. Without a
// dialog element the link just opens the image. Story photos do not zoom
// (Mehdi, Stage 8).
const zoomLinks = document.querySelectorAll("a[data-zoom]");
if (zoomLinks.length && typeof HTMLDialogElement === "function") {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Enlarged image");
  dialog.innerHTML = '<div class="lightbox__bar"><button class="lightbox__close" type="button">Close</button></div><img alt=""><p class="lightbox__caption"></p>';
  document.body.append(dialog);
  const image = dialog.querySelector("img");
  const caption = dialog.querySelector(".lightbox__caption");
  let opener = null;
  dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    opener?.focus();
  });
  zoomLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      opener = link;
      image.alt = link.querySelector("img")?.alt ?? "";
      image.src = link.href;
      const text = link.closest("figure")?.querySelector("figcaption")?.textContent.trim() ?? "";
      caption.textContent = text;
      caption.hidden = !text;
      dialog.showModal();
    });
  });
}

// Videos (PLAN 8.1): each thumbnail links to its video on YouTube. With
// JavaScript it becomes a Play button that swaps in the player from
// youtube-nocookie.com (at data-start seconds, if set), so nothing loads
// from YouTube until the visitor asks; starting a video pauses the others.
const playing = [];
document.querySelectorAll("a[data-video]").forEach((link) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = link.className;
  button.append(...link.childNodes);
  link.replaceWith(button);
  button.addEventListener("click", () => {
    const params = new URLSearchParams({ autoplay: "1", rel: "0", enablejsapi: "1", origin: location.origin });
    if (link.dataset.start) params.set("start", link.dataset.start);
    const frame = document.createElement("iframe");
    frame.className = "player__frame";
    frame.src = `https://www.youtube-nocookie.com/embed/${link.dataset.video}?${params}`;
    frame.title = link.dataset.title || "YouTube video";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    playing.forEach((other) => {
      other.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "https://www.youtube-nocookie.com");
    });
    playing.push(frame);
    button.closest(".player")?.classList.add("is-playing");
    button.replaceWith(frame);
    frame.focus();
  });
});

// Back button (publication and story pages; Mehdi, Stage 7): after a visit
// from another page of this site it works like the browser's Back button, so
// the visitor returns to the same place on the page they came from. Arriving
// from elsewhere, through an old URL's redirect, or in a new tab, it stays a
// link to the list page. Every page notes its path in this tab's session
// storage; a visit counts as "from this site" when the referrer is the page
// noted last. The decision is kept in history.state for reloads.
let lastPage = null;
const notePage = () => {
  try {
    sessionStorage.setItem("last-page", location.pathname);
    return true;
  } catch (error) {
    return false;
  }
};
try { lastPage = sessionStorage.getItem("last-page"); } catch (error) { /* storage unavailable */ }
const pageNoted = notePage();
window.addEventListener("pageshow", (event) => { if (event.persisted) notePage(); });

const backLink = document.querySelector("[data-back]");
if (backLink) {
  let fromSite = history.state?.backFromSite;
  if (typeof fromSite !== "boolean") {
    let referrer = null;
    try { referrer = new URL(document.referrer); } catch (error) { /* no referrer */ }
    fromSite = Boolean(referrer) && referrer.origin === location.origin && history.length > 1
      && (!pageNoted || referrer.pathname === lastPage);
    try { history.replaceState({ ...history.state, backFromSite: fromSite }, ""); } catch (error) { /* keep going */ }
  }
  if (fromSite) {
    backLink.querySelector("[data-back-label]").textContent = "Back";
    backLink.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      // In-page links (such as the skip link) add history entries for this
      // same page; keep stepping back until the previous page loads.
      const again = () => history.back();
      window.addEventListener("popstate", again);
      window.addEventListener("pagehide", () => window.removeEventListener("popstate", again), { once: true });
      history.back();
    });
  }
}
