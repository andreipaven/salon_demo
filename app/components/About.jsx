"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import AboutScene from "./AboutScene";
import useMountNear from "./useMountNear";

export default function About() {
  const t = useTranslations("about");
  const ref = useRef(null);
  const [visRef, near] = useMountNear("600px");
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 980px)").matches);
    setReady(true);
  }, []);

  // reveal all .reveal / .reveal-r children (staggered via their --d) when the
  // section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll(".reveal, .reveal-r").forEach((n) => n.classList.add("in"));
            io.disconnect();
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-grid">
        <div className="about-text">
          <span className="section-label reveal">{t("label")}</span>
          <h2 className="reveal" style={{ "--d": "90ms" }}>
            {t("headingLine1")}<br />
            {t("headingLine2")}<span className="accent">{t("headingAccent")}</span>
          </h2>
          <p className="reveal" style={{ "--d": "180ms" }}>{t("p1")}</p>
          <p className="reveal" style={{ "--d": "260ms" }}>{t("p2")}</p>
          <p className="reveal" style={{ "--d": "340ms" }}>{t("p3")}</p>
        </div>

        <div className="about-visual reveal-r" style={{ "--d": "200ms" }} ref={visRef}>
          {ready && near && <AboutScene mobile={mobile} />}
          <div className="edi tags">Precision <span>·</span> Craft <span>·</span> Detail</div>
          <div className="edi vert">Hairstyling Studio</div>
        </div>
      </div>
    </section>
  );
}
