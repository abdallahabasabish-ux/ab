/* ============================================================
   Abdallah Abas — Firebase Analytics (optional · isolated)
   ES module — failure here (ad-blocker / offline) never
   affects the site. No inline JS — CSP compatible.
   NOTE: Firebase web API keys are public identifiers, NOT
   secrets. Restrict the key by HTTP referrer in Google Cloud.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported, logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDg-oSbA_UdlzMS8HZGE0pHtr_zWg5rrXY",
  authDomain: "abdallahsst.firebaseapp.com",
  projectId: "abdallahsst",
  storageBucket: "abdallahsst.firebasestorage.app",
  messagingSenderId: "1011946194938",
  appId: "1:1011946194938:web:6c71030a6da4074b68c643",
  measurementId: "G-P8VBBK21WK"
};

/* Track only the real domains (+ GitHub Pages before DNS
   propagates). Staging/local previews stay untracked.        */
const ALLOWED = /(^|\.)abdallahabas\.com$|\.github\.io$/;

async function init() {
  try {
    if (!ALLOWED.test(location.hostname)) return;
    if (navigator.doNotTrack === "1") return;          // respect DNT (courtesy)

    const app = initializeApp(firebaseConfig);
    if (!(await isSupported())) return;                // e.g. old browsers / file://
    const analytics = getAnalytics(app);

    const track = (name, params = {}) => {
      try { logEvent(analytics, name, params); } catch (e) { /* never break UX */ }
    };
    window.AA = window.AA || {};
    window.AA.track = track;

    /* Conversion-funnel events — self-contained delegation,
       so js/main.js needs no changes.                         */
    document.addEventListener("click", (e) => {
      const req  = e.target.closest("[data-request]");
      if (req) track("service_request_open", { service: req.dataset.request || "unspecified" });

      const lang = e.target.closest("[data-lang]");
      if (lang && lang.dataset.lang !== (window.AA.LANG || "")) {
        track("language_switch", { language: lang.dataset.lang });
      }

      const blog = e.target.closest('a[href*="blog.abdallahabas.com"]');
      if (blog) track("blog_outbound_click");
    }, { passive: true });

    track("page_ready", { page: document.body?.dataset.page || "unknown" });
  } catch (err) {
    /* Analytics must never break the experience — fail silently. */
  }
}
init();
