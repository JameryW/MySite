const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const orbitTarget = document.querySelector(".radar-panel");
const orbA = document.querySelector(".orb-a");
const orbB = document.querySelector(".orb-b");
const currentPage = document.body.dataset.page;
const yearNodes = document.querySelectorAll("[data-year]");
const scrollProgressNode = document.querySelector("[data-scroll-progress]");
const backToTopButton = document.querySelector("[data-back-to-top]");
const homeProjectsNode = document.querySelector("[data-home-projects]");
const homeNotesNode = document.querySelector("[data-home-notes]");
const projectLibraryNode = document.querySelector("[data-project-library]");
const noteLibraryNode = document.querySelector("[data-note-library]");
const projectCountNodes = document.querySelectorAll("[data-project-count]");
const noteCountNodes = document.querySelectorAll("[data-note-count]");
const projectDetailNode = document.querySelector("[data-project-detail]");
const noteDetailNode = document.querySelector("[data-note-detail]");
const siteData = window.siteData || { projects: [], notes: [] };
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && reduceMotion) cursorGlow.style.display = "none";

/* ── Page Loader ── */
const loader = document.querySelector(".page-loader");
if (loader) {
  const dismiss = () => loader.classList.add("loaded");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", dismiss);
  } else {
    dismiss();
  }
}

/* ── Unified Pointer Tracking (rAF-throttled) ── */
let pointerX = 0;
let pointerY = 0;
let pointerFrame = false;

let glowTarget = null;
let glowEvent = null;

const tiltSelector = ".ops-card, .stack-card, .track-card, .metric-panel, .lab-card";

document.addEventListener("pointermove", (e) => {
  pointerX = e.clientX;
  pointerY = e.clientY;

  /* Card glow tracking */
  const card = e.target.closest(".repo-card, .note-card, .work-card");
  glowTarget = card;
  glowEvent = card ? e : null;

  /* Card tilt target */
  const tiltCard = !reduceMotion ? e.target.closest(tiltSelector) : null;

  if (!pointerFrame) {
    pointerFrame = true;
    requestAnimationFrame(() => {
      pointerFrame = false;
      if (cursorGlow) {
        cursorGlow.style.left = pointerX + "px";
        cursorGlow.style.top = pointerY + "px";
      }
      if (!reduceMotion) {
        const x = (pointerX / window.innerWidth - 0.5) * 16;
        const y = (pointerY / window.innerHeight - 0.5) * 16;
        if (orbitTarget) orbitTarget.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg)`;
        if (orbA) orbA.style.transform = `translate(${x * -1.6}px, ${y * -1.6}px)`;
        if (orbB) orbB.style.transform = `translate(${x * 1.2}px, ${y * 1.2}px)`;
      }
      if (glowTarget && glowEvent) {
        const rect = glowTarget.getBoundingClientRect();
        glowTarget.style.setProperty("--glow-x", ((glowEvent.clientX - rect.left) / rect.width * 100) + "%");
        glowTarget.style.setProperty("--glow-y", ((glowEvent.clientY - rect.top) / rect.height * 100) + "%");
      }
      if (tiltCard) {
        const rect = tiltCard.getBoundingClientRect();
        const tx = (pointerX - rect.left) / rect.width - 0.5;
        const ty = (pointerY - rect.top) / rect.height - 0.5;
        tiltCard.style.transform = `perspective(800px) rotateY(${tx * 4}deg) rotateX(${-ty * 4}deg) translateZ(4px)`;
      }
    });
  }
});

/* Card tilt reset on pointerout */
if (!reduceMotion) {
  document.addEventListener("pointerout", (e) => {
    const card = e.target.closest(tiltSelector);
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    }
  });
}

/* ── Theme Toggle ── */
const themeToggle = document.querySelector(".theme-toggle");
function setTheme(theme) {
  document.documentElement.classList.add("theme-transitioning");
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("theme-transitioning");
    });
  });
}
if (themeToggle) {
  /* Restore saved theme */
  const saved = localStorage.getItem("theme");
  if (saved) setTheme(saved);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

/* ── Mobile Menu Toggle ── */
const menuToggle = document.querySelector(".menu-toggle");
const topbarMeta = document.querySelector(".topbar-meta");
if (menuToggle && topbarMeta) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("open");
    topbarMeta.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      const firstLink = topbarMeta.querySelector(".nav a");
      if (firstLink) firstLink.focus();
    }
  });
}

/* ── Smooth Page Transitions ── */
document.querySelectorAll(".nav a, .footer-links a, .brand").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("http")) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.add("page-transitioning");
    setTimeout(() => {
      window.location.href = href;
    }, 180);
  });
});

const createTagList = (items) =>
  items.map((item) => `<span>${item}</span>`).join("");

const pageHeroPanelMarkup = (title, items) => `
  <aside class="page-hero-panel reveal" aria-label="${title}">
    <p class="stack-label">${title}</p>
    <div class="page-hero-panel-grid">
      ${items
        .map(
          (item) => `
            <div>
              <span>${item.label}</span>
              <strong>${item.value}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  </aside>
`;

const projectDetailHref = (project) => `./project.html?slug=${project.slug}`;
const noteDetailHref = (note) => `./note.html?slug=${note.slug}`;
const projectBySlug = new Map(siteData.projects.map((project) => [project.slug, project]));
const noteBySlug = new Map(siteData.notes.map((note) => [note.slug, note]));

const getSiblingEntries = (entries, currentSlug) => {
  const index = entries.findIndex((entry) => entry.slug === currentSlug);
  const safeIndex = index >= 0 ? index : 0;

  return {
    previous: entries[safeIndex - 1] || null,
    next: entries[safeIndex + 1] || null
  };
};

const relatedProjectMarkup = (project) => `
  <a class="track-card reveal related-card" href="${projectDetailHref(project)}">
    <p class="stack-label">${project.label}</p>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <div class="card-actions">
      <span class="repo-meta">open project detail</span>
      <span class="card-inline-link">${project.status}</span>
    </div>
  </a>
`;

const relatedNoteMarkup = (note) => `
  <a class="track-card reveal related-card" href="${noteDetailHref(note)}">
    <p class="stack-label">${note.label}</p>
    <h3>${note.title}</h3>
    <p>${note.summary}</p>
    <div class="card-actions">
      <span class="repo-meta">open note detail</span>
      <span class="card-inline-link">${note.meta}</span>
    </div>
  </a>
`;

const detailPagerMarkup = (options) => {
  const { previous, next, previousHref, nextHref, previousLabel, nextLabel } = options;

  if (!previous && !next) {
    return "";
  }

  return `
    <section class="section">
      <div class="detail-pager">
        ${
          previous
            ? `
              <a class="track-card reveal related-card pager-card" href="${previousHref(previous)}">
                <p class="stack-label">Previous</p>
                <h3>${previous.title}</h3>
                <p>${previousLabel(previous)}</p>
                <span class="repo-meta">go back one</span>
              </a>
            `
            : '<div class="pager-spacer" aria-hidden="true"></div>'
        }
        ${
          next
            ? `
              <a class="track-card reveal related-card pager-card" href="${nextHref(next)}">
                <p class="stack-label">Next</p>
                <h3>${next.title}</h3>
                <p>${nextLabel(next)}</p>
                <span class="repo-meta">keep reading</span>
              </a>
            `
            : '<div class="pager-spacer" aria-hidden="true"></div>'
        }
      </div>
    </section>
  `;
};

const projectCardMarkup = (project, variant) => {
  if (variant === "home") {
    return `
      <a class="work-card reveal" href="${projectDetailHref(project)}">
        <div class="work-index">${project.code}</div>
        <div class="work-copy">
          <p class="card-topline">
            ${project.label}
            <span class="card-status-dot ${project.status.toLowerCase().includes('active') || project.status.toLowerCase().includes('production') || project.status.toLowerCase().includes('live') ? 'live' : 'dev'}" aria-hidden="true"></span>
          </p>
          <h3>${project.title}</h3>
          <p>${project.summary}</p>
          <div class="card-tags">${createTagList(project.stack)}</div>
          <div class="card-actions">
            <span class="work-link">open detail</span>
            <span class="card-inline-link">${project.cta}</span>
          </div>
        </div>
      </a>
    `;
  }

  return `
    <a class="repo-card reveal project-entry-card" href="${projectDetailHref(project)}">
      <p class="stack-label">
        ${project.label}
        <span class="card-status-dot ${project.status.toLowerCase().includes('active') || project.status.toLowerCase().includes('production') || project.status.toLowerCase().includes('live') ? 'live' : 'dev'}" aria-hidden="true"></span>
      </p>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="project-entry-meta">
        <span class="project-entry-status">${project.status}</span>
        <div class="card-tags">${createTagList(project.stack)}</div>
      </div>
      <div class="card-actions">
        <span class="repo-meta">${project.timeframe}</span>
        <span class="card-inline-link">${project.cta}</span>
      </div>
    </a>
  `;
};

const noteCardMarkup = (note) => `
  <a class="note-card reveal note-entry-card" href="${noteDetailHref(note)}">
    <p class="stack-label">${note.label}</p>
    <h3>${note.title}</h3>
    <p>${note.summary}</p>
    <div class="card-actions">
      <span class="note-meta">open detail page</span>
      <span class="card-inline-link">${note.meta}</span>
    </div>
  </a>
`;

document.querySelectorAll(".nav a").forEach((link) => {
  const href = link.getAttribute("href");
  const pageMap = {
    "./index.html": "home",
    "./projects.html": "projects",
    "./notes.html": "notes",
    "./about.html": "about"
  };

  if (href && pageMap[href] === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

if (homeProjectsNode) {
  const featuredProjects = siteData.projects.filter((project) => project.featured);
  homeProjectsNode.innerHTML = featuredProjects.map((project) => projectCardMarkup(project, "home")).join("");
}

if (projectLibraryNode) {
  projectLibraryNode.innerHTML = siteData.projects.map((project) => projectCardMarkup(project, "library")).join("");
}

if (homeNotesNode) {
  homeNotesNode.innerHTML = siteData.notes.slice(0, 3).map(noteCardMarkup).join("");
}

if (noteLibraryNode) {
  noteLibraryNode.innerHTML = siteData.notes.map(noteCardMarkup).join("");
}

if (projectCountNodes.length > 0) {
  projectCountNodes.forEach((node) => {
    node.textContent = siteData.projects.length;
  });
}

if (noteCountNodes.length > 0) {
  noteCountNodes.forEach((node) => {
    node.textContent = siteData.notes.length;
  });
}

/* ── Filter/Tag System for Library Pages ── */
function setupFilter(container, items) {
  const allLabels = new Set();
  items.forEach((item) => {
    if (item.label) allLabels.add(item.label);
  });

  if (allLabels.size < 2 || !container) return;

  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";

  const allPill = document.createElement("button");
  allPill.className = "filter-pill active";
  allPill.textContent = "All";
  allPill.setAttribute("aria-pressed", "true");
  filterBar.appendChild(allPill);

  allLabels.forEach((label) => {
    const pill = document.createElement("button");
    pill.className = "filter-pill";
    pill.textContent = label;
    pill.dataset.filterLabel = label;
    pill.setAttribute("aria-pressed", "false");
    filterBar.appendChild(pill);
  });

  container.parentNode.insertBefore(filterBar, container);

  filterBar.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;

    filterBar.querySelectorAll(".filter-pill").forEach((p) => {
      p.classList.remove("active");
      p.setAttribute("aria-pressed", "false");
    });
    pill.classList.add("active");
    pill.setAttribute("aria-pressed", "true");

    const activeLabel = pill.dataset.filterLabel || null;
    const cards = container.querySelectorAll(":scope > a");
    cards.forEach((card) => {
      if (!activeLabel) {
        card.style.display = "";
        return;
      }
      const cardLabel = card.querySelector(".stack-label, .card-topline, .note-meta");
      card.style.display = (cardLabel && cardLabel.textContent.includes(activeLabel)) ? "" : "none";
    });
  });
}

if (projectLibraryNode) {
  setupFilter(projectLibraryNode, siteData.projects);
}

if (noteLibraryNode) {
  setupFilter(noteLibraryNode, siteData.notes);
}

/* ── Activity Feed ── */
if (projectDetailNode) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const project = projectBySlug.get(slug);
  const relatedNotes = project ? (project.relatedNotes || [])
    .map((entrySlug) => noteBySlug.get(entrySlug))
    .filter(Boolean) : [];
  const siblings = project ? getSiblingEntries(siteData.projects, project.slug) : { previous: null, next: null };

  if (!project) {
    projectDetailNode.innerHTML = `
      <section class="page-hero" style="display:flex;align-items:center;justify-content:center;min-height:60vh;text-align:center;">
        <div>
          <p class="section-kicker" style="margin-bottom:12px;">404</p>
          <h1 class="page-title" style="max-width:none;">Project Not Found</h1>
          <p class="page-lead" style="max-width:36ch;margin:16px auto 32px;">This project doesn't exist yet, or the slug is incorrect.</p>
          <div class="page-actions" style="justify-content:center;">
            <a class="button primary" href="./projects.html">Back to Projects</a>
            <a class="button secondary" href="./index.html">Home</a>
          </div>
        </div>
      </section>
    `;
  } else {
    document.title = `Jamery Wang | ${project.title}`;
    projectDetailNode.setAttribute("aria-busy", "true");
    projectDetailNode.innerHTML = `
      <section class="page-hero reveal">
        <p class="eyebrow">${project.label} / ${project.timeframe} / ${project.status}</p>
        <h1 class="page-title">
          ${project.title}
          <span>${project.detailTitle}</span>
        </h1>
        <div class="hero-tags">${createTagList(project.stack)}</div>
        <p class="page-lead">${project.overview}</p>
        <div class="page-actions">
          <a class="button primary" href="${project.href}" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="vertical-align:-3px;margin-right:6px;"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            View on GitHub
          </a>
          <a class="button secondary" href="./projects.html">Back To Projects</a>
        </div>
        ${pageHeroPanelMarkup("Project Signal", [
          { label: "Status", value: project.status },
          { label: "Role", value: project.role },
          { label: "Output", value: project.outputs.slice(0, 2).join(" / ") }
        ])}
      </section>

      <section class="section">
        <div class="page-status-grid">
          <article class="status-panel reveal">
            <p class="stack-label">Role</p>
            <h3>${project.role}</h3>
            <p>${project.summary}</p>
          </article>
          <article class="status-panel reveal">
            <p class="stack-label">Output</p>
            <div class="status-list">
              ${project.outputs
                .map(
                  (item) => `
                    <div>
                      <span>Signal</span>
                      <strong>${item}</strong>
                    </div>
                  `
                )
                .join("")}
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="section-head reveal">
          <p class="section-kicker">Highlights</p>
          <h2>Key Design Decisions</h2>
          <p class="section-summary">${project.title} 的核心设计选择和技术亮点。</p>
        </div>
        <div class="build-track-grid">
          ${project.highlights
            .map(
              (item, index) => `
                <article class="track-card reveal">
                  <p class="stack-label">Highlight 0${index + 1}</p>
                  <h3>${project.label}</h3>
                  <p>${item.trim()}</p>
                  <span class="repo-meta">${project.timeframe}</span>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      ${relatedNotes.length > 0 ? `
      <section class="section">
        <div class="section-head reveal">
          <p class="section-kicker">Related Notes</p>
          <h2>Linked Thinking</h2>
          <p class="section-summary">从项目继续跳到相关判断和方法论。</p>
        </div>
        <div class="build-track-grid">
          ${relatedNotes.map((note) => relatedNoteMarkup(note)).join("")}
        </div>
      </section>
      ` : ''}

      ${detailPagerMarkup({
        previous: siblings.previous,
        next: siblings.next,
        previousHref: projectDetailHref,
        nextHref: projectDetailHref,
        previousLabel: (entry) => entry.label,
        nextLabel: (entry) => entry.label
       })}
    `;
    projectDetailNode.setAttribute("aria-busy", "false");
    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.focus();
  }
}

if (noteDetailNode) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const note = noteBySlug.get(slug);
  const relatedProjects = note ? (note.relatedProjects || [])
    .map((entrySlug) => projectBySlug.get(entrySlug))
    .filter(Boolean) : [];
  const siblings = note ? getSiblingEntries(siteData.notes, note.slug) : { previous: null, next: null };

  if (!note) {
    noteDetailNode.innerHTML = `
      <section class="page-hero" style="display:flex;align-items:center;justify-content:center;min-height:60vh;text-align:center;">
        <div>
          <p class="section-kicker" style="margin-bottom:12px;">404</p>
          <h1 class="page-title" style="max-width:none;">Note Not Found</h1>
          <p class="page-lead" style="max-width:36ch;margin:16px auto 32px;">This note doesn't exist yet, or the slug is incorrect.</p>
          <div class="page-actions" style="justify-content:center;">
            <a class="button primary" href="./notes.html">Back to Notes</a>
            <a class="button secondary" href="./index.html">Home</a>
          </div>
        </div>
      </section>
    `;
  } else {
    document.title = `Jamery Wang | ${note.title}`;
    noteDetailNode.setAttribute("aria-busy", "true");
    noteDetailNode.innerHTML = `
      <section class="page-hero reveal">
        <p class="eyebrow">${note.label} / ${note.timeframe} / ${note.status}</p>
        <h1 class="page-title">
          ${note.title}
          <span>${note.detailTitle}</span>
        </h1>
        <div class="hero-tags">
          <span>${note.label}</span>
          <span>${note.status}</span>
          <span>${note.meta}</span>
        </div>
        <p class="page-lead">${note.overview}</p>
        <div class="page-actions">
          <a class="button primary" href="./notes.html">Back To Notes</a>
          <a class="button secondary" href="./projects.html">See Related Projects</a>
        </div>
        ${pageHeroPanelMarkup("Note Signal", [
          { label: "Status", value: note.status },
          { label: "Frame", value: note.meta },
          { label: "Output", value: note.outputs.slice(0, 2).join(" / ") }
        ])}
      </section>

      <section class="section">
        <div class="page-status-grid">
          <article class="status-panel reveal">
            <p class="stack-label">Core Lens</p>
            <h3>${note.lens}</h3>
            <p>${note.summary}</p>
          </article>
          <article class="status-panel reveal">
            <p class="stack-label">Outputs</p>
            <div class="status-list">
              ${note.outputs
                .map(
                  (item) => `
                    <div>
                      <span>Signal</span>
                      <strong>${item}</strong>
                    </div>
                  `
                )
                .join("")}
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="section-head reveal">
          <p class="section-kicker">Breakdown</p>
          <h2>Key Points</h2>
          <p class="section-summary">把短笔记扩成可阅读的站内说明，而不是只留一句判断。</p>
        </div>
        <div class="build-track-grid">
          ${note.bullets
            .map(
              (item, index) => `
                <article class="track-card reveal">
                  <p class="stack-label">Point 0${index + 1}</p>
                  <h3>${note.label}</h3>
                  <p>${item}</p>
                  <span class="repo-meta">${note.timeframe}</span>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-head reveal">
          <p class="section-kicker">Related Projects</p>
          <h2>Linked Builds</h2>
          <p class="section-summary">从判断跳回对应的项目入口，让想法和构建产物互相解释。</p>
        </div>
        <div class="build-track-grid">
          ${relatedProjects.map((project) => relatedProjectMarkup(project)).join("")}
        </div>
      </section>

      ${detailPagerMarkup({
        previous: siblings.previous,
        next: siblings.next,
        previousHref: noteDetailHref,
        nextHref: noteDetailHref,
        previousLabel: (entry) => entry.meta,
        nextLabel: (entry) => entry.meta
       })}
    `;
    noteDetailNode.setAttribute("aria-busy", "false");
    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.focus();
  }
}

/* ── Terminal Typing Animation ── */
function animateTerminal() {
  const lines = document.querySelectorAll(".terminal-body p");
  if (!lines.length || reduceMotion) return;

  lines.forEach((line, index) => {
    line.style.opacity = "0";
    line.style.transform = "translateY(8px)";
    line.style.transition = "opacity 400ms ease, transform 400ms ease";

    setTimeout(() => {
      line.style.opacity = "1";
      line.style.transform = "translateY(0)";
    }, 500 + index * 280);
  });
}

const revealNodes = document.querySelectorAll(".reveal");
const emphasisNodes = document.querySelectorAll(".work-card, .command-list p, .ops-command-list p");

if (reduceMotion) {
  revealNodes.forEach((node) => node.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 60, 600)}ms`;
    observer.observe(node);
  });

  emphasisNodes.forEach((node, index) => {
    node.style.transitionDelay = `${120 + index * 60}ms`;
  });

  /* Trigger terminal typing when hero is visible */
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateTerminal();
          heroObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    heroObserver.observe(heroSection);
  }
}

if (yearNodes.length > 0) {
  const year = new Date().getFullYear();
  yearNodes.forEach((node) => {
    node.textContent = year;
  });
}

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;

  if (scrollProgressNode) {
    scrollProgressNode.style.width = `${progress * 100}%`;
  }

  /* Reading progress on detail pages */
  const readingProgress = document.querySelector(".reading-progress");
  if (readingProgress) {
    readingProgress.style.width = `${progress * 100}%`;
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle("visible", scrollTop > 480);
  }
};

let scrollTicking = false;
updateScrollUI();
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateScrollUI();
      scrollTicking = false;
    });
  }
}, { passive: true });

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
}

/* ── Keyboard Navigation ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuToggle && topbarMeta) {
    const wasOpen = menuToggle.classList.contains("open");
    menuToggle.classList.remove("open");
    topbarMeta.classList.remove("open");
    if (wasOpen) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  }
});

/* ── Command Palette ── */
const palette = document.querySelector("[data-palette]");
const paletteOverlay = document.querySelector("[data-palette-overlay]");
const paletteInput = document.querySelector("[data-palette-input]");
const paletteResults = document.querySelector("[data-palette-results]");

if (palette && paletteInput) {
  let activeIndex = 0;
  let currentResults = [];
  let paletteTriggerEl = null;

  const pages = [
    { title: "Home", label: "Page", href: "./index.html" },
    { title: "Projects", label: "Page", href: "./projects.html" },
    { title: "Notes", label: "Page", href: "./notes.html" },
    { title: "About", label: "Page", href: "./about.html" },
    { title: "GitHub Profile", label: "External", href: "https://github.com/jameryw" }
  ];

  function openPalette() {
    paletteTriggerEl = document.activeElement;
    palette.classList.add("open");
    paletteOverlay.classList.add("open");
    paletteInput.value = "";
    paletteInput.focus();
    renderResults("");
  }

  function closePalette() {
    palette.classList.remove("open");
    paletteOverlay.classList.remove("open");
    paletteInput.value = "";
    if (paletteTriggerEl) {
      paletteTriggerEl.focus();
      paletteTriggerEl = null;
    }
  }

  function buildItems(query) {
    const q = query.toLowerCase().trim();
    const items = [];

    /* Pages */
    pages.forEach((p) => {
      if (!q || p.title.toLowerCase().includes(q)) {
        items.push({ title: p.title, label: p.label, href: p.href });
      }
    });

    /* Projects */
    siteData.projects.forEach((p) => {
      if (!q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.stack.join(" ").toLowerCase().includes(q)) {
        items.push({ title: p.title, label: "Project", href: projectDetailHref(p) });
      }
    });

    /* Notes */
    siteData.notes.forEach((n) => {
      if (!q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.label.toLowerCase().includes(q)) {
        items.push({ title: n.title, label: "Note", href: noteDetailHref(n) });
      }
    });

    return items;
  }

  function renderResults(query) {
    currentResults = buildItems(query);
    activeIndex = 0;

    if (currentResults.length === 0) {
      paletteResults.textContent = "";
      const empty = document.createElement("div");
      empty.className = "palette-empty";
      empty.textContent = "没有匹配结果";
      paletteResults.appendChild(empty);
      return;
    }

    paletteResults.textContent = "";

    const grouped = {};
    currentResults.forEach((item) => {
      if (!grouped[item.label]) grouped[item.label] = [];
      grouped[item.label].push(item);
    });

    Object.entries(grouped).forEach(([label, items]) => {
      const groupLabel = document.createElement("div");
      groupLabel.className = "palette-group-label";
      groupLabel.textContent = label;
      paletteResults.appendChild(groupLabel);

      items.forEach((item) => {
        const el = document.createElement("div");
        el.className = "palette-item";
        el.setAttribute("role", "option");
        el.innerHTML = `<span class="palette-item-title">${item.title}</span><span class="palette-item-label">${item.label}</span>`;
        el.addEventListener("click", () => {
          window.location.href = item.href;
        });
        paletteResults.appendChild(el);
      });
    });

    updateActiveItem();
  }

  function updateActiveItem() {
    const items = paletteResults.querySelectorAll(".palette-item");
    items.forEach((el, i) => {
      el.classList.toggle("active", i === activeIndex);
    });
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }

  /* Open with Cmd+K or Ctrl+K */
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (palette.classList.contains("open")) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  /* Open from topbar hint button */
  const paletteTrigger = document.querySelector("[data-palette-trigger]");
  if (paletteTrigger) {
    paletteTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openPalette();
    });
  }

  /* Focus trap: Tab / Shift+Tab cycles within palette */
  palette.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const items = paletteResults.querySelectorAll(".palette-item");
      const focusable = [paletteInput, ...Array.from(items)];
      const idx = focusable.indexOf(document.activeElement);
      let next;
      if (e.shiftKey) {
        next = idx <= 0 ? focusable.length - 1 : idx - 1;
      } else {
        next = idx >= focusable.length - 1 ? 0 : idx + 1;
      }
      focusable[next].focus();
    }
  });

  /* Close with Escape, Arrow navigation, Enter */
  palette.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = paletteResults.querySelectorAll(".palette-item");
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActiveItem();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveItem();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const items = paletteResults.querySelectorAll(".palette-item");
      if (items[activeIndex]) {
        items[activeIndex].click();
      }
    }
  });

  paletteInput.addEventListener("input", () => {
    renderResults(paletteInput.value);
  });

  paletteOverlay.addEventListener("click", closePalette);
}

/* ── Particle Background ── */
const particleCanvas = document.querySelector("[data-particles]");
if (particleCanvas && !reduceMotion) {
  const ctx = particleCanvas.getContext("2d");
  let particles = [];
  let animId;
  let lastFrame = 0;
  const frameInterval = 1000 / 24; // cap at 24fps
  let isLight = document.documentElement.getAttribute("data-theme") === "light";

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = window.innerWidth * dpr;
    particleCanvas.height = window.innerHeight * dpr;
    particleCanvas.style.width = window.innerWidth + "px";
    particleCanvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    const area = window.innerWidth * window.innerHeight;
    const maxCount = window.innerWidth < 760 ? 18 : 40;
    const count = Math.min(Math.floor(area / 24000), maxCount);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5
      });
    }
  }

  function drawParticles(timestamp) {
    animId = requestAnimationFrame(drawParticles);

    // Throttle to ~24fps
    if (timestamp - lastFrame < frameInterval) return;
    lastFrame = timestamp;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const dotColor = isLight ? "80, 90, 140" : "108, 242, 255";
    const w = window.innerWidth;
    const h = window.innerHeight;
    const maxDistSq = 14400;
    const maxDist = 120;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor}, 0.5)`;
      ctx.fill();
    }

    // Spatial grid for O(n) line drawing
    const cols = Math.ceil(w / maxDist);
    const rows = Math.ceil(h / maxDist);
    const grid = new Array(cols * rows);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const cx = Math.min(Math.floor(p.x / maxDist), cols - 1);
      const cy = Math.min(Math.floor(p.y / maxDist), rows - 1);
      const idx = cy * cols + cx;
      if (!grid[idx]) grid[idx] = [];
      grid[idx].push(i);
    }

    const lineColor = isLight ? "80, 90, 140" : "108, 242, 255";

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const cell = grid[cy * cols + cx];
        if (!cell) continue;

        // Check same cell + neighboring cells (right, bottom, bottom-right, bottom-left)
        const neighbors = [cell];
        const right = cx + 1 < cols ? grid[cy * cols + cx + 1] : null;
        const below = cy + 1 < rows ? grid[(cy + 1) * cols + cx] : null;
        const belowRight = cx + 1 < cols && cy + 1 < rows ? grid[(cy + 1) * cols + cx + 1] : null;
        const belowLeft = cx - 1 >= 0 && cy + 1 < rows ? grid[(cy + 1) * cols + cx - 1] : null;
        if (right) neighbors.push(right);
        if (below) neighbors.push(below);
        if (belowRight) neighbors.push(belowRight);
        if (belowLeft) neighbors.push(belowLeft);

        // Lines within same cell
        for (let a = 0; a < cell.length; a++) {
          for (let b = a + 1; b < cell.length; b++) {
            const pa = particles[cell[a]];
            const pb = particles[cell[b]];
            const dx = pa.x - pb.x;
            const dy = pa.y - pb.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.strokeStyle = `rgba(${lineColor}, ${0.15 * (1 - distSq / maxDistSq)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // Lines to neighboring cells
        for (let n = 1; n < neighbors.length; n++) {
          const neighbor = neighbors[n];
          for (let a = 0; a < cell.length; a++) {
            const pa = particles[cell[a]];
            for (let b = 0; b < neighbor.length; b++) {
              const pb = particles[neighbor[b]];
              const dx = pa.x - pb.x;
              const dy = pa.y - pb.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < maxDistSq) {
                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.strokeStyle = `rgba(${lineColor}, ${0.15 * (1 - distSq / maxDistSq)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }
    }
  }

  resizeCanvas();
  createParticles();
  animId = requestAnimationFrame(drawParticles);

  /* Pause animation when tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
      animId = null;
    } else if (!animId) {
      lastFrame = 0;
      animId = requestAnimationFrame(drawParticles);
    }
  });

  /* Debounced resize */
  let resizeTimer;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    animId = null;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createParticles();
      lastFrame = 0;
      animId = requestAnimationFrame(drawParticles);
    }, 200);
  });

  /* Update theme color for particles */
  const themeObserver = new MutationObserver(() => {
    isLight = document.documentElement.getAttribute("data-theme") === "light";
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* ── Service Worker Registration ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
