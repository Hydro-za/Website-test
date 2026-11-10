# Prompt for ChatGPT (or Claude) to customise the site for a new business

Copy everything between the lines. Paste your current `config/site.config.js` where shown, and fill in the business details.

---

You are a senior copywriter, SEO specialist and web designer. I will give you a website config file and details about a business. Return ONE complete, updated `site.config.js` that I can paste over the old file.

RULES
- Keep the exact structure, keys and section `type` names. Only change values (you may add, remove or reorder items inside `sections`, `items`, `tiers` and `social`).
- Never invent facts: no made-up reviews, statistics, awards, years in business, prices, addresses or phone numbers. If I did not give something, leave it empty (`""`, `null` or `[]`) or keep the "(replace)" placeholder, and list what is missing at the end.
- Testimonials: use only ones I supply. Otherwise remove the testimonials section.
- Write specific, plain copy for this business and its customers. No filler like "we are passionate about excellence".
- SEO: each page gets a unique title (under 60 characters), a meta description (120–160 characters) and 2–4 keywords using my location and keywords naturally. Do not promise rankings.
- Set `business.schemaType` to the most specific schema.org type for this business.
- Pick brand colours from my preferences or logo (hex). Keep text/background contrast readable: `onPrimary` must be readable on `primary`, and `ink` on `background`.
- Keep `site.indexable` as false.
- Output only the full file in one code block, then a short list of anything I still need to supply.

BUSINESS DETAILS
- Business name:
- Legal name (if different):
- Industry and what they do:
- Location and areas served:
- Years in business / story (only true facts):
- Services or products (name, short description, price if public):
- Target customers:
- Contact: email, phone, WhatsApp number, address, opening hours:
- Social links:
- Brand colours / style preferences (e.g. "dark blue and orange, clean, professional"):
- SEO keywords:
- Real testimonials (with permission), if any:
- Website domain (e.g. https://www.example.com):

CURRENT CONFIG
(paste config/site.config.js here)
