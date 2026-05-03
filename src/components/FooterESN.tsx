export default function FooterESN() {
  return (
    <footer className="esn-footer" style={{ fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif" }}>
      {/* Newsletter section */}
      <section className="esn-footer__newsletter">
        <div className="esn-footer__newsletter-bg">
          <img
            src="//www.esn.com/cdn/shop/files/HEADER2_1.png?v=1763647193&width=100"
            alt=""
            className="esn-footer__newsletter-img"
          />
        </div>
        <div className="esn-footer__newsletter-content">
          <h2 className="esn-footer__newsletter-title">
            Jetzt Newsletter abonnieren und -15% sichern
          </h2>
          <p className="esn-footer__newsletter-text">
            Melde dich für unseren Newsletter an und sichere dir -15% auf deine erste Bestellung.
            Plus: wöchentliche Top-Deals, Expertenwissen und exklusive Vorteile – direkt in dein Postfach.
            Hol das Beste aus dir heraus – mit ESN!
          </p>
          <form className="esn-footer__newsletter-form" onSubmit={e => e.preventDefault()}>
            <label htmlFor="footer-email">E-Mail *</label>
            <input
              id="footer-email"
              type="email"
              placeholder="name@gmail.com"
              className="esn-footer__newsletter-input"
            />
            <button type="submit" className="esn-footer__newsletter-btn">
              JETZT ANMELDEN
            </button>
          </form>
          <p className="esn-footer__newsletter-disclaimer">
            Eine Abmeldung ist jederzeit möglich. Hier findest du unsere{" "}
            <a href="/policies/privacy-policy">Datenschutzerklärung</a>.
          </p>
        </div>
      </section>

      {/* Main footer */}
      <div className="esn-footer__main">
        <div className="esn-footer__container">
          {/* Column 1: Logo + Copyright */}
          <div className="esn-footer__col esn-footer__col--brand">
            <svg className="esn-footer__logo" viewBox="104.15 203.03 985.29 435.63" xmlns="http://www.w3.org/2000/svg">
              <path d="m403.06 422.17 13.81-85.65h-184.5l7.23-44.72h184.5l14.34-88.75-232.49-.02c-58.4 0-100.06 17.5-100.06 80.07 0 58.93 38.53 91.2 94.07 91.2h184.62l18.48-114.39 51.79-320.19h46.7l-22.08 136.57h210.68l-22.08 136.57h-210.68l-14.33 88.75h225.57l-12.87 79.56h-225.57l-18.48 114.39-14.51 89.75h-46.7l14.51-89.75-232.49-.02c-58.4 0-100.06 17.5-100.06 80.07 0 58.93 38.53 91.2 94.07 91.2h236.22l22.08-136.57h-225.57l12.87-79.56h225.57l14.33-88.75z" fill="currentColor"/>
            </svg>
            <p className="esn-footer__copyright">
              &copy; {new Date().getFullYear()} Fitmart GmbH & Co. KG
            </p>
          </div>

          {/* Column 2: Kundenservice */}
          <div className="esn-footer__col">
            <p className="esn-footer__col-title">Kundenservice</p>
            <ul className="esn-footer__links">
              <li><a href="https://service.esn.com/hc/de">Hilfe & FAQ</a></li>
              <li><a href="https://service.esn.com/hc/de/requests/new">Kontakt</a></li>
              <li><a href="/pages/shipment-tracking">Track my order</a></li>
              <li><a href="https://service.esn.com/hc/de/sections/15501532699409-Versand-und-Lieferung">Versand & Lieferung</a></li>
              <li><a href="https://service.esn.com/hc/de/articles/15028552188305-Wie-sende-ich-einen-Artikel-zur%C3%BCck">Retouren</a></li>
              <li><a href="/pages/compliance">Hinweisgebersystem</a></li>
              <li><a href="/pages/kolner-liste">Kölner Liste</a></li>
              <li><a href="/pages/halal-produktubersicht">Halal Produktübersicht</a></li>
              <li><a href="/pages/presse">Presse</a></li>
              <li><a href="/pages/refer-a-friend?situation=website_footer">Freunde werben</a></li>
            </ul>
          </div>

          {/* Column 3: Unternehmen */}
          <div className="esn-footer__col">
            <p className="esn-footer__col-title">Unternehmen</p>
            <ul className="esn-footer__links">
              <li><a href="/pages/ueber-uns">Über uns</a></li>
              <li><a href="/blogs/news">Blog</a></li>
              <li><a href="https://www.tqgg.de/en/jobs">Jobs & Karriere</a></li>
              <li><a href="https://b2b.esn.com/?redirected=1">Händlerbereich</a></li>
              <li><a href="/policies/contact-information">Impressum</a></li>
              <li><a href="/policies/terms-of-service">AGB</a></li>
              <li><a href="/policies/privacy-policy">Datenschutzerklärung</a></li>
              <li><a href="/policies/refund-policy">Widerrufsbelehrung</a></li>
              <li><a href="#cookiebot_renew_consent">Cookie Consent anpassen</a></li>
              <li><a href="/pages/compliance">Compliance</a></li>
              <li><a href="/pages/compliance-code-of-conduct">Verhaltenskodex</a></li>
              <li><a href="/pages/code-of-conduct-for-suppliers-and-business-partners">Verhaltenskodex für Lieferanten</a></li>
              <li><a href="/pages/policy-statement">Grundsatzerklärung</a></li>
            </ul>
          </div>

          {/* Column 4: Kategorien */}
          <div className="esn-footer__col">
            <p className="esn-footer__col-title">Kategorien</p>
            <ul className="esn-footer__links">
              <li><a href="/collections/proteine">Proteinpulver</a></li>
              <li><a href="/collections/whey-protein">Whey Protein</a></li>
              <li><a href="/collections/protein-shaker">Protein Shaker</a></li>
              <li><a href="/collections/food-snacks">Protein Snacks</a></li>
              <li><a href="/collections/aminosaeuren">Aminosäuren</a></li>
              <li><a href="/collections/post-workout">Post-Workout</a></li>
              <li><a href="/collections/vitaminpraeparate">Vitaminpräparate</a></li>
              <li><a href="/products/esn-buffered-vitamin-c">Vitamin C</a></li>
              <li><a href="/products/esn-vitamin-d3-k2-120-kaps">Vitamin D3 K2</a></li>
              <li><a href="/products/esn-curcumin-liquid-capsules-60-kaps">Kurkuma Kapseln</a></li>
              <li><a href="/products/esn-nac-pro">NAC</a></li>
              <li><a href="/products/esn-omega-3">Omega-3 Kapseln</a></li>
              <li><a href="/products/omega-3-vegan">Omega-3 vegan</a></li>
              <li><a href="/products/esn-melatonin-night-spray">Melatonin Spray</a></li>
              <li><a href="/products/esn-melatonin-sleep-aid-180-tabl">Melatonin Tabletten</a></li>
              <li><a href="/products/l-carnitine-caps">L-Carnitin</a></li>
            </ul>
          </div>

          {/* Column 5: Produkte */}
          <div className="esn-footer__col">
            <p className="esn-footer__col-title">Produkte</p>
            <ul className="esn-footer__links">
              <li><a href="/products/esn-peanut-butter">Erdnussbutter</a></li>
              <li><a href="/products/esn-protein-pancakes-and-waffles">Protein Pancakes</a></li>
              <li><a href="/products/aminos">EAA</a></li>
              <li><a href="/products/esn-ultrapure-l-glutamine-powder">Glutamin</a></li>
              <li><a href="/products/esn-shaker">Shaker</a></li>
              <li><a href="/products/ultra-syrup">Sirup ohne Zucker</a></li>
              <li><a href="/products/esn-magnesium-caps">Magnesiumbisglycinat</a></li>
              <li><a href="/products/esn-2-kalorienoelspray">Ölspray</a></li>
              <li><a href="/products/beta-alanine">Beta-Alanin</a></li>
              <li><a href="/products/ultrapure-l-citrulline">L-Citrullin</a></li>
              <li><a href="/products/l-theanine">L-Theanin</a></li>
              <li><a href="/products/esn-vitamin-stack-120-kaps">Multivitamin</a></li>
            </ul>
          </div>

          {/* Social + Payment */}
          <div className="esn-footer__col esn-footer__col--social">
            <p className="esn-footer__col-title">Folge uns</p>
            <div className="esn-footer__social-icons">
              <a href="https://www.facebook.com/ESNsupplements/?locale=de_DE" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.367c0-3.017 1.793-4.677 4.265-4.677 1.178 0 2.163.087 2.45.125v2.847h-1.677c-1.314 0-1.568.625-1.568 1.543v1.793h3.136l-.408 3.416H14.62v8.385C19.812 23.125 24 18.048 24 12z"/></svg>
              </a>
              <a href="https://www.youtube.com/channel/UCtIISco2Brx3V51J_Yowt1w" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M23.761 7.2c-.276-1.034-1.085-1.85-2.113-2.124C19.776 4.572 12 4.572 12 4.572s-7.776 0-9.648.504c-1.028.274-1.837 1.09-2.113 2.124C-.276 9.06-.276 12-.276 12s0 2.94.514 4.796c.276 1.034 1.085 1.85 2.113 2.124 1.872.504 9.648.504 9.648.504s7.776 0 9.648-.504c1.028-.274 1.837-1.09 2.113-2.124.514-1.856.514-4.796.514-4.796s0-2.94-.514-4.796zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@esncom" target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16.189 1.5h-3.54v14.304c0 1.705-1.36 3.105-3.055 3.105-1.694 0-3.055-1.4-3.055-3.105 0-1.674 1.331-3.045 3.005-3.045.267 0 .528.037.778.104V9.28a6.59 6.59 0 0 0-.778-.046C5.987 9.234 3.09 12.13 3.09 15.705 3.09 19.3 6.008 22.2 9.594 22.2c3.586 0 6.504-2.9 6.504-6.495V7.67a10.07 10.07 0 0 0 5.914 1.904V6.038a6.53 6.53 0 0 1-3.823-1.234V1.5h-1.999z"/></svg>
              </a>
              <a href="https://www.instagram.com/esncom/?hl=de" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.16c3.206 0 3.586.015 4.847.071 1.172.052 1.805.249 2.226.413a3.71 3.71 0 0 1 1.379.895c.421.421.748.931.895 1.379.164.421.361 1.054.413 2.226.056 1.261.071 1.641.071 4.847s-.015 3.586-.071 4.847c-.052 1.172-.249 1.805-.413 2.226a3.71 3.71 0 0 1-.895 1.379 3.71 3.71 0 0 1-1.379.895c-.421.164-1.054.361-2.226.413-1.261.056-1.641.071-4.847.071s-3.586-.015-4.847-.071c-1.172-.052-1.805-.249-2.226-.413a3.71 3.71 0 0 1-1.379-.895 3.71 3.71 0 0 1-.895-1.379c-.164-.421-.361-1.054-.413-2.226-.056-1.261-.071-1.641-.071-4.847s.015-3.586.071-4.847c.052-1.172.249-1.805.413-2.226a3.71 3.71 0 0 1 .895-1.379 3.71 3.71 0 0 1 1.379-.895c.421-.164 1.054-.361 2.226-.413 1.261-.056 1.641-.071 4.847-.071M12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a5.88 5.88 0 0 0-2.14 1.388 5.88 5.88 0 0 0-1.388 2.14C.333 4.902.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.058 1.278.261 2.151.558 2.913a5.88 5.88 0 0 0 1.388 2.14 5.88 5.88 0 0 0 2.14 1.388c.762.297 1.635.5 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.058 2.151-.261 2.913-.558a5.88 5.88 0 0 0 2.14-1.388 5.88 5.88 0 0 0 1.388-2.14c.297-.762.5-1.635.558-2.913C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.058-1.278-.261-2.151-.558-2.913a5.88 5.88 0 0 0-1.388-2.14 5.88 5.88 0 0 0-2.14-1.388c-.762-.297-1.635-.5-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
              </a>
            </div>

            <p className="esn-footer__col-title" style={{ marginTop: 24 }}>Zahlungsarten</p>
            <div className="esn-footer__payments">
              {["paypal", "klarna", "american_express", "apple_pay", "google_pay", "maestro", "mastercard", "visa"].map(name => (
                <img
                  key={name}
                  src={`https://cdn.shopify.com/shopifycloud/shopify/assets/payment-icons/${name}-05e9b6a4b4e6b4e6b4e6b4e6b4e6b4e6.png`}
                  alt={name}
                  className="esn-footer__payment-icon"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ))}
              <div className="esn-footer__payment-fallback">
                <span>PayPal</span>
                <span>Klarna</span>
                <span>Amex</span>
                <span>Apple Pay</span>
                <span>Google Pay</span>
                <span>Maestro</span>
                <span>Mastercard</span>
                <span>Visa</span>
              </div>
            </div>

            <div className="esn-footer__shipping">
              <span>Versand</span>
              <img src="//www.esn.com/cdn/shop/files/DHL.svg?v=1700814257&width=80" alt="DHL" style={{ height: 20 }} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="esn-footer__bottom">
          <div className="esn-footer__container">
            <span>Alle Preise inkl. der gesetzl. MwSt.</span>
          </div>
        </div>
      </div>

      <style>{`
        .esn-footer {
          background: #fff;
          border-top: 1px solid #edf1f2;
        }
        .esn-footer__newsletter {
          background: #f8f9fa;
          text-align: center;
          padding: 40px 24px 48px;
        }
        .esn-footer__newsletter-bg {
          max-width: 120px;
          margin: 0 auto 24px;
        }
        .esn-footer__newsletter-img {
          width: 100%;
          height: auto;
        }
        .esn-footer__newsletter-content {
          max-width: 600px;
          margin: 0 auto;
        }
        .esn-footer__newsletter-title {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 12px;
          color: #232323;
        }
        .esn-footer__newsletter-text {
          font-size: 14px;
          color: #6e7173;
          margin: 0 0 24px;
          line-height: 1.5;
        }
        .esn-footer__newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
        }
        .esn-footer__newsletter-form label {
          font-size: 13px;
          font-weight: 600;
          color: #232323;
          align-self: flex-start;
        }
        .esn-footer__newsletter-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #edf1f2;
          border-radius: 4px;
          font-size: 14px;
          background: #fff;
          font-family: inherit;
        }
        .esn-footer__newsletter-btn {
          width: 100%;
          padding: 14px 24px;
          background: #4ec3e0;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.5px;
        }
        .esn-footer__newsletter-btn:hover {
          background: #3ab5d3;
        }
        .esn-footer__newsletter-disclaimer {
          font-size: 12px;
          color: #6e7173;
          margin: 16px 0 0;
        }
        .esn-footer__newsletter-disclaimer a {
          color: #232323;
          text-decoration: underline;
        }
        .esn-footer__main {
          padding: 48px 0 0;
        }
        .esn-footer__container {
          max-width: 1248px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 32px 24px;
        }
        .esn-footer__col {
          min-width: 0;
        }
        .esn-footer__col--brand {
          grid-column: 1 / -1;
        }
        .esn-footer__logo {
          width: 80px;
          height: auto;
          color: #000;
          margin-bottom: 12px;
        }
        .esn-footer__copyright {
          font-size: 12px;
          color: #6e7173;
          margin: 0;
        }
        .esn-footer__col-title {
          font-size: 14px;
          font-weight: 700;
          color: #232323;
          margin: 0 0 16px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .esn-footer__links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .esn-footer__links li a {
          font-size: 13px;
          color: #232323;
          text-decoration: none;
          line-height: 1.4;
        }
        .esn-footer__links li a:hover {
          text-decoration: underline;
        }
        .esn-footer__social-icons {
          display: flex;
          gap: 12px;
        }
        .esn-footer__social-icons a {
          color: #232323;
          display: flex;
          align-items: center;
        }
        .esn-footer__social-icons a:hover {
          color: #4ec3e0;
        }
        .esn-footer__payments {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .esn-footer__payment-icon {
          height: 24px;
          width: auto;
        }
        .esn-footer__payment-fallback {
          display: none;
          flex-wrap: wrap;
          gap: 6px;
        }
        .esn-footer__payment-fallback span {
          font-size: 11px;
          color: #6e7173;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .esn-footer__shipping {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          font-size: 13px;
          color: #6e7173;
        }
        .esn-footer__bottom {
          border-top: 1px solid #edf1f2;
          margin-top: 40px;
          padding: 20px 0;
        }
        .esn-footer__bottom .esn-footer__container {
          display: block;
          text-align: center;
        }
        .esn-footer__bottom span {
          font-size: 12px;
          color: #6e7173;
        }
        @media (min-width: 768px) {
          .esn-footer__col--brand {
            grid-column: auto;
          }
          .esn-footer__newsletter-form {
            flex-direction: row;
            align-items: flex-end;
          }
          .esn-footer__newsletter-form label {
            width: 100%;
          }
          .esn-footer__newsletter-input {
            flex: 1;
          }
          .esn-footer__newsletter-btn {
            width: auto;
            white-space: nowrap;
          }
        }
        @media (max-width: 767px) {
          .esn-footer__container {
            grid-template-columns: 1fr 1fr;
          }
          .esn-footer__col--social {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  );
}
