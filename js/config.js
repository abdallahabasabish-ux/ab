/* ============================================================
   Abdallah Abas — central configuration
   Everything editable lives here. Bilingual fields use { en, ar }.
   ============================================================ */
"use strict";

const SITE_CONFIG = {

  /* --- Brand ------------------------------------------------ */
  brandName: "Abdallah Abas",
  siteUrl: "https://abdallahabas.com",               // الرابط الرسمي
  logo: { src: "" },                                 // e.g. "assets/images/logo.svg" (فارغ = مونوغرام مدمج)

  /* --- Destinations ----------------------------------------- */
  blogUrl: "https://blog.abdallahabas.com",          // رابط المدونة
  cvUrl: "",                                         // e.g. "assets/abdallah-abas-cv.pdf"

  /* --- Direct contact (اتركه "" ليختفى تلقائيًا) ------------- */
  email: "",                                         // e.g. "contact@abdallahabas.com"
  whatsapp: "",                                      // أرقام فقط بصيغة دولية، e.g. "249912345678"
  social: {
    facebook: "", linkedin: "", instagram: "",
    telegram: "", github: ""
  },

  /* --- Firebase (analytics + service requests) -------------- */
  firebase: {
    projectId: "abdallahsst",
    apiKey: "AIzaSyDg-oSbA_UdlzMS8HZGE0pHtr_zWg5rrXY",
    appId: "1:1011946194938:web:6c71030a6da4074b68c643",
    measurementId: "G-P8VBBK21WK",
    authDomain: "abdallahsst.firebaseapp.com",
    collection: "service_requests"                   // مجموعة Firestore لطلبات الخدمة
  },

  /* --- Service request form --------------------------------- */
  form: {
    mode: "firestore",        // "firestore" | "whatsapp" | "email" | "endpoint"
    endpoint: ""              // يُستخدم فقط عندما mode = "endpoint"
  },

  /* --- Stats: أرقام حقيقية فقط (0 = تظهر "—") --------------- */
  stats: { projects: 0, certificates: 0, years: 0, articles: 0 },

  /* --- Expertise -------------------------------------------- */
  expertise: [
    { en: "Website development",      ar: "تطوير المواقع" },
    { en: "Technical SEO",            ar: "SEO التقني" },
    { en: "On-page SEO",              ar: "التحسين المضموني" },
    { en: "AdSense readiness",        ar: "تهيئة AdSense" },
    { en: "Blogger",                  ar: "بلوجر" },
    { en: "WordPress",                ar: "ووردبريس" },
    { en: "Google Search Console",    ar: "Google Search Console" },
    { en: "SEO content",              ar: "محتوى SEO" },
    { en: "Website audits",           ar: "فحص المواقع" },
    { en: "Performance optimization", ar: "تحسين الأداء" }
  ],

  /* --- Services --------------------------------------------- */
  /* ملاحظة: معرّفات id هنا يجب أن تبقى مطابقة لقائمة enum
     في firestore.rules — أي إضافة خدمة تتطلب تحديث القواعد.   */
  services: [
    { id: "web-dev", icon: "code",
      name: { en: "Website Development", ar: "تطوير المواقع" },
      desc: { en: "Professional, responsive websites built around your goals — fast, accessible, and easy to maintain.",
              ar: "مواقع احترافية متجاوبة مبنية حول أهدافك — سريعة، ومتوافقة مع المعايير، وسهلة الصيانة." },
      benefits: { en: ["Clean, standards-based code", "Mobile-first responsive layouts", "Structure aligned with business goals"],
                  ar: ["كود نظيف قائم على المعايير", "تصميم متجاوب يبدأ من الجوال", "بنية تتماشى مع أهداف النشاط"] } },
    { id: "seo", icon: "search",
      name: { en: "SEO", ar: "تحسين محركات البحث" },
      desc: { en: "Technical and on-page optimization that helps search engines understand — and rank — your content.",
              ar: "تحسين تقني ومضموني يساعد محركات البحث على فهم محتواك وترتيبه." },
      benefits: { en: ["Technical audit & fixes", "On-page structure & metadata", "Search Console integration"],
                  ar: ["فحص تقني وإصلاح المشكلات", "بنية الصفحات والبيانات الوصفية", "ربط Search Console والمتابعة"] } },
    { id: "adsense", icon: "shield",
      name: { en: "AdSense Website Review", ar: "مراجعة موقع AdSense" },
      desc: { en: "A structured review of your website against Google's published requirements and best practices — preparation and optimization, never a guarantee of approval.",
              ar: "مراجعة منظمة لموقعك وفق المتطلبات المنشورة من Google وأفضل الممارسات — تهيئة وتحسين، دون أي ضمان بالقبول." },
      benefits: { en: ["Policy-focused content review", "Required pages & structure check", "Prioritized fixes list"],
                  ar: ["مراجعة المحتوى وفق السياسات", "التحقق من الصفحات والبنية المطلوبة", "قائمة إصلاحات مرتبة بالأولوية"] } },
    { id: "blog-setup", icon: "layout",
      name: { en: "Blog Setup & Optimization", ar: "إعداد وتحسين المدونات" },
      desc: { en: "Blogger and WordPress setup done right: structure, navigation, SEO basics, and the legal pages every serious blog needs.",
              ar: "إعداد بلوجر ووردبريس بشكل صحيح: البنية، والتصفح، وأساسيات SEO، والصفحات القانونية التي تحتاجها كل مدوّنة جادة." },
      benefits: { en: ["Full blog architecture", "Essential legal pages", "Navigation & category structure"],
                  ar: ["بنية مدوّنة متكاملة", "الصفحات القانونية الأساسية", "هيكلة الأقسام والتصفح"] } },
    { id: "seo-content", icon: "pen",
      name: { en: "SEO Content", ar: "محتوى SEO" },
      desc: { en: "Search-oriented content, structured for humans first and search engines second.",
              ar: "محتوى موجّه للبحث، منظم للقارئ أولًا ثم لمحركات البحث." },
      benefits: { en: ["Keyword-driven outlines", "Clear heading hierarchy", "Metadata & internal linking"],
                  ar: ["هياكل مبنية على الكلمات المفتاحية", "تسلسل عناوين واضح", "بيانات وصفية وربط داخلي"] } },
    { id: "optimization", icon: "gauge",
      name: { en: "Website Optimization", ar: "تحسين المواقع" },
      desc: { en: "Performance, usability, and technical SEO improvements that make your site faster and easier to use.",
              ar: "تحسينات في الأداء وسهولة الاستخدام وSEO التقني تجعل موقعك أسرع وأسهل استخدامًا." },
      benefits: { en: ["Core Web Vitals focus", "UX & readability improvements", "Clean, efficient structure"],
                  ar: ["التركيز على مؤشرات Core Web Vitals", "تحسين تجربة الاستخدام والقراءة", "بنية نظيفة وفعّالة"] } },
    { id: "search-console", icon: "terminal",
      name: { en: "Google Search Console Setup", ar: "إعداد Google Search Console" },
      desc: { en: "Search Console configuration and verification, so you can see exactly how Google views your site.",
              ar: "إعداد والتحقق من Search Console لترى بدقة كيف يتعامل Google مع موقعك." },
      benefits: { en: ["Verification & sitemap submission", "Indexing issue monitoring", "Basic reports walkthrough"],
                  ar: ["التحقق وإرسال خريطة الموقع", "متابعة مشكلات الفهرسة", "شرح التقارير الأساسية"] } },
    { id: "audit", icon: "audit",
      name: { en: "Website Audit", ar: "فحص شامل للمواقع" },
      desc: { en: "A comprehensive technical and SEO review with a clear, prioritized action plan.",
              ar: "مراجعة تقنية وشاملة لـ SEO مع خطة عمل واضحة ومرتبة بالأولوية." },
      benefits: { en: ["Full technical checklist", "Content & structure assessment", "Prioritized recommendations"],
                  ar: ["قائمة فحص تقنية شاملة", "تقييم المحتوى والبنية", "توصيات مرتبة بالأولوية"] } },
    { id: "consulting", icon: "compass",
      name: { en: "Digital Consulting", ar: "استشارات رقمية" },
      desc: { en: "Practical guidance based on your website and objectives — no generic advice, no exaggerated promises.",
              ar: "إرشاد عملي مبني على موقعك وأهدافك — بلا نصائح عامة وبلا وعود مبالغ فيها." },
      benefits: { en: ["Goal-focused session", "Clear next steps", "Honest technical assessment"],
                  ar: ["جلسة مركزة على أهدافك", "خطوات تالية واضحة", "تقييم تقني صريح"] } }
  ],

  /* --- Portfolio ---------------------------------------------
     العناصر أدناه نماذج موسومة بـ sample:true (تظهر شارة "نموذج").
     استبدلها بمشاريع حقيقية واحذف الخاصية sample.             */
  portfolio: [
    { id: "p1", sample: true, category: "websites", year: "2025",
      title: { en: "Sample — Business Website", ar: "نموذج — موقع تعريفي" },
      desc: { en: "Sample entry showing how project cards work. Replace it with a real project in js/config.js.",
              ar: "عنصر توضيحي يشرح شكل بطاقة المشروع. استبدله بمشروع حقيقي في js/config.js." },
      services: { en: "Development, on-page SEO", ar: "تطوير، تحسين مضموني" },
      tech: ["HTML", "CSS", "JavaScript"], link: "", image: "",
      caseStudy: {
        challenge:      { en: "A growing business needed a website that loads fast, works on every device, and presents its services clearly.",
                          ar: "كان النشاط بحاجة إلى موقع سريع يعمل على جميع الأجهزة ويعرض خدماته بوضوح." },
        analysis:       { en: "The existing pages mixed content with heavy markup, had no metadata, and lacked a clear heading structure.",
                          ar: "كانت الصفحات الحالية تخلط المحتوى بأكواد ثقيلة، دون بيانات وصفية أو تسلسل عناوين واضح." },
        solution:       { en: "A rebuild on clean semantic HTML, a responsive layout, and an on-page SEO structure defined before writing content.",
                          ar: "إعادة بناء بـ HTML دلالي نظيف، وتخطيط متجاوب، وبنية SEO محددة قبل كتابة المحتوى." },
        implementation: { en: "Semantic templates, image optimization, metadata, internal linking, and Search Console verification.",
                          ar: "قوالب دلالية، وضغط الصور، وبيانات وصفية، وربط داخلي، والتحقق من Search Console." },
        result:         { en: "Implementation focused on improving speed, structure and page experience. Measured outcomes are added once real data is available.",
                          ar: "ركّز التنفيذ على تحسين السرعة والبنية وتجربة الصفحة. تُضاف النتائج المقاسة عند توفر بيانات حقيقية." }
      } },
    { id: "p2", sample: true, category: "blogs", year: "2025",
      title: { en: "Sample — Blog Optimization", ar: "نموذج — تحسين مدوّنة" },
      desc: { en: "Sample entry for a Blogger/WordPress optimization project. Replace it with a real project in js/config.js.",
              ar: "عنصر توضيحي لمشروع تحسين بلوجر/ووردبريس. استبدله بمشروع حقيقي في js/config.js." },
      services: { en: "Blogger setup, SEO, legal pages", ar: "إعداد بلوجر، SEO، صفحات قانونية" },
      tech: ["Blogger", "Search Console"], link: "", image: "", caseStudy: null }
  ],
  portfolioCategories: ["websites", "seo", "blogs", "platforms", "education", "ecommerce", "other"],

  /* --- Certificates: لا تُخترع أبدًا. أضف الحقيقية فقط. ----- */
  certificates: [
    /* { id: "c1", title: {en:"…", ar:"…"}, org: {en:"…", ar:"…"},
       date: "2025-06-01", credentialId: "…", verifyUrl: "…",
       image: "assets/certificates/c1.jpg" } */
  ],

  /* --- Achievements: لا تُخترع أبدًا. أضف الحقيقية فقط. ----- */
  achievements: [
    /* { id:"a1", category:"writing", year:"2025",
       title:{en:"…",ar:"…"}, org:{en:"…",ar:"…"}, desc:{en:"…",ar:"…"} } */
  ],

  /* --- Articles (بوابة نحو المدونة على blog.abdallahabas.com) - */
  articles: [
    { id: "ar1", sample: true, category: "seo", date: "2025-06-12", slug: "/sample-seo-basics",
      title: { en: "Sample — SEO Basics for New Blogs", ar: "نموذج — أساسيات SEO للمدونات الجديدة" },
      desc:  { en: "Sample entry showing how article cards link to the blog. Replace with real articles once published.",
               ar: "عنصر توضيحي يشرح ارتباط بطاقات المقالات بالمدوّنة. استبدله بمقالات حقيقية بعد نشرها." } },
    { id: "ar2", sample: true, category: "websites", date: "2025-05-28", slug: "/sample-adsense-checklist",
      title: { en: "Sample — An AdSense Readiness Checklist", ar: "نموذج — قائمة فحص تهيئة AdSense" },
      desc:  { en: "Sample entry. Replace with real articles once the blog is live.",
               ar: "عنصر توضيحي. استبدله بمقالات حقيقية بعد إطلاق المدوّنة." } },
    { id: "ar3", sample: true, category: "blogs", date: "2025-05-10", slug: "/sample-blogger-structure",
      title: { en: "Sample — Structuring a Blogger Blog", ar: "نموذج — هيكلة مدوّنة بلوجر" },
      desc:  { en: "Sample entry. Replace with real articles once the blog is live.",
               ar: "عنصر توضيحي. استبدله بمقالات حقيقية بعد إطلاق المدوّنة." } }
  ],
  articleCategories: { seo: "SEO", websites: "Websites", blogs: "Blogs", content: "Content", other: "Other" },

  /* --- Testimonials: لا تُخترع أبدًا. فارغة حتى توفر حقيقية. - */
  testimonials: []
};
