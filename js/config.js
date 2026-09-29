/* ============================================================
   Abdallah Abas — central configuration
   Everything editable lives here. Bilingual fields use { en, ar }.
   ⚠ هذا الملف يُعدَّل كثيرًا — كل قيمة نصية بين "..." وكل سطر
     ينتهي بفاصلة. خطأ نحوي هنا يعطّل الموقع بالكامل.
   ============================================================ */
"use strict";

const SITE_CONFIG = {

  /* --- Brand ------------------------------------------------ */
  brandName: "Abdallah Abas",
  siteUrl: "https://abdallahabas.com",               // الرابط الرسمي
  logo: { src: "assets/images/logo.svg" },           // ⚠ يجب أن يوجد الملف فعليًا — وإلا ضع "" مؤقتًا

  /* --- Destinations ----------------------------------------- */
  blogUrl: "https://blog.abdallahabas.com",          // رابط المدونة
  cvUrl: "assets/abdallah-abas-cv.pdf",              // ⚠ يجب أن يوجد الملف فعليًا — وإلا ضع "" مؤقتًا

  /* --- Direct contact (اتركه "" ليختفى تلقائيًا) ------------- */
  email: "abdallahabasabish@gmail.com",
  whatsapp: "201001378339",                          // +20 100 137 8339 — أرقام فقط بين اقتباسين
  social: {
    facebook: "https://www.facebook.com/Abdallah.G.designer",
    linkedin: "https://www.linkedin.com/in/abdallah-abas-16601a258",
    instagram: "",
    telegram: "https://t.me/abdallahabasmo",
    github: "https://github.com/abdallahabasabish-ux"
  },

  /* --- Firebase (analytics + service requests) -------------- */
  firebase: {
    projectId: "abdallahsst",
    apiKey: "AIzaSyDg-oSbA_UdlzMS8HZGE0pHtr_zWg5rrXY",
    appId: "1:1011946194938:web:6c71030a6da4074b68c643",
    measurementId: "G-P8VBBK21WK",
    authDomain: "abdallahsst.firebaseapp.com",
    collection: "service_requests"
  },

  /* --- Service request form --------------------------------- */
  form: {
    mode: "firestore",        // "firestore" | "whatsapp" | "email" | "endpoint"
    endpoint: ""              // يُستخدم فقط عندما mode = "endpoint"
  },

  /* --- Stats: أرقام حقيقية فقط (0 = تظهر "—") --------------- */
  stats: { projects: 63, certificates: 10, years: 11, articles: 722 },

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

  /* --- Services ---------------------------------------------
     ⚠ معرّفات id هنا مطابقة لقائمة enum في firestore.rules —
       أي إضافة خدمة تتطلب تحديث القواعد أيضًا.                */
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
     13 مشروعًا حقيقيًا — روابط فعلية.
     ⚠ مطلوب منك: (1) تأكيد/تصحيح كل وصف، (2) تعبئة year عند
       المعرفة، (3) تعديل tech حيث المنصة WordPress، (4) تعديل
       category لـ vendo/me-rsa إن لزم.                          */
  portfolio: [
    { id: "freelancearab", category: "blogs", year: "",
      title: { en: "Arab Freelancer", ar: "عرب فريلانسر" },
      desc: { en: "An Arabic blog dedicated to freelancing — full design, section structure and SEO fundamentals.",
              ar: "مدونة عربية متخصصة في مجال العمل الحر — تصميم كامل وهيكلة أقسام وتهيئة أساسيات SEO." },
      services: { en: "Blog design, structure, SEO", ar: "تصميم المدونة، الهيكلة، SEO" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.freelancearab.com/", image: "assets/images/projects/freelancearab.svg", caseStudy: null },

    { id: "airbah", category: "blogs", year: "",
      title: { en: "Arbah Global", ar: "أرباح جلوبال" },
      desc: { en: "A content blog in the online-earnings niche — built and prepared following Google's published best practices.",
              ar: "مدونة محتوى في مجال الربح من الإنترنت — بناء المدونة وتهيئتها وفق أفضل الممارسات المنشورة من Google." },
      services: { en: "Blog build, AdSense-readiness prep, SEO", ar: "بناء المدونة، تهيئة AdSense، SEO" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.airbah.com/", image: "assets/images/projects/airbah.svg", caseStudy: null },

    { id: "albedaei", category: "blogs", year: "",
      title: { en: "Albedaei", ar: "البيدعي" },
      desc: { en: "A personal blog with an independent visual identity — responsive design, content structure and full technical setup.",
              ar: "مدونة شخصية بهوية بصرية مستقلة — تصميم متجاوب وبنية محتوى وتهيئة تقنية كاملة." },
      services: { en: "Blog design, structure, technical setup", ar: "تصميم المدونة، الهيكلة، تهيئة تقنية" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.albedaei.com/", image: "assets/images/projects/albedaei.svg", caseStudy: null },

    { id: "media3rabia", category: "blogs", year: "",
      title: { en: "Arab Media", ar: "ميديا عربية" },
      desc: { en: "An Arabic media-content platform — blog build, category organization, indexing and performance optimization.",
              ar: "منصة محتوى إعلامي عربي — بناء المدونة وتنظيم الأقسام وتحسين الفهرسة والأداء." },
      services: { en: "Blog build, structure, optimization", ar: "بناء المدونة، الهيكلة، التحسين" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.media3rabia.com/", image: "assets/images/projects/media3rabia.svg", caseStudy: null },

    { id: "amigurumiworld", category: "blogs", year: "",
      title: { en: "Amigurumi World", ar: "أميغورومي وورلد" },
      desc: { en: "An English blog dedicated to the amigurumi craft — design and content structure built for a global audience.",
              ar: "مدونة إنجليزية متخصصة في فن الأميغورومي (الكروشيه) — تصميم وبنية محتوى موجّهة لجمهور عالمي." },
      services: { en: "Blog design, content structure, SEO", ar: "تصميم المدونة، بنية المحتوى، SEO" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.amigurumiworld.org/", image: "assets/images/projects/amigurumiworld.webp", caseStudy: null },

    { id: "arabamigurumi", category: "blogs", year: "",
      title: { en: "Arab Amigurumi", ar: "عرب أميغورومي" },
      desc: { en: "An Arabic amigurumi-specialized blog — design, pattern and section structure, search-engine preparation.",
              ar: "مدونة عربية متخصصة في الأميغورومي — تصميم وهيكلة أقسام وأنماط وتهيئة محركات البحث." },
      services: { en: "Blog design, structure, SEO", ar: "تصميم المدونة، الهيكلة، SEO" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.arabamigurumi.com/", image: "assets/images/projects/arabamigurumi.webp", caseStudy: null },

    { id: "sihatoka", category: "blogs", year: "",
      title: { en: "Sihatoka First", ar: "صحتك أولًا" },
      desc: { en: "A health blog on Blogger — complete setup: design, sections, legal pages and AdSense-readiness preparation.",
              ar: "مدونة صحية على بلوجر — إعداد كامل: تصميم، أقسام، صفحات قانونية، وتهيئة لمتطلبات AdSense." },
      services: { en: "Blogger setup, legal pages, AdSense prep", ar: "إعداد بلوجر، صفحات قانونية، تهيئة AdSense" },
      tech: ["Blogger"],
      link: "https://sihatokafirst.blogspot.com/", image: "assets/images/projects/sihatoka.webp", caseStudy: null },

    { id: "rawa4all", category: "blogs", year: "",
      title: { en: "Rawa 4 All", ar: "روى 4 أول" },   // ⚠ صحّح الاسم العربي
      desc: { en: "A general-interest blog on Blogger — design, build and SEO/legal-pages setup.",
              ar: "مدونة عامة على بلوجر — تصميم وبناء وتهيئة أساسيات SEO والصفحات القانونية." },
      services: { en: "Blogger setup, SEO, legal pages", ar: "إعداد بلوجر، SEO، صفحات قانونية" },
      tech: ["Blogger"],
      link: "https://rawa4all.blogspot.com/", image: "assets/images/projects/rawa4all.webp", caseStudy: null },

    { id: "academyeg", category: "education", year: "",
      title: { en: "Academy EG", ar: "أكاديمية إيج" },
      desc: { en: "An educational platform on Blogger — learning-section structure, responsive design and SEO preparation.",
              ar: "منصة تعليمية على بلوجر — هيكلة أقسام تعليمية وتصميم متجاوب وتهيئة لمحركات البحث." },
      services: { en: "Blogger setup, structure, SEO", ar: "إعداد بلوجر، الهيكلة، SEO" },
      tech: ["Blogger"],
      link: "https://academyeg.blogspot.com/", image: "assets/images/projects/academyeg.webp", caseStudy: null },

    { id: "medbdarija", category: "blogs", year: "",
      title: { en: "Med B Darija", ar: "ميد بالدارجة" },
      desc: { en: "A Moroccan-Darija content blog — design, structure and complete technical setup.",
              ar: "مدونة محتوى بالدارجة المغربية — تصميم وهيكلة وتهيئة تقنية كاملة." },
      services: { en: "Blog design, structure, technical setup", ar: "تصميم المدونة، الهيكلة، تهيئة تقنية" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.medbdarija.com/", image: "assets/images/projects/medbdarija.webp", caseStudy: null },

    { id: "mersa", category: "other", year: "",
      title: { en: "ME-RSA", ar: "ME-RSA" },
      desc: { en: "A blog on Blogger — design, build and SEO fundamentals.",   // ⚠ حدّد تخصصه لأثري الوصف
              ar: "مدونة على بلوجر — تصميم وبناء وتهيئة أساسيات SEO." },
      services: { en: "Blogger setup, SEO", ar: "إعداد بلوجر، SEO" },
      tech: ["Blogger"],
      link: "https://me-rsa.blogspot.com/", image: "assets/images/projects/mersa.webp", caseStudy: null },

    { id: "businessbits", category: "blogs", year: "",
      title: { en: "Business Bits", ar: "بيزنس بيتس" },
      desc: { en: "A business and management blog — design, content structure and search/AdSense-readiness preparation.",
              ar: "مدونة أعمال وإدارة — تصميم وبنية محتوى وتهيئة لمحركات البحث ومعايير AdSense." },
      services: { en: "Blog design, SEO, AdSense prep", ar: "تصميم المدونة، SEO، تهيئة AdSense" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.businessbits33.com/", image: "assets/images/projects/businessbits.webp", caseStudy: null },

    { id: "vendo", category: "other", year: "",
      title: { en: "Vendo", ar: "فيندو" },
      desc: { en: "A digital project with a responsive front end — build, section organization and technical setup.",
              ar: "مشروع رقمي بواجهة متجاوبة — بناء وتنظيم أقسام وتهيئة تقنية." },
      services: { en: "Build, structure, technical setup", ar: "بناء، الهيكلة، تهيئة تقنية" },
      tech: ["Blogger", "Search Console"],
      link: "https://www.vendo2.com/", image: "assets/images/projects/vendo.webp", caseStudy: null }
  ],
  portfolioCategories: ["websites", "seo", "blogs", "platforms", "education", "ecommerce", "other"],
   
  /* --- Certificates: لا تُخترع أبدًا. أضف الحقيقية فقط. ----- */
  certificates: [
    /* { id: "c1", title: {en:"…", ar:"…"}, org: {en:"…", ar:"…"},
       date: "2025-06-01", credentialId: "…", verifyUrl: "…",
       image: "assets/certificates/c1.webp" } */
  ],

  /* --- Achievements: لا تُخترع أبدًا. أضف الحقيقية فقط. ----- */
  achievements: [
    /* { id:"a1", category:"writing", year:"2025",
       title:{en:"…",ar:"…"}, org:{en:"…",ar:"…"}, desc:{en:"…",ar:"…"} } */
  ],

  /* --- Articles (بوابة نحو المدونة) -------------------------- */
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
