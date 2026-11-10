/**
 * FLOWLINE STUDIO — SITE CONFIGURATION
 * All public-facing content and brand settings live here.
 */
module.exports = {
  business: {
    name: "Flowline Studio",
    legalName: "Flowline Studio",
    industry: "Website design, ecommerce websites and custom business systems",
    tagline: "Digital creativity that moves your business forward.",
    shortDescription: "Flowline Studio helps businesses build a stronger digital presence with modern websites, ecommerce stores and custom business systems.",
    foundedYear: null,
    schemaType: "ProfessionalService",
    priceRange: null,
    areaServed: ["Durban", "KwaZulu-Natal", "South Africa"],
    logo: {
      type: "image+name",
      src: "assets/img/flowline-icon.svg",
      srcOnDark: "",
      alt: "Flowline Studio wave symbol",
      width: 44,
      height: 44,
      mark: "F",
    },
  },

  site: {
    url: "https://flowlinestudio.co.za",
    language: "en",
    locale: "en_ZA",
    // Keep noindex until the live domain and all content are verified.
    indexable: false,
    outputDir: "dist",
    ogImage: "assets/img/og-default.png",
    titleSeparator: " | ",
  },

  theme: {
    colors: {
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      onPrimary: "#ffffff",
      accent: "#60a5fa",
      ink: "#101828",
      muted: "#667085",
      line: "#e4e7ec",
      surface: "#f5f8ff",
      background: "#ffffff",
    },
    fonts: {
      heading: '"Manrope", system-ui, -apple-system, "Segoe UI", sans-serif',
      body: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap",
    },
    radius: "10px",
  },

  contact: {
    email: "hello@flowlinestudio.co.za",
    phone: "+27 68 015 0877",
    phoneHref: "+27680150877",
    whatsapp: "",
    whatsappMessage: "Hello Flowline Studio, I'd like to discuss a project.",
    whatsappFloating: false,
    address: {
      street: "",
      locality: "Durban",
      region: "KwaZulu-Natal",
      postalCode: "",
      country: "ZA",
      countryName: "South Africa",
    },
    mapEmbedUrl: "",
    mapLink: "",
    hours: [],
    social: [],
  },

  topBar: { enabled: false, message: "", showHours: false, showEmail: false },

  nav: {
    items: [
      { page: "home", label: "Home" },
      { page: "about", label: "About" },
      { page: "services", label: "Services" },
      { page: "contact", label: "Contact" },
    ],
    cta: { label: "Start a project", page: "contact", query: "?enquiry=quote" },
  },

  footer: {
    blurb: "Website design, ecommerce stores and custom business systems for businesses ready to grow online and work smarter.",
    columns: ["explore", "contact"],
    legal: "All rights reserved.",
    extraLinks: [],
  },

  form: {
    endpoint: "/api/contact",
    enquiryTypes: ["Website design", "Ecommerce websites", "Custom business systems", "Multiple services", "General enquiry"],
    quoteType: "Website design",
    messages: {
      success: "Thank you. Your enquiry has been sent. We'll get back to you as soon as we can.",
      error: "Sorry, something went wrong and your enquiry was not sent. Please try again or email us directly.",
      notConnected: "Online form delivery is not connected yet, so your enquiry has not been sent. Use the button below to open a pre-filled email instead.",
    },
    privacyNote: "Your details will only be used to respond to your enquiry.",
  },

  catalogue: {
    itemLabel: "service",
    itemLabelPlural: "services",
    items: [
      {
        id: "web-design",
        icon: "layers",
        name: "Website Design",
        summary: "Modern, responsive websites that help small businesses look professional and turn visitors into enquiries.",
        description: "From a clear landing page to a multi-page business website, we create considered digital experiences that communicate your offer, work smoothly on mobile and make it easy for customers to contact you.",
        benefits: ["Responsive mobile-first layouts", "Clear calls to action and enquiry paths", "Search-friendly page structure"],
        price: null,
        cta: "Discuss a website",
        featured: true,
        image: { src: "assets/img/illustration-website.svg", alt: "Illustrated website layout and interface diagram" },
      },
      {
        id: "custom-business-systems",
        icon: "wrench",
        name: "Custom Business Systems",
        summary: "Purpose-built software that helps businesses organise operations, manage work and simplify everyday processes.",
        description: "We design and develop tailored business systems around the way your company works. From internal dashboards and job management platforms to quotation, invoicing and employee workflows, each system is planned around your real processes rather than forcing your business into generic software.",
        benefits: ["Custom dashboards and business management tools", "Job, project, employee and task management", "Quotation, invoicing and workflow solutions"],
        price: null,
        cta: "Discuss a business system",
        featured: true,
        image: { src: "assets/img/illustration-process.svg", alt: "Illustrated business workflow and connected system diagram" },
      },
      {
        id: "ecommerce-websites",
        icon: "shopping-cart",
        name: "Ecommerce Websites",
        summary: "Professional online stores that make it easy for customers to browse products and shop your business.",
        description: "We create ecommerce websites with clear product layouts, simple navigation and a smooth shopping experience across mobile and desktop. Your store is structured around your products, customers and the way you want to sell online.",
        benefits: ["Product pages and organised categories", "Mobile-friendly shopping experience", "Cart, checkout and essential store pages"],
        price: null,
        cta: "Discuss an online store",
        featured: true,
        image: { src: "assets/img/illustration-website.svg", alt: "Illustrated ecommerce storefront with product cards and shopping cart" },
      },
    ],
    pricing: {
      heading: "Projects shaped around your needs",
      intro: "Every project is different. Tell us what you are looking to create and we can discuss the scope and an appropriate quote.",
      tiers: [],
    },
  },

  pages: {
    home: {
      slug: "",
      seo: {
        title: "Web Design, Ecommerce & Custom Business Systems in Durban",
        description: "Flowline Studio helps businesses in Durban and across South Africa with website design, ecommerce websites and custom business systems.",
        keywords: ["web design Durban", "ecommerce websites Durban", "online stores South Africa", "custom business systems South Africa", "business management software Durban"],
      },
      sections: [
        {
          type: "hero",
          eyebrow: "Creative digital studio · Durban, South Africa",
          headline: "Make your business impossible to overlook.",
          text: "We create modern business websites, online stores and custom systems that help businesses grow with confidence.",
          primaryCta: { label: "Start a project", page: "contact", query: "?enquiry=quote" },
          secondaryCta: { label: "Explore our services", page: "services" },
          highlights: ["Designed for small businesses", "Modern, mobile-first experiences", "Creative work with purpose"],
          image: { src: "assets/img/illustration-hero.svg", alt: "Illustrated responsive website interface" , width: 1400, height: 1050 },
        },
        {
          type: "intro",
          eyebrow: "Flowline Studio",
          heading: "Creative thinking. Clear digital experiences.",
          paragraphs: [
            "Your online presence often gives customers their first impression of your business. It should feel considered, communicate what you do and make the next step easy.",
            "Flowline Studio brings website design, ecommerce stores and custom business systems together to help businesses reach customers and run their operations more efficiently.",
          ],
          link: { label: "Get to know us", page: "about" },
          image: { src: "assets/img/illustration-brand-system.svg", alt: "Illustrated brand identity and design system", width: 1200, height: 900 },
        },
        {
          type: "catalogue",
          eyebrow: "What we create",
          heading: "Digital services for growing businesses",
          intro: "From your business website and online store to the systems behind your operations, we help your business work smarter and grow online.",
          featuredOnly: true,
          link: { label: "View all services", page: "services" },
        },
        {
          type: "features",
          eyebrow: "The Flowline approach",
          heading: "Good design should do more than look good.",
          items: [
            { icon: "check", title: "Purpose-led design", text: "Every page and visual should have a clear job: explain your offer, build confidence or guide the next step." },
            { icon: "user", title: "Built around your business", text: "We start with your goals, audience and content instead of forcing your business into a generic layout." },
            { icon: "phone", title: "Made for modern screens", text: "Responsive layouts help your website and content work across phones, tablets and desktops." },
            { icon: "bolt", title: "Consistent creative", text: "Bring your website, online store and business tools together with a coherent, recognisable brand presence." },
          ],
        },
        {
          type: "cta",
          heading: "Have an idea? Let's make it real.",
          text: "Tell us about your business and what you want to create. We'll take it from there.",
          primaryCta: { label: "Tell us about your project", page: "contact", query: "?enquiry=quote" },
          secondaryCta: { label: "Email Flowline Studio", href: "mailto:hello@flowlinestudio.co.za" },
        },
      ],
    },

    about: {
      slug: "about",
      seo: {
        title: "About Flowline Studio",
        description: "Meet Flowline Studio, a Durban digital studio focused on website design, ecommerce websites and custom business systems for small businesses.",
        keywords: ["Flowline Studio", "creative studio Durban", "web design studio South Africa"],
      },
      sections: [
        { type: "pageHeader", eyebrow: "About Flowline", heading: "Creative work with your business at the centre.", text: "We help small businesses build a more confident and consistent digital presence." },
        {
          type: "story",
          heading: "A studio focused on making your brand stand out.",
          paragraphs: [
            "Flowline Studio is a Durban-based digital studio working across website design, ecommerce websites and custom business systems.",
            "Our focus is straightforward: understand what your business needs to communicate, then create digital experiences and visual content that help you communicate it clearly.",
            "Whether you are building your first business website, launching an online store or improving internal operations, the starting point is a conversation about your goals.",
          ],
          image: { src: "assets/img/illustration-process.svg", alt: "Three-stage creative project workflow diagram", width: 1200, height: 900 },
        },
        {
          type: "missionVision",
          mission: { heading: "Our mission", text: "Make thoughtful digital design and creative content more approachable for small businesses." },
          vision: { heading: "Our vision", text: "Help businesses build a clear, consistent and memorable presence across the digital spaces where customers find them." },
        },
        {
          type: "values",
          eyebrow: "What matters to us",
          heading: "The principles behind the work",
          items: [
            { title: "Clarity", text: "Make the message easy to understand and the next step easy to find." },
            { title: "Craft", text: "Pay attention to the details that make a digital experience feel considered." },
            { title: "Creativity", text: "Use visual ideas to make brands more distinctive without losing sight of the message." },
            { title: "Communication", text: "Keep the process clear, collaborative and focused on the brief." },
          ],
        },
        {
          type: "cta",
          heading: "Let's create something for your business.",
          text: "Tell us what you are working towards and we'll discuss how Flowline Studio can help.",
          primaryCta: { label: "Contact the studio", page: "contact" },
        },
      ],
    },

    services: {
      slug: "services",
      seo: {
        title: "Website Design, Custom Business Systems & Creative Services",
        description: "Explore Flowline Studio's website design, ecommerce websites and custom business systems in Durban and South Africa.",
        keywords: ["business website design", "ecommerce website design Durban", "online store development South Africa", "custom business systems", "business management software"],
      },
      sections: [
        { type: "pageHeader", eyebrow: "Our services", heading: "Digital services that move your business forward.", text: "Choose the support you need, or combine services to build a more consistent digital presence." },
        { type: "catalogueDetail" },
        {
          type: "process",
          eyebrow: "How we work",
          heading: "A clear process from first idea to final delivery.",
          intro: "We keep the process straightforward so the work stays focused on your goals.",
          items: [
            { title: "Tell us about your project", text: "Share your business, audience, goals and what you would like to create." },
            { title: "Confirm the direction", text: "We discuss the scope, deliverables and practical next steps before work begins." },
            { title: "Create and refine", text: "The work takes shape around the agreed brief, with feedback and refinement along the way." },
            { title: "Final delivery", text: "Receive the agreed website or creative assets, ready for their intended use." },
          ],
        },
        { type: "pricing" },
        {
          type: "faq",
          eyebrow: "A few answers",
          heading: "Frequently asked questions",
          sample: false,
          items: [
            { q: "Do you work with small businesses?", a: "Yes. Flowline Studio's services are aimed at small businesses and entrepreneurs looking to improve their digital presence." },
            { q: "Can I enquire about more than one service?", a: "Yes. You can tell us about a combined project involving website design, ecommerce websites and custom business systems." },
            { q: "Do you provide quotes?", a: "Yes. Send us your project details and we can discuss the scope and an appropriate quote." },
            { q: "Where are you based?", a: "Flowline Studio is based in Durban, KwaZulu-Natal, South Africa. Enquiries can be made by email or phone." },
          ],
        },
        {
          type: "cta",
          heading: "Not sure what your project needs?",
          text: "Tell us what you are trying to achieve and we'll help you work out the right starting point.",
          primaryCta: { label: "Discuss your project", page: "contact", query: "?enquiry=quote" },
        },
      ],
    },

    contact: {
      slug: "contact",
      seo: {
        title: "Contact Flowline Studio | Durban, South Africa",
        description: "Get in touch with Flowline Studio in Durban for website design, ecommerce website and custom business system enquiries.",
        keywords: ["contact Flowline Studio", "web design quote Durban", "creative studio Durban"],
      },
      sections: [
        { type: "pageHeader", eyebrow: "Start a conversation", heading: "Tell us what you have in mind.", text: "Share a little about your business and project. We'll be in touch to discuss the next steps." },
        { type: "contactMain" },
      ],
    },
  },
};
