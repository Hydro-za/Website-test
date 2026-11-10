/**
 * FLOWLINE STUDIO — SITE CONFIGURATION
 * All public-facing content and brand settings live here.
 */
module.exports = {
  business: {
    name: "Flowline Studio",
    legalName: "Flowline Studio",
    industry: "Web design, motion graphics and video editing",
    tagline: "Digital creativity that moves your business forward.",
    shortDescription: "Flowline Studio helps small businesses build a stronger online presence through modern websites, motion graphics and video editing.",
    foundedYear: null,
    schemaType: "ProfessionalService",
    priceRange: null,
    areaServed: ["Durban", "KwaZulu-Natal", "South Africa"],
    logo: {
      type: "text",
      src: "",
      srcOnDark: "",
      alt: "Flowline Studio",
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
    blurb: "Web design, motion graphics and video editing for businesses ready to make a stronger impression.",
    columns: ["explore", "contact"],
    legal: "All rights reserved.",
    extraLinks: [],
  },

  form: {
    endpoint: "/api/contact",
    enquiryTypes: ["Website design", "Motion graphics", "Video editing", "Multiple services", "General enquiry"],
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
        image: { src: "https://images.unsplash.com/photo-1460925895917-af0e3e9e3e9f?auto=format&fit=crop&w=1200&q=85", alt: "Modern website analytics and design workspace" },
      },
      {
        id: "motion-graphics",
        icon: "bolt",
        name: "Motion Graphics",
        summary: "Eye-catching animated visuals that give your brand more energy and help your message stand out.",
        description: "Bring ideas to life with motion-led visual content for brand communication, promotions and digital platforms. Each piece is shaped around the message, audience and intended use.",
        benefits: ["Animated promotional content", "Logo and brand animation enquiries", "Visuals tailored to digital platforms"],
        price: null,
        cta: "Discuss motion graphics",
        featured: true,
        image: { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=85", alt: "Creative digital visual production with colourful screens" },
      },
      {
        id: "video-editing",
        icon: "doc",
        name: "Video Editing",
        summary: "Polished video content for business promotions, social media and brand storytelling.",
        description: "Turn raw footage and creative ideas into clear, engaging edits. We can discuss pacing, structure, titles and finishing based on your footage and the platform where the video will be used.",
        benefits: ["Promotional and business video edits", "Social media video formatting", "Titles, transitions and finishing"],
        price: null,
        cta: "Discuss video editing",
        featured: true,
        image: { src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85", alt: "Video editing timeline on a professional editing workstation" },
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
        title: "Web Design, Motion Graphics & Video Editing in Durban",
        description: "Flowline Studio helps small businesses in Durban and across South Africa stand out with modern website design, motion graphics and video editing.",
        keywords: ["web design Durban", "website design South Africa", "motion graphics Durban", "video editing Durban", "small business websites"],
      },
      sections: [
        {
          type: "hero",
          eyebrow: "Creative digital studio · Durban, South Africa",
          headline: "Make your business impossible to overlook.",
          text: "We create modern websites, motion graphics and video content that help small businesses show up with confidence and make a lasting impression.",
          primaryCta: { label: "Start a project", page: "contact", query: "?enquiry=quote" },
          secondaryCta: { label: "Explore our services", page: "services" },
          highlights: ["Designed for small businesses", "Modern, mobile-first experiences", "Creative work with purpose"],
          image: { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85", alt: "Modern creative studio desk with a laptop displaying a website" , width: 1400, height: 1050 },
        },
        {
          type: "intro",
          eyebrow: "Flowline Studio",
          heading: "Creative thinking. Clear digital experiences.",
          paragraphs: [
            "Your online presence often gives customers their first impression of your business. It should feel considered, communicate what you do and make the next step easy.",
            "Flowline Studio brings web design, motion graphics and video editing together to help small businesses present their brand with clarity and confidence.",
          ],
          link: { label: "Get to know us", page: "about" },
          image: { src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=85", alt: "Designer working on a clean digital website layout", width: 1200, height: 900 },
        },
        {
          type: "catalogue",
          eyebrow: "What we create",
          heading: "Creative services for growing businesses",
          intro: "Three ways to make your brand look sharper, communicate better and connect with customers.",
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
            { icon: "bolt", title: "Consistent creative", text: "Bring your website and visual content together with a coherent, recognisable brand presence." },
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
        description: "Meet Flowline Studio, a Durban creative digital studio focused on website design, motion graphics and video editing for small businesses.",
        keywords: ["Flowline Studio", "creative studio Durban", "web design studio South Africa"],
      },
      sections: [
        { type: "pageHeader", eyebrow: "About Flowline", heading: "Creative work with your business at the centre.", text: "We help small businesses build a more confident and consistent digital presence." },
        {
          type: "story",
          heading: "A studio focused on making your brand stand out.",
          paragraphs: [
            "Flowline Studio is a Durban-based creative digital studio working across website design, motion graphics and video editing.",
            "Our focus is straightforward: understand what your business needs to communicate, then create digital experiences and visual content that help you communicate it clearly.",
            "Whether you are building your first business website or need creative content to support your brand, the starting point is a conversation about your goals.",
          ],
          image: { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85", alt: "Creative professionals collaborating around a table", width: 1200, height: 900 },
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
        title: "Website Design, Motion Graphics & Video Editing",
        description: "Explore Flowline Studio's website design, motion graphics and video editing services for small businesses in Durban and South Africa.",
        keywords: ["business website design", "motion graphics services", "video editing services Durban"],
      },
      sections: [
        { type: "pageHeader", eyebrow: "Our services", heading: "Creative services that move your brand forward.", text: "Choose the support you need, or combine services to build a more consistent digital presence." },
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
            { q: "Can I enquire about more than one service?", a: "Yes. You can tell us about a combined project involving website design, motion graphics and video editing." },
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
        description: "Get in touch with Flowline Studio in Durban for website design, motion graphics and video editing enquiries.",
        keywords: ["contact Flowline Studio", "web design quote Durban", "creative studio Durban"],
      },
      sections: [
        { type: "pageHeader", eyebrow: "Start a conversation", heading: "Tell us what you have in mind.", text: "Share a little about your business and project. We'll be in touch to discuss the next steps." },
        { type: "contactMain" },
      ],
    },
  },
};
