"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ServicesScene from "./ServicesScene";
import { svc, clamp01 } from "./services-scroll";

/* One pinned, scroll-driven experience for both desktop and mobile: the 3D
   object changes per service while the text appears/disappears and the progress
   bar fills with scroll. Mobile differs only in composition (via `mobile`) and
   CSS, not in behaviour. */
export default function Services() {
  const t = useTranslations("services");
  const items = t.raw("items");
  const secRef = useRef(null);
  const fillRef = useRef(null);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const update = () => setMobile(window.innerWidth <= 980);
    update();
    setReady(true);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // defer mounting the 3D scene until the section is approached, and keep a
  // live flag so the scroll loop below only runs while the section is around
  useEffect(() => {
    if (!ready) return;
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "700px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  // section scroll -> continuous progress (smoothed) that drives the 3D + text.
  // Progress is read once per frame inside the loop (instead of on every scroll
  // event), and the loop itself only runs while the section is live, so the page
  // costs nothing here once the user has scrolled past.
  useEffect(() => {
    if (!ready || !live) return;
    let raf = 0;
    let first = true;
    const tick = () => {
      const el = secRef.current;
      if (el) {
        const total = el.offsetHeight - window.innerHeight;
        svc.target = total > 0 ? clamp01(-el.getBoundingClientRect().top / total) : 0;
        const i = Math.min(3, Math.max(0, Math.floor(svc.target * 4)));
        if (i !== activeRef.current) {
          activeRef.current = i;
          setActive(i);
        }
      }
      // no catch-up animation when the section becomes live again
      svc.p = first ? svc.target : svc.p + (svc.target - svc.p) * 0.09;
      first = false;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${svc.p})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, live]);

  const S = items[active];

  return (
    <section className="services" id="services" ref={secRef}>
      <div className="services-pin">
        {ready && near && <ServicesScene mobile={mobile} />}
        <div className="services-inner">
          <div className="svc-editorial">
            <span className="section-label">{t("label")}</span>
            <h2>{t("heading")}</h2>
            <p>{t("sub")}</p>
          </div>

          <div className="svc-active" key={active}>
            <div className="num">0{active + 1}</div>
            <div className="en">{S.title}</div>
            <div className="ro">{S.name}</div>
            <p className="desc">{S.desc}</p>
            <div className="meta"><span>{S.dur}</span><span className="sep" /><span>{t("price")}</span></div>
          </div>

          <div className="svc-progress">
            <span className="p-num">01</span>
            <div className="p-bar"><div className="p-fill" ref={fillRef} /></div>
            <span className="p-num">04</span>
          </div>
        </div>
      </div>
    </section>
  );
}
