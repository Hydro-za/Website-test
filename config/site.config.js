/**
 * SITE CONFIGURATION: the single source of truth.
 *
 * Everything the website says, shows or links to comes from this file.
 * To customise for a new business: edit this file (and drop images into
 * src/assets/img), then run `node build.js`.
 *
 * The values below are SAMPLE CONTENT for a fictional business so the
 * design can be previewed. Contact details, testimonials and statistics
 * are placeholders and must be replaced with real, verifiable information.
 * While `site.indexable` is false the build adds noindex and blocks crawlers,
 * so sample content can never be indexed by accident.
 */

module.exports = {
  /* ------------------------------------------------------------------ */
  /* BUSINESS                                                            */
  /* ------------------------------------------------------------------ */
  business: {
    name: "Meridian Works",
    legalName: "Meridian Works (Pty) Ltd",
    industry: "Property maintenance and renovation",
    tagline: "Considered work, finished properly.",
    shortDescription:
      "Maintenance, renovation and repair for homes and commercial properties.",
    foundedYear: null, // e.g. 2012. Leave null to hide "since" mentions.
    // Schema.org type. Use the most specific one that fits, e.g.
    // "HomeAndConstructionBusiness", "Dentist", "Restaurant", "LegalService",
    // "Store", "AutoRepair", "ProfessionalService", or "LocalBusiness".
    schemaType: "HomeAndConstructionBusiness",
    priceRange: null, // e.g. "$$". Leave null if unknown.
    areaServed: ["Johannesburg", "Sandton", "Randburg"], // used in schema + copy
    // Logo: "text" renders the name as a wordmark; "image" uses an SVG/PNG.
    // Logo slot. type:
    //   "image+name"  logo image on the LEFT with the business name beside it (default)
    //   "image"       logo image only (use for wordmark logos that already include the name)
    //   "text"        letter badge + name, no image needed
    // Replace src/assets/img/logo.svg (or .png) with the real logo, then set width/height to its
    // display size in px (height controls the header size; width keeps it from jumping while loading).
    // srcOnDark: optional light version for the dark footer. Without it the logo sits on a white tile.
    logo: {
      type: "image+name",
      src: "assets/img/logo.svg",
      srcOnDark: "",
      alt: "Meridian Works logo",
      width: 44,
      height: 44,
      mark: "M", // letter used for the "text" type and the generated favicon
    },
  },

  /* ------------------------------------------------------------------ */
  /* SITE / TECHNICAL                                                    */
  /* ------------------------------------------------------------------ */
  site: {
    url: "https://www.example.com", // production origin, no trailing slash
    language: "en",
    locale: "en_ZA",
    // Keep false until real content is in place. true = indexable by search engines.
    indexable: false,
    outputDir: "dist",
    ogImage: "assets/img/og-default.png", // 1200x630 PNG/JPG for social sharing
    titleSeparator: " | ",
  },

  /* ------------------------------------------------------------------ */
  /* THEME: colours, type, shape                                         */
  /* ------------------------------------------------------------------ */
  theme: {
    colors: {
      primary: "#1f4d3f", // main brand colour (buttons, links, accents)
      primaryDark: "#16382e", // hover state
      onPrimary: "#ffffff", // text colour on primary
      accent: "#b8643a", // secondary highlight (used sparingly)
      ink: "#16201c", // body text and dark sections
      muted: "#56625d", // secondary text
      line: "#d9dcd6", // hairline borders
      surface: "#f4f2ec", // alternate section background
      background: "#fdfcf9", // page background
    },
    fonts: {
      // System stacks by default: zero font downloads, fastest possible load.
      // To use web fonts, set googleFontsUrl and change the stacks.
      // One modern sans family for everything. System fonts are the fallback while it loads.
      // Other good choices: "Inter", "DM Sans", "Manrope", "Figtree", "Outfit" (update the URL to match).
      // Set googleFontsUrl to null to use only system fonts (fastest, no download).
      heading: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      body: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&display=swap",
    },
    radius: "3px", // corner radius: "0" for sharp, "8px" for softer
  },

  /* ------------------------------------------------------------------ */
  /* CONTACT                                                             */
  /* ------------------------------------------------------------------ */
  contact: {
    email: "hello@example.com", // PLACEHOLDER
    phone: "+27 00 000 0000", // PLACEHOLDER (display format)
    phoneHref: "+27000000000", // digits for tel: links
    whatsapp: "27000000000", // PLACEHOLDER: international format, no + or spaces. "" hides button
    whatsappMessage: "Hello, I'd like to make an enquiry.",
    whatsappFloating: true, // floating chat button on every page except Contact
    address: {
      street: "12 Sample Street", // PLACEHOLDER
      locality: "Sandton",
      region: "Gauteng",
      postalCode: "0000",
      country: "ZA",
      countryName: "South Africa",
    },
    // Google Maps: paste the "Embed a map" src URL. "" hides the map.
    mapEmbedUrl: "",
    mapLink: "", // link to open the location in Google Maps
    // days: schema.org day names. closed: true shows "Closed".
    hours: [
      { label: "Monday – Friday", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
      { label: "Saturday", days: ["Saturday"], opens: "08:00", closes: "13:00" },
      { label: "Sunday and public holidays", days: [], closed: true },
    ],
    social: [
      // { name: "Facebook", url: "https://facebook.com/yourpage" }
      // Supported icons: Facebook, Instagram, LinkedIn, X, YouTube, TikTok
    ],
  },

  /* ------------------------------------------------------------------ */
  /* NAVIGATION + FOOTER                                                 */
  /* ------------------------------------------------------------------ */
  // Slim contact strip above the header. enabled: false removes it.
  topBar: { enabled: true, message: "", showHours: true, showEmail: true },

  nav: {
    items: [
      { page: "home", label: "Home" },
      { page: "about", label: "About" },
      { page: "services", label: "Services" },
      { page: "contact", label: "Contact" },
    ],
    cta: { label: "Get a quote", page: "contact" },
  },
  footer: {
    blurb: "Maintenance, renovation and repair for homes and commercial properties.",
    columns: ["explore", "contact", "hours"], // order of footer columns
    legal: "All rights reserved.",
    extraLinks: [], // e.g. { label: "Privacy policy", href: "/privacy" } (page must exist)
  },

  /* ------------------------------------------------------------------ */
  /* CONTACT FORM                                                        */
  /* ------------------------------------------------------------------ */
  form: {
    // Provider endpoint that accepts a JSON POST (Formspree, Getform, Basin,
    // your own API or serverless function...). Leave "" until one exists.
    // With "" the form validates, then tells the visitor honestly that online
    // sending is not connected and offers a pre-filled email instead.
    endpoint: "",
    enquiryTypes: ["General enquiry", "Request a quote", "Existing project", "Something else"],
    quoteType: "Request a quote", // pre-selected when arriving from a service button
    messages: {
      success: "Thank you. Your message has been sent and we'll reply as soon as we can.",
      error: "Sorry, something went wrong and your message was not sent. Please try again, or contact us by phone or email.",
      notConnected: "Online sending isn't set up yet, so your message has not been sent. Use the button below to send it by email instead.",
    },
    privacyNote: "We only use your details to respond to your enquiry.",
  },

  /* ------------------------------------------------------------------ */
  /* SERVICES / PRODUCTS (shared by Home and Services pages)             */
  /* Works for products too: change the labels and fill `price`.         */
  /* ------------------------------------------------------------------ */
  catalogue: {
    itemLabel: "service", // "service" | "product" | "treatment" ...
    itemLabelPlural: "services",
    items: [
      {
        id: "maintenance",
        icon: "wrench",
        name: "Property maintenance",
        summary: "Scheduled and on-demand upkeep that stops small problems becoming expensive ones.",
        description:
          "Regular inspections and repairs for plumbing, electrical fittings, roofing, gutters and joinery, delivered by the same team each visit so they know your property.",
        benefits: ["Planned visit schedule", "Written condition reports", "Single point of contact"],
        price: null, // e.g. { from: "R1 200", unit: "per visit", note: "excl. materials" }
        cta: "Ask about maintenance",
        featured: true,
        image: { src: "assets/img/service-maintenance.svg", alt: "Illustration of a tool and a property plan" },
      },
      {
        id: "renovation",
        icon: "layers",
        name: "Renovations and refurbishment",
        summary: "Kitchens, bathrooms and full interiors, planned and built to a fixed scope.",
        description:
          "From a single bathroom to a complete interior, we manage design coordination, trades, materials and snagging so you deal with one team from start to handover.",
        benefits: ["Itemised written quotation", "Clear schedule and milestones", "Snag list before handover"],
        price: null,
        cta: "Request a renovation quote",
        featured: true,
        image: { src: "assets/img/service-renovation.svg", alt: "Illustration of layered building materials" },
      },
      {
        id: "commercial",
        icon: "building",
        name: "Commercial fit-out and repairs",
        summary: "Offices, retail and rental units kept compliant, presentable and in service.",
        description:
          "Out-of-hours work, tenant turnarounds and compliance repairs for landlords, managing agents and business owners who cannot afford downtime.",
        benefits: ["After-hours scheduling", "Tenant turnaround packages", "Invoicing to managing agents"],
        price: null,
        cta: "Discuss a commercial job",
        featured: true,
        image: { src: "assets/img/service-commercial.svg", alt: "Illustration of a commercial building" },
      },
      {
        id: "emergency",
        icon: "bolt",
        name: "Emergency repairs",
        summary: "Fast response for leaks, electrical faults and storm damage.",
        description:
          "When something fails urgently, we make the property safe first, then agree the permanent repair with you.",
        benefits: ["Make-safe first", "Permanent repair quoted separately", "Photographic record for insurers"],
        price: null,
        cta: "Report an urgent issue",
        featured: false,
        image: { src: "assets/img/service-emergency.svg", alt: "Illustration of a warning symbol over a building" },
      },
    ],
    // Optional pricing table (Services page, section type "pricing"). Leave tiers [] to hide.
    pricing: {
      heading: "Straightforward pricing",
      intro: "Every project is quoted in writing before work starts. Typical starting points are shown below.",
      tiers: [],
      // Example tier:
      // { name: "Standard visit", price: "R1 200", unit: "per visit", features: ["Up to 3 hours", "Report"], cta: "Book a visit", highlight: false }
    },
  },

  /* ------------------------------------------------------------------ */
  /* PAGES: SEO + ordered sections                                       */
  /* Reorder, remove or duplicate sections freely. Each is {type,...}.   */
  /* ------------------------------------------------------------------ */
  pages: {
    home: {
      slug: "", // "" = site root
      seo: {
        title: "Property maintenance in Johannesburg",
        description:
          "Meridian Works provides property maintenance, renovations and commercial repairs in Johannesburg. Request a written quote today.",
        keywords: ["property maintenance Johannesburg", "renovations Sandton", "commercial repairs"],
      },
      sections: [
        {
          type: "hero",
          eyebrow: "Property maintenance and renovation",
          headline: "Considered work, finished properly.",
          text:
            "Meridian Works looks after homes and commercial properties across Johannesburg, from routine upkeep to full renovations, with clear quotes and one team you can reach.",
          primaryCta: { label: "Request a quote", page: "contact", query: "?enquiry=quote" },
          secondaryCta: { label: "View services", page: "services" },
          highlights: ["Written quotes", "One point of contact", "Tidy, on-schedule work"],
          image: { src: "assets/img/hero.svg", alt: "Architectural illustration of a house elevation with measurement lines", width: 760, height: 620 },
        },
        {
          type: "intro",
          eyebrow: "Who we are",
          heading: "A small team that treats your property like its own.",
          paragraphs: [
            "We started Meridian Works because property owners kept telling us the same thing: finding a reliable team to do the job properly, on the agreed date, shouldn't be difficult.",
            "Today we handle everything from a leaking tap to a full interior renovation. Each job gets a written scope, a fixed quote and a named person responsible for it.",
          ],
          link: { label: "More about us", page: "about" },
          image: { src: "assets/img/about.svg", alt: "Illustration of a floor plan with a pencil", width: 640, height: 520 },
        },
        {
          type: "catalogue",
          eyebrow: "What we do",
          heading: "Our services",
          intro: "Four areas of work, each handled by people who do it every day.",
          featuredOnly: true,
          link: { label: "See all services", page: "services" },
        },
        {
          type: "features",
          eyebrow: "Why choose us",
          heading: "What you can expect when you work with us",
          items: [
            { icon: "doc", title: "Quotes in writing", text: "Every job is scoped and priced in writing before work starts, so there are no surprises on the invoice." },
            { icon: "user", title: "One point of contact", text: "A named project lead answers your calls and messages from first visit to final snag list." },
            { icon: "clock", title: "Respect for your time", text: "We agree a start date and a schedule, and tell you early if anything changes." },
            { icon: "check", title: "Tidy and finished", text: "We protect your property while we work and leave it clean, with every snag resolved." },
          ],
        },
        {
          type: "stats",
          // Placeholders: replace with real, verifiable figures or remove this section.
          items: [
            { value: "00", label: "Projects completed (replace)" },
            { value: "00", label: "Years in business (replace)" },
            { value: "00%", label: "Repeat clients (replace)" },
          ],
          sample: true,
        },
        {
          type: "testimonials",
          eyebrow: "Client feedback",
          heading: "What clients say",
          sample: true, // marks these as examples; set false (and use real quotes) at launch
          items: [
            { quote: "Replace this sample with a genuine client testimonial, with their permission.", name: "Client name", role: "Role or location" },
            { quote: "Add a second real testimonial here, or delete this entry.", name: "Client name", role: "Role or location" },
          ],
        },
        {
          type: "cta",
          heading: "Tell us about your property.",
          text: "Describe the job and we'll respond with the next steps and a written quote.",
          primaryCta: { label: "Request a quote", page: "contact", query: "?enquiry=quote" },
          secondaryCta: { label: "Call us", phone: true },
        },
      ],
    },

    about: {
      slug: "about",
      seo: {
        title: "About Meridian Works",
        description:
          "Learn how Meridian Works approaches property maintenance and renovation in Johannesburg: our story, mission, values and what sets us apart.",
        keywords: ["about Meridian Works", "property maintenance company"],
      },
      sections: [
        {
          type: "pageHeader",
          eyebrow: "About us",
          heading: "Careful people doing careful work.",
          text: "Who we are, how we work and what we hold ourselves to.",
        },
        {
          type: "story",
          heading: "Our story",
          paragraphs: [
            "Meridian Works began with a simple standard: do what we said we would, when we said we would, and leave the property better than we found it.",
            "Replace this story with the real history of the business: who founded it, why, and how it has grown. Specific, true detail is more persuasive than general claims.",
          ],
          image: { src: "assets/img/about.svg", alt: "Illustration of a floor plan with a pencil", width: 640, height: 520 },
        },
        {
          type: "missionVision",
          mission: { heading: "Our mission", text: "To keep properties safe, sound and well presented through honest advice and reliable workmanship." },
          vision: { heading: "Our vision", text: "To be the first call property owners make, and the last one they need to repeat." },
        },
        {
          type: "values",
          eyebrow: "Values",
          heading: "How we work",
          items: [
            { title: "Honesty", text: "We tell you what needs doing, what can wait, and what it will cost." },
            { title: "Accountability", text: "Every job has a named person who owns the result." },
            { title: "Craft", text: "We take pride in the details you only notice when they're wrong." },
            { title: "Respect", text: "For your property, your schedule and your budget." },
          ],
        },
        {
          type: "differentiators",
          eyebrow: "What sets us apart",
          heading: "Different where it matters",
          items: [
            { title: "Scope before schedule", text: "We define exactly what is included before committing to dates or prices." },
            { title: "Photographic records", text: "Before and after documentation on every job, useful for owners, agents and insurers." },
            { title: "Same team, every visit", text: "Continuity means we learn your property and you don't repeat yourself." },
          ],
        },
        {
          type: "team",
          optional: true,
          eyebrow: "Our team",
          heading: "The people you'll deal with",
          // Add real people. With members: [] this section is hidden automatically.
          members: [],
          // { name: "Full name", role: "Role", bio: "One or two sentences.", image: { src: "assets/img/team-1.jpg", alt: "Full name" } }
        },
        {
          type: "cta",
          heading: "Let's talk about your project.",
          text: "Get in touch and we'll arrange a time to see the property.",
          primaryCta: { label: "Contact us", page: "contact" },
        },
      ],
    },

    services: {
      slug: "services",
      seo: {
        title: "Services: maintenance, renovations and repairs",
        description:
          "Property maintenance, renovations, commercial fit-outs and emergency repairs in Johannesburg. See what we do and request a written quote.",
        keywords: ["property maintenance services", "renovation services Johannesburg"],
      },
      sections: [
        {
          type: "pageHeader",
          eyebrow: "Services",
          heading: "What we can do for your property.",
          text: "Choose a service to see what's included, or contact us to talk through something that isn't listed.",
        },
        { type: "catalogueDetail" },
        {
          type: "process",
          eyebrow: "How it works",
          heading: "From first call to handover",
          intro: "Every project follows the same four steps, so you always know what happens next.",
          items: [
            { title: "Tell us what you need", text: "Send an enquiry or call. For larger jobs we arrange a site visit." },
            { title: "Receive a written quote", text: "An itemised scope, price and timeline, in writing, before anything starts." },
            { title: "Work begins", text: "We agree a start date. Your named project lead is your single contact." },
            { title: "Handover", text: "We walk through the finished work with you and resolve any snags." },
          ],
        },
        { type: "pricing" },
        {
          type: "faq",
          eyebrow: "Questions",
          heading: "Common questions",
          sample: true, // replace with real answers, then set false
          items: [
            { q: "How do you price a job?", a: "Every project is quoted in writing before work starts, with the scope and price itemised so you can see what is included." },
            { q: "Which areas do you cover?", a: "We work across Johannesburg, Sandton and Randburg. If you are nearby, ask and we will let you know." },
            { q: "Can you help with urgent problems?", a: "Yes. For leaks, electrical faults and storm damage we make the property safe first, then agree the permanent repair with you." },
            { q: "How soon can you start?", a: "Once you approve the quote we agree a start date. Timing depends on the size of the job and our current schedule." },
            { q: "Do I need a site visit before getting a quote?", a: "Small jobs can often be quoted from photos and a description. Larger or more complex work is best quoted after a visit." },
          ],
        },
        {
          type: "cta",
          heading: "Not sure which service you need?",
          text: "Describe the problem and we'll recommend the right approach.",
          primaryCta: { label: "Ask for advice", page: "contact", query: "?enquiry=quote" },
        },
      ],
    },

    contact: {
      slug: "contact",
      seo: {
        title: "Contact Meridian Works",
        description:
          "Contact Meridian Works to request a quote or ask a question. Phone, email, WhatsApp, opening hours and a simple enquiry form.",
        keywords: ["contact Meridian Works", "request a quote"],
      },
      sections: [
        {
          type: "pageHeader",
          eyebrow: "Contact",
          heading: "Tell us what you need.",
          text: "Send an enquiry using the form, or reach us directly using the details below.",
        },
        { type: "contactMain" },
      ],
    },
  },
};
