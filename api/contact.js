/**
 * Flowline Studio contact form endpoint.
 * Runs as a Vercel Node.js Function at POST /api/contact.
 */
// Accepted enquiry types come from the site config, so the form and this endpoint cannot drift apart.
const SITE_CONFIG = require("../config/site.config.js");
const ALLOWED_ENQUIRIES = new Set(SITE_CONFIG.form.enquiryTypes);

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

  const page = String(body._page || "").slice(0, 500);
  const submittedAt = new Date().toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" });
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const safePage = (() => { try { const url = new URL(page); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } })();
  const rows = [["Name", name], ["Email address", email], ["Phone number", phone || "Not provided"], ["Enquiry type", enquiryType], ["Submitted", submittedAt]];
  const text = ["FLOWLINE STUDIO — NEW ENQUIRY", "================================", ...rows.map(([label, value]) => label + ": " + value), "Page: " + (page || "Not provided"), "", "MESSAGE", message, "", "Reply directly to this email to respond to " + name + "."].join("\n");
  const detailRows = rows.map(([label, value]) => '<tr><td style="padding:11px 0;border-bottom:1px solid #edf0f4;font-size:13px;color:#64748b;width:36%;">' + escapeHtml(label) + '</td><td style="padding:11px 0;border-bottom:1px solid #edf0f4;font-size:14px;color:#172033;font-weight:600;word-break:break-word;">' + escapeHtml(value) + '</td></tr>').join("");
  const pageLink = safePage ? '<div style="margin-top:18px;font-size:12px;color:#64748b;">Sent from: <a href="' + escapeHtml(safePage) + '" style="color:#2563eb;text-decoration:none;">View page</a></div>' : "";
  const html = '<div style="margin:0;padding:32px 12px;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#172033;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e9f0;border-radius:14px;overflow:hidden;"><tr><td style="padding:26px 30px;background:#101827;color:#fff;"><div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9eb5d6;font-weight:700;">Flowline Studio</div><div style="font-size:24px;font-weight:700;margin-top:10px;">New project enquiry</div><div style="font-size:13px;color:#c7d2e2;margin-top:7px;">A new message has been submitted through your website.</div></td></tr><tr><td style="padding:26px 30px 10px;"><div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:14px;">Contact details</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0">' + detailRows + '</table></td></tr><tr><td style="padding:20px 30px 28px;"><div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:12px;">Their message</div><div style="padding:18px;background:#f6f8fb;border:1px solid #e8edf4;border-radius:10px;font-size:14px;line-height:1.7;color:#263247;white-space:pre-wrap;overflow-wrap:anywhere;">' + escapeHtml(message) + '</div>' + pageLink + '<div style="margin-top:24px;"><a href="mailto:' + encodeURIComponent(email) + '" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">Reply to ' + escapeHtml(name) + '</a></div></td></tr><tr><td style="padding:16px 30px;background:#f8fafc;border-top:1px solid #edf0f4;font-size:11px;color:#94a3b8;">Flowline Studio · Website enquiry notification</td></tr></table></div>';
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Flowline Studio <enquiries@flowlinestudio.co.za>",
        to: ["hello@flowlinestudio.co.za"],
        reply_to: email,
        subject: "New " + enquiryType + " enquiry — " + name,
        text,
        html,
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
