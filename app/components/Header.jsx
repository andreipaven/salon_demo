"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

// [key, href-to-section]
const NAV = [
  ["home", "#home"],
  ["about", "#about"],
  ["services", "#services"],
  ["contact", "#contact"],
];

// Placeholder salon phone number — replace with the real one.
const PHONE_HREF = "tel:+40700000000";

export default function Header() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scrollspy — highlight the section currently in view
  useEffect(() => {
    const els = NAV.map(([, h]) => document.getElementById(h.slice(1))).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive("#" + e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <a href="#home" className="brand" onClick={close}>NORD<span className="dot" /></a>
          <nav>
            <ul className="nav">
              {NAV.map(([key, href]) => (
                <li key={href}>
                  <a href={href} className={active === href ? "active" : ""}>{t(`nav.${key}`)}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-right">
            <LanguageSwitcher className="header-lang" />
            <a href={PHONE_HREF} className="btn btn-primary">{t("common.book")}</a>
            <button
              className={`menu-btn ${open ? "open" : ""}`}
              aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* `inert` (not aria-hidden) while closed: it takes the drawer out of the
          accessibility tree AND makes its links unfocusable, so a hidden subtree
          never holds focusable elements. */}
      <div className={`drawer ${open ? "open" : ""}`} onClick={close} inert={!open}>
        <nav className="drawer-nav" onClick={(e) => e.stopPropagation()}>
          <ul>
            {NAV.map(([key, href], i) => (
              <li key={href} style={{ "--i": i }}>
                <a href={href} className={active === href ? "active" : ""} onClick={close}>
                  <span className="d-idx">0{i + 1}</span>
                  <span className="d-label">{t(`nav.${key}`)}</span>
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher className="drawer-lang" />
          <a href={PHONE_HREF} className="btn btn-primary" onClick={close}>{t("common.book")}</a>
        </nav>
      </div>
    </>
  );
}
