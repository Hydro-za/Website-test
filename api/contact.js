/**
 * Flowline Studio contact form endpoint.
 * Runs as a Vercel Node.js Function at POST /api/contact.
 */
const ALLOWED_ENQUIRIES = new Set([
  "Website design",
  "Motion graphics",
  "Video editing",
  "Multiple services",
  "General enquiry",
]);

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  // Only accept requests submitted from the same site.
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return json(res, 403, { error: "Request origin not allowed." });
      }
    } catch {
      return json(res, 403, { error: "Invalid request origin." });
    }
  }

  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    return json(res, 415, { error: "Expected a JSON request." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch {
      return json(res, 400, { error: "Invalid request body." });
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json(res, 400, { error: "Invalid request body." });
  }

  // Honeypot: quietly accept bot submissions without sending email.
  if (typeof body.website === "string" && body.website.trim()) {
    return json(res, 200, { ok: true });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 254);
  const phone = String(body.phone || "").trim().slice(0, 40);
  const enquiryType = String(body.enquiryType || "").trim();
  const message = String(body.message || "").trim().slice(0, 5000);

  if (name.length < 2) return json(res, 400, { error: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json(res, 400, { error: "Please enter a valid email address." });
  }
  if (phone && !/^[+\d][\d\s().-]{5,24}$/.test(phone)) {
    return json(res, 400, { error: "Please enter a valid phone number." });
  }
  if (!ALLOWED_ENQUIRIES.has(enquiryType)) {
    return json(res, 400, { error: "Please select a valid enquiry type." });
  }
  if (message.length < 10) return json(res, 400, { error: "Please enter a longer message." });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form is missing RESEND_API_KEY.");
    return json(res, 503, { error: "Email delivery is not configured." });
  }

  const text = [
    "New website enquiry — Flowline Studio",
    "",
    "Name: " + name,
    "Email: " + email,
    "Phone: " + (phone || "Not provided"),
    "Enquiry type: " + enquiryType,
    "Page: " + String(body._page || "").slice(0, 500),
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Flowline Studio <hello@flowlinestudio.co.za>",
        to: ["hello@flowlinestudio.co.za"],
        reply_to: email,
        subject: "New enquiry: " + enquiryType,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend send failed:", response.status, detail.slice(0, 1000));
      return json(res, 502, { error: "We could not send your enquiry. Please try again." });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Contact form delivery error:", error);
    return json(res, 502, { error: "We could not send your enquiry. Please try again." });
  }
};
