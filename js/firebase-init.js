/* ============================================================
   Abdallah Abas — Firebase Analytics (optional · isolated · deferred)
   v2 — fully off the critical path:
   · dynamic import(): NOTHING is fetched from gstatic until the
     main thread goes idle (static module imports would still
     compete for bandwidth during page load)
   · failure here (ad-blocker / offline / CSP) never affects
     the site — every step is guarded
   · config lives in SITE_CONFIG.firebase (js/config.js)
   NOTE: Firebase web API keys are public identifiers, NOT
   secrets. Restrict the key by HTTP referrer in Google Cloud.
   ============================================================ */

const ALLOWED = /(^|\.)abdallahabas\.com$|\.github\.io$/;
const SDK     = "https://www.gstatic.com/firebasejs/10.12.2";

async function init() {
  try {
    const cfg = (window.SITE_CONFIG || {}).firebase;
    if (!cfg || !ALLOWED.test(location.hostname)) return;
    if (navigator.doNotTrack === "1") return;           // احترام DNT

    const [{ initializeApp }, { getAnalytics, isSupported, logEvent }] =
      await Promise.all([
        import(`${SDK}/firebase-app.js`),
        import(`${SDK}/firebase-analytics.js`)
      ]);

    const app = initializeApp({
      apiKey: cfg.apiKey,
      authDomain: cfg.authDomain,
      projectId: cfg.projectId,
      appId: cfg.appId,
      measurementId: cfg.measurementId
    });
    if (!(await isSupported())) return;                 // متصفحات قديمة / file://
    const analytics = getAnalytics(app);

    const track = (name, params = {}) => {
      try { logEvent(analytics, name, params); } catch (e) { /* لا أثر على UX أبدًا */ }
    };
    window.AA = window.AA || {};
    window.AA.track = track;

    /* أحداث مسار التحويل — تفويض ذاتي الغلاف */
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
  } catch (err) { /* التحليلات لا تكسر التجربة أبدًا */ }
}

/* الإقلاع بعد فراغ الخيط — صفر أثر على LCP/TBT/INP.
   مقايضة مقبولة صراحةً: نقرات أول ثانيتين قد لا تُسجَّل. */
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => { init(); }, { timeout: 2500 });
} else {
  window.addEventListener("load", () => setTimeout(() => { init(); }, 600));
}
