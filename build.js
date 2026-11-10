#!/usr/bin/env node
/**
 * Static site generator. Zero dependencies.
 *   node build.js            -> builds to ./dist (or config.site.outputDir)
 *   node build.js --config path/to/other.config.js
 *
 * Reads config/site.config.js and renders four pages (home, about, services,
 * contact) plus sitemap.xml, robots.txt, favicon.svg and a 404 page.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const argIdx = process.argv.indexOf("--config");
const CONFIG_PATH = path.resolve(ROOT, argIdx > -1 ? process.argv[argIdx + 1] : "config/site.config.js");
delete require.cache[CONFIG_PATH];
const C = require(CONFIG_PATH);
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, C.site.outputDir || "dist");
const warnings = [];
const warn = (m) => warnings.push(m);

/* ------------------------------ helpers ------------------------------ */
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const attr = esc;
const origin = C.site.url.replace(/\/+$/, "");
const biz = C.business;
const ct = C.contact;
const pages = C.pages;
const pageKeys = Object.keys(pages);
const FLAT = !!C.site.flat; // true = about.html style files (for hosts without folder index support)
const depthOf = (key) => (pages[key].slug ? 1 : 0);
const prefixFor = (key) => (FLAT ? "" : depthOf(key) ? "../" : "./");
const abs = (p) => (/^https?:\/\//.test(p) ? p : `${origin}/${p.replace(/^\/+/, "")}`);
const pageUrl = (key) => `${origin}/${pages[key].slug ? pages[key].slug + "/" : ""}`;
const linkTo = (from, to, query = "") => {
  const p = prefixFor(from);
  const target = pages[to];
  if (!target) throw new Error(`Unknown page "${to}" in a link`);
  if (FLAT) return `${p}${target.slug ? target.slug + ".html" : "index.html"}${query}`;
  return `${p}${target.slug ? target.slug + "/" : ""}${query}`;
};
const assetUrl = (from, src) => (/^https?:\/\//.test(src) ? src : `${prefixFor(from)}${src.replace(/^\/+/, "")}`);
const hasFile = (rel) => fs.existsSync(path.join(SRC, rel));
const digits = (s) => String(s || "").replace(/\D/g, "");
const waLink = () => (digits(C.contact.whatsapp) ? `https://wa.me/${digits(C.contact.whatsapp)}?text=${encodeURIComponent(C.contact.whatsappMessage || "")}` : "");

const ICONS = {
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7V21h3.3l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  building: '<path d="M4 21V4h10v17"/><path d="M14 9h6v12"/><path d="M8 8h2M8 12h2M8 16h2M17 13h0M17 17h0"/>',
  bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
  star: '<path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>',
  whatsapp: '<path d="M3 21l1.6-5A8.500 8.500 0 1 1 8 19.400z"/><path d="M9 8.500c0 3.500 3 6.500 6.500 6.500l1-1.500-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"/>',
  Facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.500c0-.3.200-.5.500-.5z"/>',
  Instagram: '<rect x="4" y="4" width="16" height="16" rx="4.500"/><circle cx="12" cy="12" r="3.500"/><path d="M17 7h.01"/>',
  LinkedIn: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 10v6M8 7.500v.01M12 16v-6m0 3c0-2 1-3 3-3s2 1.500 2 3.500V16"/>',
  X: '<path d="m5 4 14 16M19 4 5 20"/>',
  YouTube: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="m10 9.500 5 2.500-5 2.500z"/>',
  TikTok: '<path d="M14 4v10.500a3.500 3.500 0 1 1-3.500-3.500M14 4c.500 2.500 2 4 5 4"/>',
};
const icon = (name, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.check}</svg>`;

function img(from, im, { eager = false, sizes = "(min-width: 900px) 50vw, 100vw", cls = "" } = {}) {
  if (!im || !im.src) return "";
  if (!/^https?:\/\//.test(im.src) && !hasFile(im.src)) warn(`Image not found: src/${im.src}`);
  if (!im.alt && im.alt !== "") warn(`Image missing alt text: ${im.src}`);
  const srcset = im.srcset ? ` srcset="${attr(im.srcset)}" sizes="${attr(im.sizes || sizes)}"` : "";
  const dims = im.width && im.height ? ` width="${im.width}" height="${im.height}"` : "";
  const loading = eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
  return `<img${cls ? ` class="${cls}"` : ""} src="${attr(assetUrl(from, im.src))}"${srcset}${dims} alt="${attr(im.alt || "")}"${loading}>`;
}

function btn(from, cta, variant = "primary") {
  if (!cta) return "";
  const cls = `btn btn--${variant}`;
  if (cta.phone) return `<a class="${cls}" href="tel:${attr(ct.phoneHref)}">${icon("phone", "icon icon--sm")}${esc(cta.label)}: ${esc(ct.phone)}</a>`;
  const href = cta.href || linkTo(from, cta.page, cta.query || "");
  return `<a class="${cls}" href="${attr(href)}">${esc(cta.label)}</a>`;
}
const arrowLink = (from, l) =>
  l ? `<a class="arrow-link" href="${attr(linkTo(from, l.page, l.query || ""))}">${esc(l.label)}${icon("arrow", "icon icon--sm")}</a>` : "";
const sampleNote = (on, text) => (on ? `<p class="sample-note">${esc(text)}</p>` : "");
const head = (eyebrow, heading, intro, level = 2) =>
  `<header class="section__head">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}<h${level}>${esc(heading)}</h${level}>${intro ? `<p class="lede">${esc(intro)}</p>` : ""}</header>`;
const reveal = ' data-reveal';

/* ------------------------------ sections ------------------------------ */
const R = {};

R.hero = (s, from) => `
<section class="hero">
  <div class="container hero__grid">
    <div class="hero__copy">
      ${s.eyebrow ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : ""}
      <h1>${esc(s.headline)}</h1>
      <p class="hero__text">${esc(s.text)}</p>
      <div class="btn-row">${btn(from, s.primaryCta)}${btn(from, s.secondaryCta, "ghost")}</div>
      ${s.highlights?.length ? `<ul class="ticks">${s.highlights.map((h) => `<li>${icon("check", "icon icon--sm")}${esc(h)}</li>`).join("")}</ul>` : ""}
    </div>
    <div class="hero__media">${img(from, s.image, { eager: true, sizes: "(min-width: 900px) 46vw, 100vw" })}</div>
  </div>
</section>`;

R.pageHeader = (s, from) => `
<section class="page-header">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol>
      <li><a href="${attr(linkTo(from, "home"))}">${esc(navLabel("home"))}</a></li>
      <li aria-current="page">${esc(navLabel(from))}</li>
    </ol></nav>
    ${s.eyebrow ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : ""}
    <h1>${esc(s.heading)}</h1>
    ${s.text ? `<p class="lede">${esc(s.text)}</p>` : ""}
  </div>
</section>`;

R.intro = (s, from) => `
<section class="section">
  <div class="container split">
    <div class="split__media"${reveal}>${img(from, s.image)}</div>
    <div class="split__copy"${reveal}>
      ${s.eyebrow ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : ""}
      <h2>${esc(s.heading)}</h2>
      ${(s.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("")}
      ${arrowLink(from, s.link)}
    </div>
  </div>
</section>`;

R.story = (s, from) => `
<section class="section">
  <div class="container split split--reverse">
    <div class="split__copy"${reveal}>
      <h2>${esc(s.heading)}</h2>
      ${(s.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("")}
    </div>
    <div class="split__media"${reveal}>${img(from, s.image)}</div>
  </div>
</section>`;

R.catalogue = (s, from) => {
  const items = C.catalogue.items.filter((i) => (s.featuredOnly ? i.featured : true));
  return `
<section class="section section--alt">
  <div class="container">
    ${head(s.eyebrow, s.heading, s.intro)}
    <ul class="cards cards--${Math.min(items.length, 4)}">
      ${items
        .map(
          (it, i) => `
      <li class="card"${reveal}>
        ${icon(it.icon, "icon icon--lg")}
        <h3>${esc(it.name)}</h3>
        <p>${esc(it.summary)}</p>
        <a class="arrow-link" href="${attr(linkTo(from, "services"))}#${attr(it.id)}">Learn more<span class="visually-hidden"> about ${esc(it.name)}</span>${icon("arrow", "icon icon--sm")}</a>
      </li>`
        )
        .join("")}
    </ul>
    ${s.link ? `<p class="section__foot">${arrowLink(from, s.link)}</p>` : ""}
  </div>
</section>`;
};

R.catalogueDetail = (s, from) => `
<section class="section">
  <div class="container">
    <div class="detail-list">
      ${C.catalogue.items
        .map((it, i) => {
          const q = `?enquiry=quote&service=${encodeURIComponent(it.name)}`;
          const price = it.price
            ? `<p class="price"><span class="price__from">${esc(it.price.from ? "From" : "")}</span> <strong>${esc(it.price.from || it.price.amount || "")}</strong> ${esc(it.price.unit || "")}${it.price.note ? ` <span class="price__note">${esc(it.price.note)}</span>` : ""}</p>`
            : "";
          return `
      <article class="detail${i % 2 ? " detail--flip" : ""}" id="${attr(it.id)}"${reveal}>
        <div class="detail__media">${img(from, it.image)}</div>
        <div class="detail__copy">
          <p class="eyebrow">${esc(C.catalogue.itemLabel)}${icon(it.icon, "icon icon--sm")}</p>
          <h2>${esc(it.name)}</h2>
          <p>${esc(it.description)}</p>
          ${it.benefits?.length ? `<ul class="ticks">${it.benefits.map((b) => `<li>${icon("check", "icon icon--sm")}${esc(b)}</li>`).join("")}</ul>` : ""}
          ${price}
          <div class="btn-row"><a class="btn btn--primary" href="${attr(linkTo(from, "contact", q))}">${esc(it.cta || "Enquire")}</a></div>
        </div>
      </article>`;
        })
        .join("")}
    </div>
  </div>
</section>`;

R.pricing = (s, from) => {
  const p = C.catalogue.pricing;
  if (!p || !p.tiers?.length) return "";
  return `
<section class="section section--alt">
  <div class="container">
    ${head(null, p.heading, p.intro)}
    <ul class="pricing">
      ${p.tiers
        .map(
          (t) => `
      <li class="tier${t.highlight ? " tier--highlight" : ""}"${reveal}>
        <h3>${esc(t.name)}</h3>
        <p class="tier__price"><strong>${esc(t.price)}</strong> <span>${esc(t.unit || "")}</span></p>
        <ul class="ticks">${(t.features || []).map((f) => `<li>${icon("check", "icon icon--sm")}${esc(f)}</li>`).join("")}</ul>
        <a class="btn ${t.highlight ? "btn--primary" : "btn--ghost"}" href="${attr(linkTo(from, "contact", `?enquiry=quote&service=${encodeURIComponent(t.name)}`))}">${esc(t.cta || "Enquire")}</a>
      </li>`
        )
        .join("")}
    </ul>
  </div>
</section>`;
};

R.features = (s) => `
<section class="section">
  <div class="container">
    ${head(s.eyebrow, s.heading, s.intro)}
    <ul class="features">
      ${s.items.map((f) => `<li${reveal}>${icon(f.icon || "check", "icon icon--lg")}<h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join("")}
    </ul>
  </div>
</section>`;

R.stats = (s) => `
<section class="stats" aria-label="Business highlights">
  <div class="container">
    <ul class="stats__row">
      ${s.items.map((i) => `<li${reveal}><strong>${esc(i.value)}</strong><span>${esc(i.label)}</span></li>`).join("")}
    </ul>
    ${sampleNote(s.sample, "Sample figures: replace with real, verifiable numbers or remove this section.")}
  </div>
</section>`;

R.testimonials = (s) => `
<section class="section section--alt">
  <div class="container">
    ${head(s.eyebrow, s.heading, s.intro)}
    <div class="quotes">
      ${s.items
        .map(
          (t) => `
      <figure class="quote"${reveal}>
        <blockquote><p>${esc(t.quote)}</p></blockquote>
        <figcaption><strong>${esc(t.name)}</strong>${t.role ? `<span>${esc(t.role)}</span>` : ""}</figcaption>
      </figure>`
        )
        .join("")}
    </div>
    ${sampleNote(s.sample, "Sample testimonials: replace with genuine client feedback (with permission) before launch.")}
  </div>
</section>`;

R.missionVision = (s) => `
<section class="section section--alt">
  <div class="container mv">
    <div${reveal}><h2>${esc(s.mission.heading)}</h2><p class="mv__text">${esc(s.mission.text)}</p></div>
    <div${reveal}><h2>${esc(s.vision.heading)}</h2><p class="mv__text">${esc(s.vision.text)}</p></div>
  </div>
</section>`;

const listSection = (cls) => (s) => `
<section class="section${cls === "differentiators" ? " section--alt" : ""}">
  <div class="container">
    ${head(s.eyebrow, s.heading, s.intro)}
    <ul class="numbered">
      ${s.items.map((v, i) => `<li${reveal}><span class="numbered__n" aria-hidden="true"></span><div><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div></li>`).join("")}
    </ul>
  </div>
</section>`;
R.values = listSection("values");
R.differentiators = listSection("differentiators");

R.team = (s, from) => {
  if (!s.members?.length) return "";
  return `
<section class="section">
  <div class="container">
    ${head(s.eyebrow, s.heading, s.intro)}
    <ul class="team">
      ${s.members
        .map((m) => `<li${reveal}>${m.image ? img(from, { width: 400, height: 400, ...m.image, alt: m.image.alt || m.name }, { sizes: "(min-width: 900px) 25vw, 50vw" }) : ""}<h3>${esc(m.name)}</h3><p class="team__role">${esc(m.role)}</p>${m.bio ? `<p>${esc(m.bio)}</p>` : ""}</li>`)
        .join("")}
    </ul>
  </div>
</section>`;
};

R.process = (s) => `
<section class="section">
  <div class="container">
    ${head(s.eyebrow, s.heading, s.intro)}
    <ol class="steps">
      ${s.items.map((st, i) => `<li${reveal}><span class="steps__n">Step ${i + 1}</span><h3>${esc(st.title)}</h3><p>${esc(st.text)}</p></li>`).join("")}
    </ol>
  </div>
</section>`;

R.faq = (s) => `
<section class="section">
  <div class="container faq-wrap">
    <div class="faq-wrap__head">${head(s.eyebrow, s.heading, s.intro)}${sampleNote(s.sample, "Sample answers: replace with your real answers before launch.")}</div>
    <div class="faq">
      ${s.items.map((f) => `<details class="faq__item"><summary>${esc(f.q)}</summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join("\n      ")}
    </div>
  </div>
</section>`;

R.cta = (s, from) => `
<section class="cta">
  <div class="container cta__inner">
    <div><h2>${esc(s.heading)}</h2>${s.text ? `<p>${esc(s.text)}</p>` : ""}</div>
    <div class="btn-row">${btn(from, s.primaryCta, "light")}${btn(from, s.secondaryCta, "outline-light")}</div>
  </div>
</section>`;

function hoursList() {
  return `<dl class="hours">${ct.hours
    .map((h) => `<div><dt>${esc(h.label)}</dt><dd>${h.closed ? "Closed" : `${esc(h.opens)} – ${esc(h.closes)}`}</dd></div>`)
    .join("")}</dl>`;
}
const addressLines = () => {
  const a = ct.address;
  return [a.street, a.locality, [a.region, a.postalCode].filter(Boolean).join(" "), a.countryName].filter(Boolean);
};
const socialLinks = (cls = "social") =>
  ct.social?.length
    ? `<ul class="${cls}">${ct.social.map((s) => `<li><a href="${attr(s.url)}" rel="noopener noreferrer" target="_blank" aria-label="${attr(s.name)} (opens in a new tab)">${icon(s.name, "icon")}</a></li>`).join("")}</ul>`
    : "";

R.contactMain = (s, from) => {
  const F = C.form;
  const wa = waLink();
  const options = F.enquiryTypes.map((t) => `<option value="${attr(t)}">${esc(t)}</option>`).join("");
  return `
<section class="section">
  <div class="container contact">
    <div class="contact__form"${reveal}>
      <h2>Send an enquiry</h2>
      <form id="contact-form" novalidate
        data-endpoint="${attr(F.endpoint || "")}"
        data-mailto="${attr(ct.email)}"
        data-business="${attr(biz.name)}"
        data-quote-type="${attr(F.quoteType)}"
        data-msg-success="${attr(F.messages.success)}"
        data-msg-error="${attr(F.messages.error)}"
        data-msg-notconnected="${attr(F.messages.notConnected)}">
        <div class="field">
          <label for="f-name">Full name <span class="req" aria-hidden="true">*</span></label>
          <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err">
          <p class="field__error" id="f-name-err" role="alert"></p>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="f-email">Email address <span class="req" aria-hidden="true">*</span></label>
            <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="f-email-err">
            <p class="field__error" id="f-email-err" role="alert"></p>
          </div>
          <div class="field">
            <label for="f-phone">Phone number</label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" aria-describedby="f-phone-err">
            <p class="field__error" id="f-phone-err" role="alert"></p>
          </div>
        </div>
        <div class="field">
          <label for="f-type">Enquiry type <span class="req" aria-hidden="true">*</span></label>
          <select id="f-type" name="enquiryType" required aria-describedby="f-type-err">
            <option value="">Select one…</option>${options}
          </select>
          <p class="field__error" id="f-type-err" role="alert"></p>
        </div>
        <div class="field">
          <label for="f-message">Message <span class="req" aria-hidden="true">*</span></label>
          <textarea id="f-message" name="message" rows="6" required minlength="10" aria-describedby="f-message-err"></textarea>
          <p class="field__error" id="f-message-err" role="alert"></p>
        </div>
        <div class="field field--trap" aria-hidden="true"><label for="f-website">Leave this field empty</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <p class="form-note">${esc(F.privacyNote)}</p>
        <button class="btn btn--primary" type="submit">Send enquiry</button>
        <div class="form-status" id="form-status" role="status" aria-live="polite" tabindex="-1"></div>
        <noscript><p class="form-status form-status--info">This form needs JavaScript. Please email <a href="mailto:${attr(ct.email)}">${esc(ct.email)}</a> instead.</p></noscript>
      </form>
    </div>
    <aside class="contact__details" aria-label="Contact details"${reveal}>
      <h2>Get in touch</h2>
      <ul class="detail-links">
        <li>${icon("phone")}<div><span class="label">Phone</span><a href="tel:${attr(ct.phoneHref)}">${esc(ct.phone)}</a></div></li>
        <li>${icon("mail")}<div><span class="label">Email</span><a href="mailto:${attr(ct.email)}">${esc(ct.email)}</a></div></li>
        ${wa ? `<li>${icon("whatsapp")}<div><span class="label">WhatsApp</span><a class="btn btn--whatsapp" href="${attr(wa)}" target="_blank" rel="noopener noreferrer">Chat on WhatsApp<span class="visually-hidden"> (opens in a new tab)</span></a></div></li>` : ""}
        <li>${icon("pin")}<div><span class="label">Address</span><address>${addressLines().map(esc).join("<br>")}</address>${ct.mapLink ? `<a class="arrow-link" href="${attr(ct.mapLink)}" target="_blank" rel="noopener noreferrer">Open in Google Maps${icon("arrow", "icon icon--sm")}</a>` : ""}</div></li>
      </ul>
      <h3>Opening hours</h3>
      ${hoursList()}
      ${ct.social?.length ? `<h3>Follow us</h3>${socialLinks()}` : ""}
    </aside>
  </div>
  ${ct.mapEmbedUrl ? `<div class="container map"><iframe title="Map showing the location of ${attr(biz.name)}" src="${attr(ct.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>` : ""}
</section>`;
};

/* ------------------------------ layout ------------------------------ */
function navLabel(key) {
  const it = C.nav.items.find((i) => i.page === key);
  return it ? it.label : key;
}

const logoWantsImage = () => (biz.logo.type === "image" || biz.logo.type === "image+name") && biz.logo.src;
function logoHtml(from, { footer = false } = {}) {
  const L = biz.logo;
  const src = footer && L.srcOnDark ? L.srcOnDark : L.src;
  if (logoWantsImage()) {
    if (hasFile(src)) {
      const withName = L.type === "image+name";
      const tile = footer && !L.srcOnDark ? " brand__logo--tile" : "";
      const dims = (L.width ? ` width="${L.width}"` : "") + (L.height ? ` height="${L.height}"` : "");
      return `<img class="brand__logo${tile}" src="${attr(assetUrl(from, src))}"${dims} alt="${withName ? "" : attr(L.alt || biz.name)}" decoding="async">${withName ? `<span class="brand__name">${esc(biz.name)}</span>` : ""}`;
    }
    warn(`Logo image not found: src/${src}. Showing the text mark instead.`);
  }
  return `<span class="brand__mark" aria-hidden="true">${esc(L.mark || biz.name[0])}</span><span class="brand__name">${esc(biz.name)}</span>`;
}

function topbar() {
  const T = C.topBar;
  if (!T || !T.enabled) return "";
  const h = ct.hours.find((x) => !x.closed);
  const note = [T.message, T.showHours !== false && h ? `${h.label}: ${h.opens} – ${h.closes}` : ""].filter(Boolean).join(" · ");
  return `
<div class="topbar"><div class="container topbar__inner">
  ${note ? `<p class="topbar__note">${esc(note)}</p>` : "<span></span>"}
  <ul class="topbar__links">
    <li><a href="tel:${attr(ct.phoneHref)}">${icon("phone", "icon icon--sm")}${esc(ct.phone)}</a></li>
    ${T.showEmail !== false ? `<li><a href="mailto:${attr(ct.email)}">${icon("mail", "icon icon--sm")}${esc(ct.email)}</a></li>` : ""}
  </ul>
</div></div>`;
}

function waFloat() {
  if (!ct.whatsappFloating || !waLink()) return "";
  return `<a class="wa-float" href="${attr(waLink())}" target="_blank" rel="noopener noreferrer">${icon("whatsapp", "icon")}<span class="visually-hidden">Chat on WhatsApp (opens in a new tab)</span></a>`;
}

function header(from) {
  return `
<a class="skip-link" href="#main">Skip to main content</a>${topbar()}
<header class="site-header" id="top">
  <div class="container site-header__inner">
    <a class="brand" href="${attr(linkTo(from, "home"))}"${from === "home" ? ' aria-label="' + attr(biz.name) + ' home"' : ""}>${logoHtml(from)}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle__bars" aria-hidden="true"></span><span class="visually-hidden">Menu</span></button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>
        ${C.nav.items.map((i) => `<li><a href="${attr(linkTo(from, i.page))}"${i.page === from ? ' aria-current="page"' : ""}>${esc(i.label)}</a></li>`).join("")}
      </ul>
      ${C.nav.cta ? `<a class="btn btn--primary btn--sm" href="${attr(linkTo(from, C.nav.cta.page, C.nav.cta.query || ""))}">${esc(C.nav.cta.label)}</a>` : ""}
    </nav>
  </div>
</header>`;
}

function footer(from) {
  const cols = {
    explore: `<div><h2 class="footer__h">Explore</h2><ul>${C.nav.items.map((i) => `<li><a href="${attr(linkTo(from, i.page))}">${esc(i.label)}</a></li>`).join("")}</ul></div>`,
    contact: `<div><h2 class="footer__h">Contact</h2><ul>
      <li><a href="tel:${attr(ct.phoneHref)}">${esc(ct.phone)}</a></li>
      <li><a href="mailto:${attr(ct.email)}">${esc(ct.email)}</a></li>
      <li><address>${addressLines().map(esc).join("<br>")}</address></li>
    </ul>${socialLinks("social social--footer")}</div>`,
    hours: `<div><h2 class="footer__h">Opening hours</h2>${hoursList()}</div>`,
  };
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a class="brand brand--footer" href="${attr(linkTo(from, "home"))}">${logoHtml(from, { footer: true })}</a>
      <p>${esc(C.footer.blurb)}</p>
    </div>
    ${C.footer.columns.map((c) => cols[c] || "").join("")}
  </div>
  <div class="container footer__bar">
    <p>&copy; ${year} ${esc(biz.legalName || biz.name)}. ${esc(C.footer.legal)}</p>
    ${C.footer.extraLinks?.length ? `<ul>${C.footer.extraLinks.map((l) => `<li><a href="${attr(l.href)}">${esc(l.label)}</a></li>`).join("")}</ul>` : ""}
  </div>
</footer>`;
}

function themeCss() {
  const c = C.theme.colors;
  return `:root{--c-primary:${c.primary};--c-primary-dark:${c.primaryDark};--c-on-primary:${c.onPrimary};--c-accent:${c.accent};--c-ink:${c.ink};--c-muted:${c.muted};--c-line:${c.line};--c-surface:${c.surface};--c-bg:${c.background};--f-heading:${C.theme.fonts.heading};--f-body:${C.theme.fonts.body};--radius:${C.theme.radius};--logo-h:${(biz.logo.height || 44)}px}`;
}

/* ------------------------------ SEO / schema ------------------------------ */
function businessSchema() {
  const a = ct.address;
  const o = {
    "@type": biz.schemaType || "LocalBusiness",
    "@id": `${origin}/#business`,
    name: biz.name,
    legalName: biz.legalName || undefined,
    url: `${origin}/`,
    description: biz.shortDescription,
    image: abs(C.site.ogImage),
    telephone: ct.phone || undefined,
    email: ct.email || undefined,
    priceRange: biz.priceRange || undefined,
    foundingDate: biz.foundedYear ? String(biz.foundedYear) : undefined,
    address: a?.street
      ? { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.locality, addressRegion: a.region, postalCode: a.postalCode, addressCountry: a.country }
      : undefined,
    areaServed: biz.areaServed?.length ? biz.areaServed.map((n) => ({ "@type": "City", name: n })) : undefined,
    openingHoursSpecification: ct.hours
      .filter((h) => !h.closed && h.days?.length)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    sameAs: ct.social?.length ? ct.social.map((s) => s.url) : undefined,
  };
  if (logoWantsImage() && hasFile(biz.logo.src)) o.logo = abs(biz.logo.src);
  return o;
}

function pageSchema(key) {
  const p = pages[key];
  const graph = [businessSchema(), { "@type": "WebSite", "@id": `${origin}/#website`, url: `${origin}/`, name: biz.name, inLanguage: C.site.language, publisher: { "@id": `${origin}/#business` } }];
  const typeMap = { contact: "ContactPage", about: "AboutPage" };
  graph.push({ "@type": typeMap[key] || "WebPage", "@id": `${pageUrl(key)}#webpage`, url: pageUrl(key), name: pageTitle(key), description: p.seo.description, isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#business` }, inLanguage: C.site.language });
  if (key !== "home") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: navLabel("home"), item: pageUrl("home") },
        { "@type": "ListItem", position: 2, name: navLabel(key), item: pageUrl(key) },
      ],
    });
  }
  if (key === "services") {
    graph.push({
      "@type": "ItemList",
      itemListElement: C.catalogue.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Service", name: it.name, description: it.summary, url: `${pageUrl("services")}#${it.id}`, provider: { "@id": `${origin}/#business` }, areaServed: biz.areaServed?.length ? biz.areaServed : undefined },
      })),
    });
  }
  const faqs = p.sections.filter((x) => x.type === "faq").flatMap((x) => x.items || []);
  if (faqs.length) graph.push({ "@type": "FAQPage", "@id": `${pageUrl(key)}#faq`, mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  return { "@context": "https://schema.org", "@graph": graph };
}

function pageTitle(key) {
  const t = pages[key].seo.title;
  const sep = C.site.titleSeparator;
  if (t.toLowerCase().includes(biz.name.toLowerCase())) return t;
  return key === "home" ? `${biz.name}${sep}${t}` : `${t}${sep}${biz.name}`;
}

function renderPage(key, extra = {}) {
  const p = pages[key];
  const from = key;
  const title = pageTitle(key);
  if (title.length > 65) warn(`Title for "${key}" is ${title.length} chars (aim for ≤ 60): ${title}`);
  if (p.seo.description.length > 160 || p.seo.description.length < 70) warn(`Meta description for "${key}" is ${p.seo.description.length} chars (aim for 70–160)`);
  const robots = C.site.indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow";
  const canonical = pageUrl(key);
  const og = abs(C.site.ogImage);
  if (!hasFile(C.site.ogImage)) warn(`OG image not found: src/${C.site.ogImage}`);
  const AUTO = new Set(["intro", "story", "catalogue", "catalogueDetail", "features", "testimonials", "missionVision", "values", "differentiators", "team", "process", "faq", "pricing"]);
  let alt = false;
  const body = p.sections.map((s) => {
    if (!R[s.type]) throw new Error(`Unknown section type "${s.type}" on page "${key}"`);
    let html = R[s.type](s, from);
    if (html && AUTO.has(s.type)) {
      html = html.replace(/class="section( section--alt)?"/, `class="section${alt ? " section--alt" : ""}"`);
      alt = !alt;
    }
    return html;
  }).join("\n");
  const fonts = C.theme.fonts.googleFontsUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${attr(C.theme.fonts.googleFontsUrl)}">`
    : "";
  return `<!doctype html>
<html lang="${attr(C.site.language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(p.seo.description)}">
${p.seo.keywords?.length ? `<meta name="keywords" content="${attr(p.seo.keywords.join(", "))}">\n` : ""}<meta name="robots" content="${robots}">
<meta name="theme-color" content="${attr(C.theme.colors.primary)}">
<link rel="canonical" href="${attr(canonical)}">
<link rel="icon" href="${attr(prefixFor(key))}favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="${attr(prefixFor(key))}assets/img/apple-touch-icon.png" type="image/png">
<link rel="apple-touch-icon" sizes="180x180" href="${attr(prefixFor(key))}assets/img/apple-touch-icon.png">
<link rel="manifest" href="${attr(prefixFor(key))}site.webmanifest">
<meta name="apple-mobile-web-app-title" content="${attr(biz.name)}">
<meta name="application-name" content="${attr(biz.name)}">
<meta name="msapplication-TileColor" content="${attr(C.theme.colors.primary)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(biz.name)}">
<meta property="og:locale" content="${attr(C.site.locale)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(p.seo.description)}">
<meta property="og:url" content="${attr(canonical)}">
<meta property="og:image" content="${attr(og)}">
<meta property="og:image:alt" content="${attr(biz.name + ": " + biz.tagline)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(p.seo.description)}">
<meta name="twitter:image" content="${attr(og)}">
${fonts}
<link rel="stylesheet" href="${attr(prefixFor(key))}assets/css/styles.css">
<style>${themeCss()}</style>
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify(pageSchema(key))}</script>
</head>
<body class="page-${key}">
${header(from)}
<main id="main">
${body}
</main>
${footer(from)}
${key === "contact" ? "" : waFloat()}
<script src="${attr(prefixFor(key))}assets/js/main.js" defer></script>
</body>
</html>
`;
}

function render404() {
  const from = "home";
  return `<!doctype html>
<html lang="${attr(C.site.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found${esc(C.site.titleSeparator)}${esc(biz.name)}</title><meta name="robots" content="noindex">
<base href="/"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" sizes="180x180" href="assets/img/apple-touch-icon.png"><link rel="manifest" href="site.webmanifest">
<link rel="stylesheet" href="assets/css/styles.css"><style>${themeCss()}</style></head>
<body class="page-404">${header(from).replace(/href="\.\//g, 'href="/')}
<main id="main"><section class="page-header"><div class="container"><p class="eyebrow">404</p><h1>That page doesn't exist.</h1><p class="lede">The link may be out of date. Try one of the pages in the menu, or head back to the home page.</p><div class="btn-row"><a class="btn btn--primary" href="/">Back to home</a></div></div></section></main>
${footer(from).replace(/href="\.\//g, 'href="/')}</body></html>
`;
}

function faviconSvg() {
  return fs.readFileSync(path.join(SRC, "assets", "img", "flowline-icon.svg"), "utf8");
}
function webManifest() {
  return JSON.stringify({
    name: biz.name,
    short_name: biz.name.slice(0, 12),
    start_url: "/",
    display: "standalone",
    background_color: C.theme.colors.background,
    theme_color: C.theme.colors.primary,
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }]
  }, null, 2) + "\n";
}

/* ------------------------------ build ------------------------------ */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(SRC, "assets"), path.join(OUT, "assets"));

for (const key of pageKeys) {
  if (FLAT) {
    fs.writeFileSync(path.join(OUT, (pages[key].slug || "index") + ".html"), renderPage(key));
    continue;
  }
  const dir = path.join(OUT, pages[key].slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderPage(key));
}
fs.writeFileSync(path.join(OUT, "404.html"), render404());
fs.writeFileSync(path.join(OUT, "favicon.svg"), faviconSvg());
fs.writeFileSync(path.join(OUT, "site.webmanifest"), webManifest());

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageKeys
    .map((k) => `  <url>\n    <loc>${esc(pageUrl(k))}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${k === "home" ? "1.0" : "0.8"}</priority>\n  </url>`)
    .join("\n")}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(OUT, "robots.txt"),
  C.site.indexable ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n` : `# Site is not yet indexable (site.indexable = false in config).\nUser-agent: *\nDisallow: /\n`
);

/* launch-readiness warnings */
if (!C.site.indexable) warn("site.indexable is false: pages are noindex and robots.txt blocks crawlers. Set true at launch.");
if (/example\.(com|org)/.test(origin)) warn("site.url is a placeholder domain.");
if (/example\.com|0000/.test(ct.email + ct.phone + ct.address.street + ct.address.postalCode)) warn("Contact details still contain placeholders.");
if (!C.form.endpoint) warn("form.endpoint is empty: the form validates but cannot send. Connect a provider and test it.");
if (!ct.mapEmbedUrl) warn("contact.mapEmbedUrl is empty: map hidden.");
for (const k of pageKeys) for (const s of pages[k].sections) if (s.sample) warn(`Sample ${s.type} content on "${k}" still flagged sample:true.`);

console.log(`Built ${pageKeys.length} pages + 404 → ${path.relative(ROOT, OUT)}/`);
if (warnings.length) {
  console.log("\nLaunch checklist / warnings:");
  warnings.forEach((w) => console.log("  - " + w));
}
