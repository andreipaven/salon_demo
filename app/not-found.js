import Link from "next/link";
import { useTranslations } from "next-intl";

/* Inline line-art of a client in the salon chair, in the same visual language
   as the floating instruments in the hero. Colours are not written here: every
   stroke/fill reads a --* token through its class in globals.css. */
function HaircutArt() {
  return (
    <svg className="nf-art" viewBox="0 0 460 400" fill="none" aria-hidden>
      <g transform="translate(230 210) scale(1.22) translate(-230 -210)">
        {/* floor */}
        <path className="soft" d="M66 366 H394" strokeWidth="1.5" strokeLinecap="round" />

        {/* chair: round hydraulic base + column, same silhouette as the 3D chair */}
        <ellipse className="shade" cx="230" cy="358" rx="62" ry="12" />
        <ellipse className="line" cx="230" cy="352" rx="58" ry="11" strokeWidth="2.5" />
        <path className="line" d="M216 316 H244 V348 H216 Z" strokeWidth="2.5" strokeLinejoin="round" />
        <path className="soft" d="M222 322 H238" strokeWidth="1.5" strokeLinecap="round" />

        {/* cape, draped over the shoulders */}
        <path
          className="line cape"
          d="M160 318 Q174 252 192 218 Q230 204 268 218 Q286 252 300 318 Z"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path className="soft" d="M212 232 V314 M248 232 V314" strokeWidth="1.5" strokeLinecap="round" />
        {/* collar */}
        <path className="accent" d="M207 215 Q230 229 253 215" strokeWidth="3" strokeLinecap="round" />

        {/* neck */}
        <path className="line" d="M218 186 H242 V212 H218 Z" strokeWidth="2.5" strokeLinejoin="round" />

        {/* head */}
        <circle className="line" cx="230" cy="150" r="38" strokeWidth="2.5" />
        <path className="line" d="M192 146 Q182 148 182 156 T192 164" strokeWidth="2.5" strokeLinecap="round" />
        <path className="line" d="M268 146 Q278 148 278 156 T268 164" strokeWidth="2.5" strokeLinecap="round" />

        {/* face */}
        <circle className="ink-fill" cx="218" cy="151" r="3.2" />
        <circle className="ink-fill" cx="242" cy="151" r="3.2" />
        <path className="line" d="M229 158 Q232 165 236 163" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path className="line" d="M220 172 Q230 180 240 172" strokeWidth="2.2" strokeLinecap="round" />

        {/* hair, drawn over the forehead */}
        <path
          className="hair"
          d="M194 140 C196 116 210 101 230 101 C250 101 264 116 266 140 C255 127 244 122 230 122 C216 122 205 127 194 140 Z"
        />

        {/* comb, working through the strand */}
        <g transform="translate(148 176) rotate(-58)">
          <g className="nf-comb">
            <path className="line" d="M0 0 H46" strokeWidth="5" strokeLinecap="round" />
            <path
              className="line"
              d="M5 2 V12 M11 2 V12 M17 2 V12 M23 2 V12 M29 2 V12 M35 2 V12 M41 2 V12"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* scissors: the two halves snip around the pivot at (5,0) */}
        <g transform="translate(300 124) rotate(-16)">
          <g className="nf-scissors">
            <g className="nf-blade-a">
              <circle className="line" cx="30" cy="-11" r="7.5" strokeWidth="2.5" />
              <path className="line" d="M24 -8 L6 -3 M6 -3 L-28 -11" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <g className="nf-blade-b">
              <circle className="line" cx="31" cy="11" r="7.5" strokeWidth="2.5" />
              <path className="line" d="M25 8 L6 3 M6 3 L-28 9" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <circle className="accent-fill" cx="5" cy="0" r="3" />
          </g>
        </g>

        {/* clippings, each released on its own delay */}
        <path className="clip" style={{ "--d": "0s" }} d="M286 166 Q293 172 287 179" strokeWidth="2.6" strokeLinecap="round" />
        <path className="clip accent" style={{ "--d": "0.7s" }} d="M297 171 Q304 177 298 184" strokeWidth="2.6" strokeLinecap="round" />
        <path className="clip" style={{ "--d": "1.4s" }} d="M277 174 Q270 180 276 187" strokeWidth="2.6" strokeLinecap="round" />
        <path className="clip" style={{ "--d": "2.1s" }} d="M305 178 Q312 184 306 191" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="notfound">
      <div className="wrap nf-grid">
        <div className="nf-text">
          <Link href="/" className="brand nf-brand">NORD<span className="dot" /></Link>
          <span className="section-label">{t("label")}</span>
          <h1>{t("heading")}</h1>
          <p>{t("text")}</p>
          <Link href="/" className="btn btn-primary nf-cta">{t("cta")}</Link>
        </div>

        <div className="nf-visual">
          <HaircutArt />
        </div>
      </div>
    </main>
  );
}
