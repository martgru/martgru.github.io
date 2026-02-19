(function initSite() {
  const header = document.querySelector(".js-site-header");
  const footer = document.querySelector(".js-site-footer");
  const nav = document.querySelector(".js-site-nav");
  const menuToggle = document.querySelector(".js-menu-toggle");
  const track = document.querySelector(".js-carousel-track");
  const slides = Array.from(document.querySelectorAll(".js-slide"));

  if (!header || !footer || !nav || !track || slides.length === 0) {
    return;
  }

  const tabs = [
    { key: "about", label: "About" },
    { key: "music", label: "Music" },
    { key: "mext", label: "MEXT" },
    { key: "research", label: "Research" }
  ];

  const indexByKey = Object.fromEntries(tabs.map((tab, index) => [tab.key, index]));
  let currentIndex = 0;
  let navLinks = [];

  buildNav();
  updateLayoutVars();
  attachEvents();
  setActiveTab(getHashKey() || "about", false);
  setFooterYear();
  updateLayoutVars();
  setupAnalytics("G-FYG36RC008");

  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  function buildNav() {
    const list = document.createElement("ul");

    tabs.forEach((tab) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + tab.key;
      link.textContent = tab.label;
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
    footer.textContent = "© " + year + " Martyna Gruszka. All rights reserved.";
  }
})();

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
