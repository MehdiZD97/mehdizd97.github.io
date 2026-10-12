// Site behavior (PLAN 3.2, 3.5, 6.3, 7.2, 8.1, and 9): the theme toggle, the
// phone menu, the underline that follows the section in view (the header
// menu on Home, the contents list on the CV), Copy buttons and the BibTeX
// windows, the lightbox for zoomable figures, click-to-play videos, and the
// Back button on publication and story pages. Loaded as a module on every
// page. Each feature runs on its own, so a problem in one cannot stop the
// others. Smooth scrolling needs no script: it is CSS (_sass/shared/_reset),
// and the BibTeX windows open with the browser's own popovers.

const root = document.documentElement;

const run = (name, feature) => {
  try {
    feature();
  } catch (error) {
    console.error(`site.js: ${name} failed`, error);
  }
};

// Theme: light unless the visitor picked dark with the toggle (D9); the
// choice is remembered. The inline head script applies it before paint;
// the browser's bar color (theme-color) follows.
run("theme", () => {
  const isDark = () => root.getAttribute("data-theme") === "dark";
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  const barColor = document.querySelector("meta[name='theme-color'][data-dark]");
  const sync = () => {
    toggles.forEach((button) => button.setAttribute("aria-pressed", String(isDark())));
    if (barColor) barColor.content = isDark() ? barColor.dataset.dark : barColor.dataset.light;
  };
  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (error) { /* storage unavailable */ }
      sync();
    });
  });
  sync();
});

// Phone menu: a disclosure; Escape closes it and returns focus to the button.
run("menu", () => {
  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");
  if (!menuButton || !menu) return;
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
});

// The underline that follows the section in view, in the header menu on
// pages with in-page sections (Home) and in the CV's contents list: the last
// section whose top has passed a reading line 35% down the window is current
// (the last one once the page is scrolled to the end); above the first
// section, the first item is.
run("section underline", () => {
  const spyGroups = [
    [...document.querySelectorAll(".site-nav a[href^='#']")],
    [...document.querySelectorAll("[data-toc] a[href^='#']")],
  ].filter((links) => links.length);
  if (!spyGroups.length) return;
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
});

// Copy buttons (the BibTeX windows and the BibTeX on a publication's page):
// put the text on the clipboard and say whether that worked; if it did not,
// select the text so the visitor can copy it by hand.
run("copy", () => {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    const source = document.getElementById(button.dataset.copy);
    const status = button.parentElement.querySelector("[data-copy-status]");
    if (!source || !status) return;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(source.textContent);
        status.textContent = "Copied";
      } catch (error) {
        getSelection().selectAllChildren(source);
        status.textContent = "Could not copy: the text is selected, so press Ctrl+C (Cmd+C on a Mac)";
      }
    });
  });
});

// BibTeX windows (Mehdi, Stages 8 and 9): the BibTeX button opens its
// window with the browser's own popover (no script needed); here, opening
// one moves focus to its Copy button and clears the last "Copied".
run("BibTeX", () => {
  document.querySelectorAll(".bib-pop[popover]").forEach((pop) => {
    pop.addEventListener("toggle", (event) => {
      if (event.newState !== "open") return;
      const status = pop.querySelector("[data-copy-status]");
      if (status) status.textContent = "";
      pop.querySelector("[data-copy]")?.focus();
    });
  });
});

// Zoomable figures (publication pages): a link marked data-zoom opens its
// image in a dialog with the figure's caption. Escape, Close, or a click
// outside the image closes it, and focus returns to the link. Without a
// dialog element the link just opens the image. Story photos do not zoom
// (Mehdi, Stage 8).
run("zoom", () => {
  const zoomLinks = document.querySelectorAll("a[data-zoom]");
  if (!zoomLinks.length || typeof HTMLDialogElement !== "function") return;
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
});

// Videos (PLAN 8.1): each thumbnail links to its video on YouTube. With
// JavaScript it becomes a Play button that swaps in the player from
// youtube-nocookie.com (at data-start seconds, if set), so nothing loads
// from YouTube until the visitor asks; starting a video pauses the others.
run("videos", () => {
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
});

// Back button (publication and story pages; Mehdi, Stage 7): after a visit
// from another page of this site it works like the browser's Back button, so
// the visitor returns to the same place on the page they came from. Arriving
// from elsewhere, through an old URL's redirect, or in a new tab, it stays a
// link to the list page. Every page notes its path in this tab's session
// storage; a visit counts as "from this site" when the referrer is the page
// noted last. The decision is kept in history.state for reloads.
run("Back button", () => {
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
  if (!backLink) return;
  let fromSite = history.state?.backFromSite;
  if (typeof fromSite !== "boolean") {
    let referrer = null;
    try { referrer = new URL(document.referrer); } catch (error) { /* no referrer */ }
    fromSite = Boolean(referrer) && referrer.origin === location.origin && history.length > 1
      && (!pageNoted || referrer.pathname === lastPage);
    try { history.replaceState({ ...history.state, backFromSite: fromSite }, ""); } catch (error) { /* keep going */ }
  }
  if (!fromSite) return;
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
});
