(function initSite() {
  const content = window.siteContent;
  const header = document.querySelector(".js-site-header");
  const footer = document.querySelector(".js-site-footer");
  const nav = document.querySelector(".js-site-nav");
  const menuToggle = document.querySelector(".js-menu-toggle");
  const track = document.querySelector(".js-carousel-track");

  if (!content || !header || !footer || !nav || !track) {
    return;
  }

  const tabs = Array.isArray(content.nav) ? content.nav : [];

  if (tabs.length === 0) {
    return;
  }

  updateDocumentMeta();
  renderSlides();

  const slides = Array.from(document.querySelectorAll(".js-slide"));
  const indexByKey = Object.fromEntries(tabs.map((tab, index) => [tab.key, index]));
  let currentIndex = 0;
  let navLinks = [];

  buildNav();
  updateLayoutVars();
  attachEvents();
  setActiveTab(getHashKey() || tabs[0].key, false);
  setFooterYear();
  updateLayoutVars();
  setupAnalytics(content.site && content.site.analyticsId);

  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  function updateDocumentMeta() {
    if (content.site && content.site.title) {
      document.title = content.site.title;
    }

    const description = document.querySelector('meta[name="description"]');
    if (description && content.site && content.site.description) {
      description.setAttribute("content", content.site.description);
    }
  }

  function renderSlides() {
    track.innerHTML = "";

    tabs.forEach((tab, index) => {
      const page = content.pages && content.pages[tab.key];
      if (!page) return;

      let slide;

      if (tab.key === "about") {
        slide = renderAboutSlide(tab, page);
      } else if (tab.key === "music") {
        slide = renderMusicSlide(tab, page);
      } else if (tab.key === "mext") {
        slide = renderMextSlide(tab, page);
      } else if (tab.key === "research") {
        slide = renderResearchSlide(tab, page);
      }

      if (!slide) return;
      if (index !== 0) slide.setAttribute("aria-hidden", "true");
      track.appendChild(slide);
    });
  }

  function renderAboutSlide(tab, page) {
    const article = createElement("article", { className: "slide-card split-card" });

    if (page.image && page.image.src) {
      article.appendChild(renderImagePane(page.image));
    }

    const pane = createElement("div", { className: "content-pane slide-scroll" }, [
      createElement("p", { className: "eyebrow", text: page.eyebrow || tab.label })
    ]);

    appendParagraphs(pane, page.paragraphs);
    pane.appendChild(renderIconLinks(page.links));
    if (page.artistLogo && page.artistLogo.src) {
      pane.appendChild(renderArtistLogo(page.artistLogo));
    }
    article.appendChild(pane);

    return renderSlide(tab, article);
  }

  function renderMusicSlide(tab, page) {
    const article = createElement("article", { className: "slide-card music-card" });

    const intro = createElement("div", { className: "music-intro" }, [
      createElement("h2", { className: "section-heading-red", text: page.title || "My Music" })
    ]);

    if (page.albumPreview && page.albumPreview.url) {
      intro.appendChild(renderAlbumPreview(page.albumPreview, page.artistPage));
    }

    const performanceList = createElement("div", { className: "performance-list" });
    (page.performances || []).slice().reverse().forEach((performance) => {
      const embedUrl = getYouTubeEmbedUrl(performance.url);
      const videoContent = embedUrl
        ? createElement("div", { className: "youtube-frame" }, [
            createElement("iframe", {
              attributes: {
                src: embedUrl,
                title: performance.title || "YouTube performance",
                loading: "lazy",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                allowfullscreen: ""
              }
            })
          ])
        : createElement("div", { className: "performance-placeholder", text: performance.url || "Coming soon" });

      performanceList.appendChild(createElement("article", { className: "performance-card" }, [
        createElement("h3", { className: "performance-title", text: performance.title || "Performance" }),
        videoContent
      ]));
    });

    const videos = createElement("section", { className: "music-performances" }, [
      createElement("h2", { className: "section-heading-red", text: page.performanceTitle || "Live Performances" }),
      performanceList
    ]);

    const pane = createElement("div", { className: "content-pane music-layout" }, [intro, videos]);
    article.appendChild(pane);

    return renderSlide(tab, article);
  }

  function renderMextSlide(tab, page) {
    const pane = createElement("div", { className: "content-pane slide-scroll" }, [
      createElement("h2", { className: "section-heading-red", text: page.title || page.eyebrow || tab.label }),
      renderRichParagraph(page.leadParts, page.lead || "", "lead")
    ]);

    pane.appendChild(renderMextCarousel(page.posts || []));

    return renderSlide(
      tab,
      createElement("article", { className: "slide-card" }, [pane]),
      "mext-slide"
    );
  }

  function renderResearchSlide(tab, page) {
    const main = createElement("div", { className: "research-main" }, [
      createElement("h2", { className: "section-heading-red", text: page.eyebrow || tab.label })
    ]);

    appendParagraphs(main, page.paragraphs);
    main.appendChild(createElement("h2", { className: "section-heading-red", text: page.publicationsTitle || "Publications" }));
    main.appendChild(renderPublications(page.publications));

    const topChildren = [main];

    if (page.previewPdf && page.previewPdf.src) {
      topChildren.push(renderResearchPdf(page.previewPdf));
    } else if (page.image && page.image.src) {
      topChildren.push(createElement("aside", { className: "research-aside" }, [
        createElement("figure", { className: "research-figure" }, [
          createElement("img", {
            attributes: {
              src: page.image.src,
              alt: page.image.alt || ""
            }
          })
        ])
      ]));
    }

    const pane = createElement("div", { className: "content-pane research-layout" }, topChildren);

    return renderSlide(
      tab,
      createElement("article", { className: "slide-card research-card" }, [pane])
    );
  }

  function renderSlide(tab, child, extraClassName) {
    const className = ["slide", "js-slide", extraClassName].filter(Boolean).join(" ");
    return createElement("section", {
      className,
      attributes: {
        id: tab.key,
        "data-key": tab.key,
        "aria-label": tab.label
      }
    }, [child]);
  }

  function renderImagePane(image) {
    return createElement("div", { className: "media-pane" }, [
      createElement("img", {
        attributes: {
          src: image.src,
          alt: image.alt || ""
        }
      })
    ]);
  }

  function renderResearchPdf(pdf) {
    return createElement("aside", { className: "research-aside research-pdf" }, [
      createElement("object", {
        attributes: {
          data: pdf.src,
          type: "application/pdf",
          title: pdf.title || "Research PDF preview"
        }
      }, [
        createLink(pdf.src, "Open PDF preview", "text-link")
      ])
    ]);
  }

  function appendParagraphs(parent, paragraphs) {
    (paragraphs || []).forEach((paragraph) => {
      parent.appendChild(createElement("p", { text: paragraph }));
    });
  }

  function renderRichParagraph(parts, fallbackText, className) {
    const paragraph = createElement("p", { className });

    if (!Array.isArray(parts)) {
      paragraph.textContent = fallbackText || "";
      return paragraph;
    }

    parts.forEach((part) => {
      if (typeof part === "string") {
        paragraph.appendChild(document.createTextNode(part));
      } else if (part && part.url) {
        paragraph.appendChild(createLink(part.url, part.text || part.url, "text-link"));
      }
    });

    return paragraph;
  }

  function renderMextCarousel(posts) {
    const viewport = createElement("div", { className: "mext-carousel-viewport" });
    const track = createElement("div", { className: "mext-carousel-track" });

    posts.forEach((post) => {
      track.appendChild(createLink(post.url, "", "mext-post-card"));
      const link = track.lastElementChild;
      link.setAttribute("aria-label", post.title || "MEXT post");

      if (post.image) {
        link.appendChild(createElement("img", {
          attributes: {
            src: post.image,
            alt: post.title || "MEXT post"
          }
        }));
      } else {
        link.appendChild(createElement("span", { className: "mext-post-placeholder", text: post.title || "Post image coming soon" }));
      }
    });

    viewport.appendChild(track);

    const previous = createElement("button", {
      className: "mext-carousel-button",
      text: "Prev",
      attributes: { type: "button", "aria-label": "Show previous MEXT posts" }
    });
    const next = createElement("button", {
      className: "mext-carousel-button",
      text: "Next",
      attributes: { type: "button", "aria-label": "Show next MEXT posts" }
    });

    previous.addEventListener("click", () => {
      viewport.scrollBy({ left: -viewport.clientWidth, behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      viewport.scrollBy({ left: viewport.clientWidth, behavior: "smooth" });
    });

    return createElement("section", { className: "mext-carousel" }, [
      viewport,
      createElement("div", { className: "mext-carousel-actions" }, [previous, next])
    ]);
  }

  function renderIconLinks(links) {
    const list = createElement("ul", { className: "icon-links" });

    (links || []).forEach((link) => {
      const anchor = createLink(link.url, "", "");
      if (link.iconOnly) {
        anchor.classList.add("icon-only");
        anchor.setAttribute("aria-label", link.label || "External link");
      }
      const icon = createElement("i", {
        className: link.icon || "",
        attributes: { "aria-hidden": "true" }
      });

      anchor.appendChild(icon);
      if (!link.iconOnly) {
        anchor.appendChild(createElement("span", { text: link.label || "" }));
      }
      list.appendChild(createElement("li", {}, [anchor]));
    });

    return list;
  }

  function renderArtistLogo(logo) {
    return createElement("div", { className: "about-maru-logo" }, [
      createElement("img", {
        attributes: {
          src: logo.src,
          alt: logo.alt || ""
        }
      })
    ]);
  }

  function renderAlbumPreview(albumPreview, artistPage) {
    const albumLink = createLink(albumPreview.url, albumPreview.title || "Open latest album", "album-preview-card");

    if (albumPreview.image) {
      albumLink.style.backgroundImage = "url('" + albumPreview.image + "')";
    }

    const children = [
      albumLink
    ];

    if (artistPage && artistPage.url) {
      children.push(createElement("p", { className: "artist-page-fallback" }, [
        createLink(artistPage.url, artistPage.label || "Open artist page", "artist-page-link")
      ]));
    }

    return createElement("section", { className: "artist-page-embed" }, children);
  }

  function renderPublications(publications) {
    const list = createElement("ul", { className: "publication-list" });

    (publications || []).forEach((publication) => {
      const item = createElement("li");

      if (publication.url) {
        item.appendChild(createLink(publication.url, publication.title || publication.url, "paper-link"));
      } else {
        item.textContent = publication.title || "";
      }

      list.appendChild(item);
    });

    return list;
  }

  function buildNav() {
    const list = document.createElement("ul");

    tabs.forEach((tab) => {
      const li = document.createElement("li");
      const link = createLink("#" + tab.key, tab.label, "");
      link.dataset.key = tab.key;
      li.appendChild(link);
      list.appendChild(li);
    });

    nav.innerHTML = "";
    nav.appendChild(list);
    navLinks = Array.from(nav.querySelectorAll("a"));
  }

  function attachEvents() {
    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-key]");
      if (!link) return;
      event.preventDefault();
      setActiveTab(link.dataset.key, true);
      closeMobileMenu();
    });

    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        document.body.classList.toggle("menu-open", !expanded);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        const next = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[next].key, true);
      } else if (event.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prev].key, true);
      }
    });

    window.addEventListener("hashchange", () => {
      const key = getHashKey();
      if (key) setActiveTab(key, false);
      closeMobileMenu();
    });

    window.addEventListener("resize", () => {
      updateLayoutVars();
    });

    window.addEventListener("load", () => {
      updateLayoutVars();
    });
  }

  function setActiveTab(key, pushHash) {
    if (!(key in indexByKey)) return;

    currentIndex = indexByKey[key];
    track.style.transform = "translateX(-" + String(currentIndex * 100) + "%)";

    slides.forEach((slide, index) => {
      const active = index === currentIndex;
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      const scrollBox = slide.querySelector(".slide-scroll");
      if (active && scrollBox) {
        scrollBox.scrollTop = 0;
      }
    });

    navLinks.forEach((link) => {
      const active = link.dataset.key === key;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (pushHash) {
      const newHash = "#" + key;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, "", newHash);
      }
    }
  }

  function updateLayoutVars() {
    document.documentElement.style.setProperty("--header-h", String(header.offsetHeight) + "px");
    document.documentElement.style.setProperty("--footer-h", String(footer.offsetHeight) + "px");
  }

  function closeMobileMenu() {
    if (!menuToggle) return;
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function getHashKey() {
    const raw = window.location.hash.replace("#", "").trim().toLowerCase();
    return raw in indexByKey ? raw : "";
  }

  function setFooterYear() {
    const year = new Date().getFullYear();
    const footerName = content.site && content.site.footerName ? content.site.footerName : "Martyna Gruszka";
    footer.textContent = "© " + year + " " + footerName + ". All rights reserved.";
  }
})();

function createElement(tagName, options, children) {
  const element = document.createElement(tagName);
  const settings = options || {};

  if (settings.className) {
    element.className = settings.className;
  }

  if (settings.text !== undefined) {
    element.textContent = settings.text;
  }

  Object.entries(settings.attributes || {}).forEach(([name, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(name, String(value));
    }
  });

  (children || []).forEach((child) => {
    if (child) element.appendChild(child);
  });

  return element;
}

function createLink(url, text, className) {
  const link = createElement("a", {
    className,
    text,
    attributes: { href: url || "#" }
  });

  if (url && !url.startsWith("#") && !url.startsWith("files/")) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  }

  return link;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || "";
    }

    return videoId ? "https://www.youtube.com/embed/" + encodeURIComponent(videoId) : "";
  } catch (error) {
    return "";
  }
}

function setupAnalytics(trackingId) {
  if (!trackingId || window.location.protocol === "file:") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(trackingId);
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", trackingId);
}
