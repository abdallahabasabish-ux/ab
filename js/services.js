/* ============================================================
   Abdallah Abas — services rendering (home featured + full page)
   ============================================================ */
"use strict";

(() => {
  const { t, L, LL, esc: E, icon } = window.AA;

  function card(s, i) {
    return `
      <article class="service-cell">
        <div class="service-top">
          <span class="service-num num mono">${String(i + 1).padStart(2, "0")}</span>
          <span class="service-ico">${icon(s.icon)}</span>
        </div>
        <h3>${E(L(s.name))}</h3>
        <p class="service-desc">${E(L(s.desc))}</p>
        <ul class="benefits">
          ${LL(s.benefits).map(b => `<li>${icon("check", "b-check")}<span>${E(b)}</span></li>`).join("")}
        </ul>
        <button type="button" class="btn-text" data-request="${s.id}">
          <span>${t("cta.request")}</span>${icon("arrow", "icon-flip")}
        </button>
      </article>`;
  }

  AA.onRender(() => {
    const feat = $("#featuredServices");
    if (feat) feat.innerHTML = LL(SITE_CONFIG.services).slice(0, 4).map(card).join("");
    const full = $("#servicesGrid");
    if (full) full.innerHTML = LL(SITE_CONFIG.services).map(card).join("");
  });
})();
