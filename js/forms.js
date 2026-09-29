/* ============================================================
   Abdallah Abas — service request form
   Frontend validation + configurable submission:
     mode "firestore" → Firestore REST (single document create)
     mode "whatsapp"  → opens wa.me with a prepared summary
     mode "email"     → opens mailto with a prepared summary
     mode "endpoint"  → POSTs JSON to SITE_CONFIG.form.endpoint
   HONESTY RULE: the UI never says "sent" unless Firestore (2xx)
   or the endpoint actually confirmed it. On failure the user
   always gets a copyable summary + alternative channels.
   SECURITY: user input is never injected as HTML. The honeypot
   field is never sent to Firestore (rules' hasOnly would reject
   it anyway — by design). Client validation is UX only; the
   security rules are the real gate.
   ============================================================ */
"use strict";

(() => {
  const { t, L, LL, esc: E, icon } = window.AA;

  /* --- dialog template ---------------------------------------- */
  function template() {
    const opts = LL(SITE_CONFIG.services).map(s =>
      `<option value="${E(s.id)}">${E(L(s.name))}</option>`).join("");
    const bud = ["b1", "b2", "b3", "b4", "b5"].map((k, i) =>
      `<option value="${i + 1}">${t("request." + k)}</option>`).join("");
    const con = ["m1", "m2", "m3"].map(k => `<option value="${k}">${t("request." + k)}</option>`).join("");
    const node = document.createElement("div");
    node.className = "dialog dialog-form"; node.setAttribute("role", "dialog");
    node.setAttribute("aria-modal", "true"); node.setAttribute("aria-labelledby", "reqTitle");
    node.innerHTML = `
      <button type="button" class="dialog-close" data-close aria-label="${t("a11y.closeDialog")}">${icon("close")}</button>
      <div class="dialog-body">
        <div class="form-view" id="reqFormView">
          <p class="kicker">${t("cta.request")}</p>
          <h3 id="reqTitle">${t("request.title")}</h3>
          <p class="form-sub">${t("request.sub")}</p>
          <form id="reqForm" novalidate>
            <p class="form-reqd">${t("request.reqd")}</p>
            <div class="form-grid">
              <div class="field">
                <label for="reqName">${t("request.fName")}</label>
                <input id="reqName" name="name" type="text" autocomplete="name" placeholder="${t("request.phName")}" required>
                <span class="field-err" data-err="name" hidden></span>
              </div>
              <div class="field">
                <label for="reqEmail">${t("request.fEmail")}</label>
                <input id="reqEmail" name="email" type="email" autocomplete="email" placeholder="${t("request.phEmail")}" required>
                <span class="field-err" data-err="email" hidden></span>
              </div>
              <div class="field">
                <label for="reqPhone">${t("request.fPhone")}</label>
                <input id="reqPhone" name="phone" type="tel" autocomplete="tel" placeholder="${t("request.phPhone")}">
                <span class="field-err" data-err="phone" hidden></span>
              </div>
              <div class="field">
                <label for="reqService">${t("request.fService")}</label>
                <select id="reqService" name="service" required>
                  <option value="" selected></option>${opts}<option value="other">${t("request.fServiceOther")}</option>
                </select>
                <span class="field-err" data-err="service" hidden></span>
              </div>
              <div class="field">
                <label for="reqUrl">${t("request.fUrl")}</label>
                <input id="reqUrl" name="url" type="url" inputmode="url" placeholder="${t("request.phUrl")}">
                <span class="field-err" data-err="url" hidden></span>
              </div>
              <div class="field">
                <label for="reqBudget">${t("request.fBudget")}</label>
                <select id="reqBudget" name="budget"><option value="" selected></option>${bud}</select>
              </div>
              <div class="field">
                <label for="reqContact">${t("request.fContact")}</label>
                <select id="reqContact" name="contactMethod">${con}</select>
              </div>
              <div class="field field-full">
                <label for="reqDesc">${t("request.fDesc")}</label>
                <textarea id="reqDesc" name="description" rows="4" placeholder="${t("request.phDesc")}" required></textarea>
                <span class="field-err" data-err="desc" hidden></span>
              </div>
              <div class="field field-full">
                <label for="reqNotes">${t("request.fNotes")}</label>
                <textarea id="reqNotes" name="notes" rows="2" placeholder="${t("request.phNotes")}"></textarea>
              </div>
              <!-- honeypot: invisible to humans, tempting to naive bots.
                   Its value is never submitted anywhere. -->
              <div class="field field-full" hidden aria-hidden="true">
                <label for="reqCompany">Company</label>
                <input id="reqCompany" name="company" type="text" tabindex="-1" autocomplete="off">
              </div>
              <div class="field field-full consent-row">
                <input id="reqConsent" name="consent" type="checkbox" required>
                <label for="reqConsent">${t("request.consent")}</label>
              </div>
              <span class="field-err field-full" data-err="consent" hidden></span>
            </div>
            <button type="submit" class="btn btn-solid btn-block" id="reqSubmit">${icon("send")}<span>${t("request.submit")}</span></button>
          </form>
        </div>
        <div class="form-success" id="reqSuccessView" tabindex="-1" hidden>
          <span class="success-ico">${icon("check")}</span>
          <h3>${t("request.successTitle")}</h3>
          <p id="reqSuccessMsg"></p>
          <div id="reqSuccessActions" class="success-actions"></div>
          <h4 class="sub-title">${t("request.summaryTitle")}</h4>
          <pre class="summary-box num" id="reqSummary" tabindex="0"></pre>
          <button type="button" class="btn btn-ghost btn-s" id="reqCopyBtn">${icon("copy")}<span>${t("request.copy")}</span></button>
        </div>
      </div>`;
    return node;
  }

  /* --- helpers -------------------------------------------------- */
  function val(id) { const el = $(id); return el ? el.value.trim() : ""; }
  const showErr = (k, msg) => {
    const el = $(`[data-err="${k}"]`);
    if (!el) return;
    el.textContent = msg; el.hidden = !msg;
    const input = $(`#req${k.charAt(0).toUpperCase() + k.slice(1)}`);
    if (input) { input.classList.toggle("invalid", !!msg); input.setAttribute("aria-invalid", msg ? "true" : "false"); }
  };

  function validate() {
    let ok = true;
    const fail = (k, msg) => { showErr(k, msg); ok = false; };
    const clear = k => showErr(k, "");
    ["name", "email", "phone", "url", "desc", "service", "consent"].forEach(clear);
    if (val("#reqName").length < 2) fail("name", t("request.errName"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("#reqEmail"))) fail("email", t("request.errEmail"));
    const phone = val("#reqPhone").replace(/[\s()-]/g, "");
    if (phone && !/^\+?\d{7,15}$/.test(phone)) fail("phone", t("request.errPhone"));
    const url = val("#reqUrl");
    if (url && !/^https?:\/\/[^\s]+\.[^\s]+/i.test(url)) fail("url", t("request.errUrl"));
    if (val("#reqDesc").length < 20) fail("desc", t("request.errDesc"));
    if (!val("#reqService")) fail("service", t("request.errService"));
    if (!$("#reqConsent").checked) fail("consent", t("request.errConsent"));
    return ok;
  }

  function serviceName(id) {
    const s = LL(SITE_CONFIG.services).find(x => x.id === id);
    return s ? L(s.name) : t("request.fServiceOther");
  }

  function buildSummary() {
    const label = k => t("request." + k).replace(/\s*\*$/, "");
    const budgetSel = $("#reqBudget");
    const budget = val("#reqBudget") && budgetSel
      ? budgetSel.options[budgetSel.selectedIndex].textContent : "—";
    const contactSel = $("#reqContact");
    const contact = contactSel ? contactSel.options[contactSel.selectedIndex].textContent : "";
    return [
      `${t("request.title")} — ${SITE_CONFIG.brandName}`,
      `${label("fName")}: ${val("#reqName")}`,
      `${label("fEmail")}: ${val("#reqEmail")}`,
      val("#reqPhone") ? `${label("fPhone")}: ${val("#reqPhone")}` : null,
      `${label("fService")}: ${serviceName(val("#reqService"))}`,
      val("#reqUrl") ? `${label("fUrl")}: ${val("#reqUrl")}` : null,
      `${label("fBudget")}: ${budget}`,
      `${label("fContact")}: ${contact}`,
      `${label("fDesc")}: ${val("#reqDesc")}`,
      val("#reqNotes") ? `${label("fNotes")}: ${val("#reqNotes")}` : null
    ].filter(Boolean).join("\n");
  }

  /* --- Firestore submission (REST · zero SDK weight) ------------ */
  function collectPayload() {
    const p = {
      name: val("#reqName").slice(0, 80),
      email: val("#reqEmail").slice(0, 120),
      service: val("#reqService"),
      serviceLabel: serviceName(val("#reqService")).slice(0, 60),
      description: val("#reqDesc").slice(0, 3000),
      contactMethod: val("#reqContact") || "m1",
      language: AA.LANG,
      sourcePage: location.pathname.slice(0, 100)
    };
    const phone = val("#reqPhone").replace(/[\s()-]/g, "");
    if (phone) p.phone = phone.slice(0, 30);
    if (val("#reqUrl")) p.website = val("#reqUrl").slice(0, 200);
    if (val("#reqBudget")) p.budget = val("#reqBudget");
    if (val("#reqNotes")) p.notes = val("#reqNotes").slice(0, 1000);
    return p;
  }

  async function submitToFirestore(payload) {
    const f = SITE_CONFIG.firebase;
    if (!f || !f.projectId || !f.apiKey) return false;
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(f.projectId)}`
              + `/databases/(default)/documents/${encodeURIComponent(f.collection || "service_requests")}`
              + `?key=${encodeURIComponent(f.apiKey)}`;
    const fields = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (v) fields[k] = { stringValue: String(v) };   // القواعد ترفض أي شيء غير نصي
    });
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields })
      });
      if (!res.ok) {
        /* رسالة Google تحسم التشخيص — لكن لا تفترض أن الجسم JSON */
        let reason = `HTTP ${res.status}`;
        try {
          const data = await res.json();
          reason = data?.error?.message || reason;
        } catch (e) { /* جسم غير JSON — نبقي الحالة فقط */ }
        console.error("[AA] Firestore rejected the request:", reason);
      }
      return res.ok;                                   // 2xx فقط → "تم الإرسال" صادقة
    } catch (e) {
      console.error("[AA] Firestore network failure:", e?.message || e);
      return false;
    }
  }

  /* --- success view ---------------------------------------------- */
  function showSuccess(summary, kind, mailtoHref) {
    $("#reqFormView").hidden = true;
    const view = $("#reqSuccessView");
    view.hidden = false;
    $("#reqSuccessMsg").textContent = t("request." + kind);
    const actions = $("#reqSuccessActions");
    actions.innerHTML = "";
    if (kind === "successWa" && SITE_CONFIG.whatsapp) {
      const a = document.createElement("a");
      a.className = "btn btn-solid btn-s"; a.href =
        `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(summary)}`;
      a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "WhatsApp";
      actions.appendChild(a);
    }
    if (kind === "successMail" && mailtoHref) {
      const a = document.createElement("a");
      a.className = "btn btn-solid btn-s"; a.href = mailtoHref;
      a.textContent = t("request.m1");
      actions.appendChild(a);
    }
    $("#reqSummary").textContent = summary;
    $("#reqCopyBtn").onclick = () => {
      if (navigator.clipboard) navigator.clipboard.writeText(summary).then(() => AA.toast(t("toast.copied")));
    };
    view.focus();   // قارئات الشاشة تعرف أن العرض تغيّر
  }

  /* --- open / submit ---------------------------------------------- */
  window.AA.openRequest = preselect => {
    const c = SITE_CONFIG;
    /* البوابة تتحقق من القناة الفعلية المطلوبة للوضع المضبوط */
    const mode = c.form.mode;
    const canSubmit =
      (mode === "firestore" && c.firebase && c.firebase.projectId && c.firebase.apiKey) ||
      (mode === "endpoint"  && !!c.form.endpoint) ||
      (mode === "whatsapp"  && !!c.whatsapp) ||
      (mode === "email"     && !!c.email);
    if (!canSubmit) { AA.toast(t("contact.noMethods")); return; }

    const node = template();
    AA.openDialog(node);
    if (preselect) $("#reqService").value = preselect;

    $("#reqForm").addEventListener("submit", e => {
      e.preventDefault();

      /* honeypot filled → bot. Close silently, send nothing. */
      if (val("#reqCompany")) { AA.closeDialog(); return; }

      if (!validate()) return;

      const summary = buildSummary();
      const btn = $("#reqSubmit");
      const m = c.form.mode;

      /* --- Firestore (primary) -------------------------------- */
      if (m === "firestore") {
        btn.disabled = true;
        btn.querySelector("span").textContent = t("request.sending");
        submitToFirestore(collectPayload())
          .then(ok => {
            btn.disabled = false;
            btn.querySelector("span").textContent = t("request.submit");
            showSuccess(summary, ok ? "successApi" : "errApi");
          })
          .catch(() => {
            btn.disabled = false;
            btn.querySelector("span").textContent = t("request.submit");
            showSuccess(summary, "errApi");
          });
        return;
      }

      /* --- External endpoint ----------------------------------- */
      if (m === "endpoint") {
        btn.disabled = true;
        btn.querySelector("span").textContent = t("request.sending");
        fetch(c.form.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(collectPayload())
        }).then(r => {
          btn.disabled = false; btn.querySelector("span").textContent = t("request.submit");
          showSuccess(summary, r.ok ? "successApi" : "errApi");
        }).catch(() => {
          btn.disabled = false; btn.querySelector("span").textContent = t("request.submit");
          showSuccess(summary, "errApi");
        });
        return;
      }

      /* --- WhatsApp / email fallbacks --------------------------- */
      if (m === "whatsapp") {
        if (!c.whatsapp) { AA.toast(t("contact.noMethods")); return; }
        window.open(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(summary)}`, "_blank", "noopener");
        showSuccess(summary, "successWa");
        return;
      }
      const href = `mailto:${c.email}?subject=${encodeURIComponent(t("request.emailSubject"))}&body=${encodeURIComponent(summary)}`;
      showSuccess(summary, "successMail", href);
    });
  };
})();
