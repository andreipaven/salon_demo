import { useTranslations } from "next-intl";

// [key, href-to-section] — same sections as the header navigation
const NAV = [
  ["home", "#home"],
  ["about", "#about"],
  ["services", "#services"],
  ["contact", "#contact"],
];

// Placeholder salon contact data — replace with the real one.
const PHONE_DISPLAY = "+40 700 000 000";
const PHONE_HREF = "tel:+40700000000";
const EMAIL = "hello@nordstudio.ro";
const ADDRESS = "Str. Exemplu 12, București";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L10 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.2 6.5 8.8 6.2 8.8-6.2" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 10.3c0 5.2-6.4 10.8-7.7 11.9a.5.5 0 0 1-.6 0C10.4 21.1 4 15.5 4 10.3a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.2" r="2.8" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <span className="brand">NORD<span className="dot" /></span>
          <p>{t("tagline")}</p>
        </div>

        <nav className="footer-col">
          <h3 className="footer-title">{t("navTitle")}</h3>
          <ul className="footer-links">
            {NAV.map(([key, href]) => (
              <li key={href}>
                <a href={href}>{tNav(key)}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-col">
          <h3 className="footer-title">{t("contactTitle")}</h3>
          <ul className="footer-contact">
            <li>
              <PhoneIcon />
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            </li>
            <li>
              <MailIcon />
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <PinIcon />
              <span>{ADDRESS}</span>
            </li>
            <li>
              <ClockIcon />
              <span>{t("hours")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p>© {year} NORD. {t("rights")}</p>
        <p className="footer-demo">{t("demo")}</p>
      </div>
    </footer>
  );
}
