/* ============================================================
   Abdallah Abas — Firebase Analytics (optional · isolated)
   Config now lives in SITE_CONFIG.firebase (js/config.js).
   Failure here (ad-blocker / offline) never affects the site.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported, logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const ALLOWED = /(^|\.)abdallahabas\.com$|\.github\.io$/;

async function init() {
  try {
    const cfg = (window.SITE_CONFIG || {}).firebase;
    if (!cfg || !ALLOWED.test(location.hostname)) return;
    if (navigator.doNotTrack === "1") return;

    const app = initializeApp({
      apiKey: cfg.apiKey,
      authDomain: cfg.authDomain,
      projectId: cfg.projectId,
      appId: cfg.appId,
      measurementId: cfg.measurementId
    });
    if (!(await isSupported())) return;
    const analytics = getAnalytics(app);

    const track = (name, params = {}) => {
      try { logEvent(analytics, name, params); } catch (e) { /* never break UX */ }
    };
    window.AA = window.AA || {};
    window.AA.track = track;

    document.addEventListener("click", (e) => {
      const req = e.target.closest("[data-request]");
      if (req) track("service_request_open", { service: req.dataset.request || "unspecified" });

      const lang = e.target.closest("[data-lang]");
      if (lang && lang.dataset.lang !== (window.AA.LANG || "")) {
        track("language_switch", { language: lang.dataset.lang });
      }

      const blog = e.target.closest('a[href*="blog.abdallahabas.com"]');
      if (blog) track("blog_outbound_click");
    }, { passive: true });

    track("page_ready", { page: document.body?.dataset.page || "unknown" });
  } catch (err) { /* analytics must never break the experience */ }
}
init();
