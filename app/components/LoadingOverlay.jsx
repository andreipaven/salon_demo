"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { intro } from "./intro";

/* Premium intro/preloader. The percentage is tied to the REAL hero readiness:
   it waits for fonts + the hero 3D scene's first rendered frame (the scene
   dispatches "hero-ready"). It eases to ~92% while waiting, snaps to 100% when
   ready, holds briefly, then fades out while the hero reveals beneath it. */
export default function LoadingOverlay() {
  const t = useTranslations("loading");
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const numRef = useRef(null);
  const fillRef = useRef(null);
  const ptrRef = useRef(null);

  /* A reload must always start at the top, behind the intro: browsers restore
     the previous scroll position, which would drop the visitor mid-page while
     the preloader is still covering it. An explicit hash (/#contact) is left
     alone — that is a deliberate target. */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) return;
    // instant, so the page does not animate up through `scroll-behavior: smooth`
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    // again on load, in case the browser restores after hydration has run
    window.addEventListener("load", toTop, { once: true });
    return () => window.removeEventListener("load", toTop);
  }, []);

  useEffect(() => {
    let heroOk = false;
    let fontsOk = false;
    let disp = 0;
    let started = false;
    let raf = 0;
    const ready = { v: false };
    const t0 = performance.now();
    const minTime = 750;

    const mark = () => { if (heroOk && fontsOk) ready.v = true; };
    const onHero = () => { heroOk = true; mark(); };
    window.addEventListener("hero-ready", onHero);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fontsOk = true; mark(); });
    else fontsOk = true;
    // safety net if the 3D never signals (e.g. WebGL unavailable)
    const fallback = setTimeout(() => { heroOk = true; fontsOk = true; ready.v = true; }, 4500);

    const beginExit = () => {
      setTimeout(() => {
        intro.startedAt = performance.now();
        document.body.classList.add("hero-reveal");
        setExiting(true);
        setTimeout(() => setGone(true), 850);
      }, 320);
    };

    const tick = () => {
      const elapsed = performance.now() - t0;
      const grow = Math.min(92, (elapsed / 1300) * 92);
      const done = ready.v && elapsed > minTime;
      const target = done ? 100 : grow;
      disp += (target - disp) * (done ? 0.2 : 0.08);
      const v = Math.min(100, Math.round(disp));
      if (numRef.current) numRef.current.textContent = String(v).padStart(2, "0");
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${disp / 100})`;
      if (ptrRef.current) ptrRef.current.style.left = `${disp}%`;
      if (!started && done && disp >= 99) { started = true; beginExit(); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("hero-ready", onHero);
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader ${exiting ? "exit" : ""}`} aria-hidden>
      <div className="pl-center">
        <div className="pl-brand">NORD<span className="pl-dot" /></div>
        <div className="pl-tag">{t("tagline")}</div>
      </div>
      <div className="pl-bottom">
        <div className="pl-pct"><span ref={numRef}>00</span> <i>/ 100</i></div>
        <div className="pl-line">
          <div className="pl-fill" ref={fillRef} />
          <span className="pl-ptr" ref={ptrRef} />
        </div>
      </div>
    </div>
  );
}
