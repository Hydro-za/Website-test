"""Browser QA for the built site. Usage: python3 tools/test.py  (needs playwright + chrome)"""
import json, re, subprocess, sys, time, os
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(__file__), "..", "dist")
PORT = 8765
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "-d", ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
BASE = f"http://127.0.0.1:{PORT}"
PAGES = ["/", "/about/", "/services/", "/contact/"]
fails, notes = [], []
def check(cond, msg):
    (notes if cond else fails).append(("PASS " if cond else "FAIL ") + msg)

try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        shots = os.path.join(os.path.dirname(__file__), "..", "screenshots"); os.makedirs(shots, exist_ok=True)
        seen_links = set()
        for vp_name, vp in {"desktop": (1366, 900), "tablet": (820, 1100), "mobile": (390, 844)}.items():
            ctx = b.new_context(viewport={"width": vp[0], "height": vp[1]}, device_scale_factor=1)
            ctx.route(re.compile(r"https://fonts\.(googleapis|gstatic)\.com/.*"), lambda r: r.fulfill(status=200, body="", content_type="text/css"))
            for path in PAGES:
                pg = ctx.new_page(); errs = []
                pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
                pg.on("pageerror", lambda e: errs.append(str(e)))
                pg.on("requestfailed", lambda r: errs.append("requestfailed " + r.url))
                pg.goto(BASE + path, wait_until="networkidle")
                tag = f"{vp_name}{path}"
                check(not errs, f"{tag}: no console errors" + (f" {errs}" if errs else ""))
                over = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                check(over <= 0, f"{tag}: no horizontal overflow ({over}px)")
                bad = pg.evaluate("[...document.images].filter(i=>i.complete && i.naturalWidth===0).map(i=>i.src)")
                lazy_bad = pg.evaluate("""async()=>{const out=[];for(const i of document.images){ i.scrollIntoView(); if(!i.complete){await new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,2000)})} if(i.naturalWidth===0) out.push(i.src)} return out}""")
                check(not lazy_bad, f"{tag}: all images load {lazy_bad}")
                if vp_name == "desktop":
                    # new components
                    logo = pg.evaluate("""()=>{const a=document.querySelector('.site-header .brand');const i=a.querySelector('img.brand__logo');const n=a.querySelector('.brand__name');return i&&n?{ok:i.getBoundingClientRect().right<=n.getBoundingClientRect().left+1,h:i.getBoundingClientRect().height}:null}""")
                    check(logo and logo["ok"], f"{tag}: logo image sits left of business name")
                    check(pg.locator(".topbar a[href^='tel:']").count() == 1, f"{tag}: top bar with phone")
                    check((pg.locator(".wa-float").count() == 1) == (path != "/contact/"), f"{tag}: floating WhatsApp (hidden on contact page)")
                    ff = pg.evaluate("getComputedStyle(document.querySelector('h1')).fontFamily")
                    check("Plus Jakarta Sans" in ff, f"{tag}: heading font stack starts with Plus Jakarta Sans")
                    if path == "/services/":
                        d = pg.locator(".faq__item")
                        check(d.count() == 5 and pg.locator(".steps li").count() == 4, f"{tag}: FAQ (5) and process steps (4) render")
                        d.nth(0).locator("summary").click()
                        check(d.nth(0).evaluate("e=>e.open"), f"{tag}: FAQ item opens on click")
                        ld = pg.evaluate("[...document.querySelectorAll('script[type=\"application/ld+json\"]')].map(s=>s.textContent).join()")
                        check("FAQPage" in ld, f"{tag}: FAQPage schema present")
                    # structure
                    h = pg.evaluate("[...document.querySelectorAll('h1,h2,h3')].map(e=>+e.tagName[1])")
                    check(h.count(1) == 1, f"{tag}: exactly one h1")
                    jumps = [(a, c) for a, c in zip(h, h[1:]) if c - a > 1]
                    check(not jumps, f"{tag}: heading order has no skipped levels {jumps}")
                    check(pg.evaluate("[...document.images].every(i=>i.hasAttribute('alt'))"), f"{tag}: every img has alt")
                    ld = pg.evaluate("[...document.querySelectorAll('script[type=\"application/ld+json\"]')].map(s=>s.textContent)")
                    try: [json.loads(x) for x in ld]; check(len(ld) > 0, f"{tag}: JSON-LD parses")
                    except Exception as e: check(False, f"{tag}: JSON-LD invalid {e}")
                    meta = pg.evaluate("""()=>({t:document.title,d:document.querySelector('meta[name=description]')?.content,c:document.querySelector('link[rel=canonical]')?.href,og:document.querySelector('meta[property="og:title"]')?.content,lang:document.documentElement.lang})""")
                    check(meta["t"] and meta["d"] and meta["c"] and meta["og"] and meta["lang"], f"{tag}: title/description/canonical/og/lang present")
                    seen_links |= set(pg.evaluate("[...document.querySelectorAll('a[href]')].map(a=>a.href)"))
                    seen_links |= set(pg.evaluate("[...document.querySelectorAll('link[href],script[src],img[src]')].map(e=>e.href||e.src)"))
                    # hash targets
                    missing = pg.evaluate("""[...document.querySelectorAll('a[href*="#"]')].filter(a=>new URL(a.href).origin===location.origin && new URL(a.href).pathname===location.pathname && a.hash.length>1 && !document.getElementById(a.hash.slice(1))).map(a=>a.hash)""")
                    check(not missing, f"{tag}: in-page anchors resolve {missing}")
                    titles[path] = meta["t"] if (titles := globals().setdefault("titles", {})) is not None else 0
                pg.evaluate("""async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,80))}window.scrollTo({top:0,behavior:'instant'});await new Promise(r=>setTimeout(r,700))}""")
                if vp_name != "tablet":
                    pg.screenshot(path=os.path.join(shots, f"{vp_name}-{path.strip('/') or 'home'}.png"), full_page=True)
                pg.close()
            ctx.close()
        check(len(set(titles.values())) == 4, "unique <title> per page")
        # link check
        import urllib.request, urllib.error
        for u in sorted(seen_links):
            if urlparse(u).netloc != f"127.0.0.1:{PORT}": continue
            u0 = u.split("#")[0]
            try: urllib.request.urlopen(u0).read(1); ok = True
            except Exception as e: ok = False
            if not ok: check(False, f"broken link {u0}")
        check(not any("broken link" in f for f in fails), f"internal links/assets resolve ({len(seen_links)} checked)")

        # mobile nav
        ctx = b.new_context(viewport={"width": 390, "height": 844}); pg = ctx.new_page(); pg.goto(BASE + "/", wait_until="networkidle")
        vis0 = pg.locator("#site-nav").is_visible()
        pg.click(".nav-toggle"); time.sleep(.4)
        check(not vis0 and pg.locator("#site-nav").is_visible() and pg.get_attribute(".nav-toggle", "aria-expanded") == "true", "mobile menu opens (aria-expanded true)")
        pg.screenshot(path=os.path.join(shots, "mobile-menu-open.png"))
        pg.keyboard.press("Escape"); time.sleep(.4)
        check(not pg.locator("#site-nav").is_visible(), "mobile menu closes with Escape")
        ctx.close()

        # form tests (no endpoint configured)
        ctx = b.new_context(viewport={"width": 1100, "height": 900}); pg = ctx.new_page(); pg.goto(BASE + "/contact/?enquiry=quote&service=Renovations", wait_until="networkidle")
        check(pg.input_value("#f-type") == "Request a quote" and "Renovations" in pg.input_value("#f-message"), "query params prefill type and message")
        pg.fill("#f-message", ""); pg.click("button[type=submit]")
        errs = pg.eval_on_selector_all(".field__error", "els=>els.map(e=>e.textContent).filter(Boolean)")
        check(len(errs) >= 3 and pg.evaluate("document.activeElement.id") == "f-name", f"empty submit shows errors and focuses first invalid ({len(errs)} errors)")
        pg.fill("#f-name", "Test User"); pg.fill("#f-email", "not-an-email"); pg.fill("#f-phone", "abc"); pg.select_option("#f-type", "General enquiry"); pg.fill("#f-message", "short")
        pg.click("button[type=submit]")
        e = pg.eval_on_selector_all(".field__error", "els=>els.map(e=>e.textContent).filter(Boolean)")
        check(any("valid email" in x for x in e) and any("phone" in x for x in e) and any("at least 10" in x for x in e), "invalid email / phone / short message rejected")
        pg.fill("#f-email", "test@example.com"); pg.fill("#f-phone", "+27 11 555 0100"); pg.fill("#f-message", "A proper message with enough length.")
        pg.click("button[type=submit]")
        st = pg.inner_text("#form-status")
        check("isn't set up yet" in st and pg.locator("#form-status a[href^='mailto:']").count() == 1 and "has been sent" not in st, "no endpoint: honest 'not sent' message + mailto fallback (never claims success)")
        pg.screenshot(path=os.path.join(shots, "form-notconnected.png"))
        # with a mock endpoint
        pg.route("**/mock-ok", lambda r: r.fulfill(status=200, body="{}", content_type="application/json"))
        pg.route("**/mock-fail", lambda r: r.fulfill(status=500, body="{}"))
        for url, expect in (("http://127.0.0.1:%d/mock-ok" % PORT, "has been sent"), ("http://127.0.0.1:%d/mock-fail" % PORT, "not sent")):
            pg.evaluate("u=>document.getElementById('contact-form').dataset.endpoint=u", url)
            pg.fill("#f-name", "Test User"); pg.fill("#f-email", "test@example.com"); pg.select_option("#f-type", "General enquiry"); pg.fill("#f-message", "A proper message with enough length.")
            pg.click("button[type=submit]"); pg.wait_for_selector("#form-status > div"); time.sleep(.3)
            check(expect in pg.inner_text("#form-status"), f"endpoint {url.rsplit('/',1)[1]}: shows '{expect}'")
        ctx.close(); b.close()
finally:
    srv.terminate()
print("\n".join(notes)); print("\n".join(fails))
print(f"\n{len(notes)} passed, {len(fails)} failed"); sys.exit(1 if fails else 0)
