"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";

// Placeholder salon phone number — replace with the real one.
const PHONE_DISPLAY = "+40 700 000 000";
const PHONE_HREF = "tel:+40700000000";

// Placeholder social links — replace with the salon's real profiles.
const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com", icon: IgIcon },
  { name: "Facebook", href: "https://facebook.com", icon: FbIcon },
  { name: "TikTok", href: "https://tiktok.com", icon: TtIcon },
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L10 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.8v8h3.2Z" />
    </svg>
  );
}
function TtIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M16.6 2h-3.1v13.4a2.7 2.7 0 1 1-2.1-2.6v-3.2a5.9 5.9 0 1 0 5.2 5.8V9.5a7.2 7.2 0 0 0 3.7 1V7.4a4 4 0 0 1-3.7-5.4Z" />
    </svg>
  );
}

const EMPTY = { nume: "", prenume: "", email: "", mesaj: "" };

export default function Contact() {
  const t = useTranslations("contact");
  // Validation schema with localized messages; rebuilt when the locale changes.
  const schema = useMemo(
    () =>
      z.object({
        nume: z.string().trim().min(1, t("errNume")),
        prenume: z.string().trim().min(1, t("errPrenume")),
        email: z
          .string()
          .trim()
          .min(1, t("errEmailRequired"))
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("errEmailInvalid")),
        mesaj: z
          .string()
          .trim()
          .min(10, t("errMesajMin"))
          .max(1000, t("errMesajMax")),
      }),
    [t]
  );

  const sectionRef = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [toast, setToast] = useState({ visible: false, msg: "" });
  const toastTimer = useRef(null);

  // scroll reveal (same mechanism as the other sections)
  useEffect(() => {
    const el = sectionRef.current;
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
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 6000);
  };

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    // DEMO ONLY — no real submission, no email is sent anywhere.
    setTimeout(() => {
      setStatus("success");
      setValues(EMPTY);
      showToast(t("toast"));
      setTimeout(() => setStatus("idle"), 2800);
    }, 900);
  };

  const field = (name, label, type = "text") => (
    <div className={`field ${errors[name] ? "has-error" : ""}`}>
      <label htmlFor={`cf-${name}`}>{label}</label>
      <input
        id={`cf-${name}`}
        name={name}
        type={type}
        value={values[name]}
        onChange={update(name)}
        aria-invalid={errors[name] ? "true" : "false"}
        aria-describedby={errors[name] ? `err-${name}` : undefined}
        autoComplete={name === "email" ? "email" : name === "nume" ? "family-name" : name === "prenume" ? "given-name" : "off"}
      />
      {errors[name] && <span className="field-error" id={`err-${name}`} role="alert">{errors[name]}</span>}
    </div>
  );

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <span className="section-label reveal">{t("label")}</span>
          <h2 className="reveal" style={{ "--d": "90ms" }}>{t("heading")}</h2>
          <p className="reveal" style={{ "--d": "170ms" }}>{t("text")}</p>
          <a className="contact-phone reveal" style={{ "--d": "240ms" }} href={PHONE_HREF}>
            <span className="cp-icon"><PhoneIcon /></span>
            <span className="cp-text">
              <span className="cp-label">{t("phoneLabel")}</span>
              <span className="cp-num">{PHONE_DISPLAY}</span>
            </span>
          </a>

          <div className="contact-socials reveal" style={{ "--d": "300ms" }}>
            <span className="cs-label">{t("socialLabel")}</span>
            <div className="cs-icons">
              {SOCIALS.map(({ name, href, icon: Icon }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <form className="contact-form reveal" style={{ "--d": "220ms" }} onSubmit={onSubmit} noValidate>
          <div className="form-row">
            {field("nume", t("nume"))}
            {field("prenume", t("prenume"))}
          </div>
          {field("email", t("email"), "email")}

          <div className={`field ${errors.mesaj ? "has-error" : ""}`}>
            <label htmlFor="cf-mesaj">{t("mesaj")}</label>
            <textarea
              id="cf-mesaj"
              name="mesaj"
              rows={5}
              value={values.mesaj}
              onChange={update("mesaj")}
              aria-invalid={errors.mesaj ? "true" : "false"}
              aria-describedby={errors.mesaj ? "err-mesaj" : undefined}
            />
            {errors.mesaj && <span className="field-error" id="err-mesaj" role="alert">{errors.mesaj}</span>}
          </div>

          <button type="submit" className={`btn btn-primary form-submit ${status}`} disabled={status === "submitting"}>
            {status === "submitting" ? t("sending") : status === "success" ? t("sent") : t("submit")}
          </button>
          <p className="form-note">{t("note")}</p>
        </form>
      </div>

      <div className={`toast ${toast.visible ? "show" : ""}`} role="status" aria-live="polite">
        <span className="toast-dot" />
        <p>{toast.msg}</p>
        <button className="toast-close" aria-label={t("closeToast")} onClick={() => setToast((prev) => ({ ...prev, visible: false }))}>×</button>
      </div>
    </section>
  );
}
