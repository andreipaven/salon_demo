"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").toUpperCase();

/* DEMO placeholders — the quotes live in the message bundles and must be
   replaced with the salon's real reviews. Do NOT present these as genuine
   reviews until real ones are provided. */
export default function Testimonials() {
  const t = useTranslations("testimonials");
  const ITEMS = t.raw("items");
  const ref = useRef(null);
  const start = useRef(null);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  const go = useCallback(
    (i) => {
      const n = (i + ITEMS.length) % ITEMS.length;
      setIndex((cur) => {
        if (n === cur) return cur;
        setShow(false);
        setTimeout(() => {
          setIndex(n);
          setShow(true);
        }, 380);
        return cur;
      });
    },
    []
  );

  // scroll reveal
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onDown = (e) => { start.current = e.clientX; };
  const onUp = (e) => {
    if (start.current == null) return;
    const d = e.clientX - start.current;
    start.current = null;
    if (d > 60) go(index - 1);
    else if (d < -60) go(index + 1);
  };
  const onKey = (e) => {
    if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "ArrowRight") go(index + 1);
  };

  const item = ITEMS[index];

  return (
    <section className="testimonials" id="pareri" ref={ref}>
      <div className="tst-inner">
        <div className="tst-head">
          <span className="section-label reveal">{t("label")}</span>
          <h2 className="reveal" style={{ "--d": "90ms" }}>{t("heading")}</h2>
          <p className="tst-sub reveal" style={{ "--d": "170ms" }}>{t("sub")}</p>
        </div>

        <div
          className="tst-stage reveal"
          style={{ "--d": "260ms" }}
          role="group"
          aria-roledescription="carousel"
          aria-label={t("heading")}
          tabIndex={0}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerLeave={() => (start.current = null)}
          onKeyDown={onKey}
        >
          <span className="tst-mark" aria-hidden>&ldquo;</span>

          <button className="tst-arrow prev" aria-label={t("prev")} onClick={() => go(index - 1)}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden><path d="M17 6H1M7 1 1 6l6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="tst-arrow next" aria-label={t("next")} onClick={() => go(index + 1)}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6h16M11 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div className={`tst-body ${show ? "" : "out"}`}>
            <blockquote className="tst-quote">{item.quote}</blockquote>
            <figcaption className="tst-client">
              <span className="tst-avatar" aria-hidden>{initials(item.name)}</span>
              <span className="tst-name">{item.name}</span>
              <span className="tst-role">{t("role")}</span>
            </figcaption>
          </div>
        </div>

        <div className="tst-indicator reveal" style={{ "--d": "340ms" }} aria-label={t("label")}>
          <span className="ti-num">01</span>
          <div className="ti-track">
            {ITEMS.map((_, i) => (
              <button
                key={i}
                className={`ti-seg ${i <= index ? "on" : ""} ${i === index ? "active" : ""}`}
                aria-label={t("goTo", { n: i + 1 })}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <span className="ti-num">0{ITEMS.length}</span>
        </div>
      </div>
    </section>
  );
}
