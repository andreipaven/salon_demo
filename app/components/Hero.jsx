"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import HeroScene from "./HeroScene";

export default function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 860px)").matches);
    setReady(true);
  }, []);

  return (
    <section className="hero" id="home">
      {ready && <HeroScene mobile={mobile} />}

      <div className="hero-content">
        <span className="hero-eyebrow">{t("eyebrow")}</span>
        <h1 className="hero-title">
          <span className="line"><i>{t("title1")}</i></span>
          <span className="line"><i>{t("title2")}</i></span>
          <span className="line"><i className="accent">{t("title3")}</i></span>
        </h1>
        <p className="hero-sub">{t("sub")}</p>
        <div className="hero-cta">
          <a href="tel:+40700000000" className="btn btn-primary">{tc("book")}</a>
        </div>
      </div>

      <div className="scroll-cue">
        <span>{t("scroll")}</span>
        <span className="track" />
      </div>
    </section>
  );
}
