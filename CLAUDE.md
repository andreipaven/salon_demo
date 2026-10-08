# Project Rules

## Tech Stack
- Next.js
- JavaScript
- Material UI
- Next intl
- Motion (for animations)

## Coding Rules
- Prefer Server Components when possible.
- Keep existing folder structure.
- Reuse existing components before creating new ones.
- Follow the current coding style.
- Never change architecture unless asked.
- Keep changes as small as possible.
- Do not rename files unless necessary.
- Match the existing coding style used throughout the project.
- Never make assumptions about missing code. Ask for the relevant file.
- If multiple solutions exist, explain the pros and cons before implementing one.
- Do not modify more than one feature in a single task.
- Do not introduce new libraries unless explicitly approved.
- Do not remove existing functionality unless explicitly requested.
- Preserve backward compatibility whenever possible.
- Prefer fixing the root cause instead of applying temporary workarounds.
- All names, variables, comments, and code must be written in English.

## Architecture

File layout for a bilingual site on the App Router. Keep the same shape in new
projects; the folder names are the contract.

```text
app/
  [locale]/
    layout.js              fonts, theme, header, footer, metadata defaults
    page.js                home

    about/
      page.jsx

    contact/
      page.jsx

    <route>/page.js        one folder per public page
    <route>/actions.js     server actions for that route ("use server")
    admin/                 internal tools, guarded in proxy.js
    not-found.js           404 inside a locale
    [...rest]/page.js      catch-all that calls notFound()
    opengraph-image.js     social preview, generated per locale

  api/<name>/route.js      HTTP endpoints (see Data and forms)
  globals.css              base rules only
  icon.svg                 favicon
  robots.js, sitemap.js    metadata routes
  siteUrl.js               one source for the public base URL
  pageMetadata.js          canonical, hreflang, Open Graph per page

components/
  layout/                  header, footer, logo — the shell
  ui/                      shared pieces used by more than one page
  <feature>/               everything a single feature owns

content/                    data that is not copy: projects, prices

i18n/                      routing.js, navigation.js, request.js

messages/
  ro.json                  Romanian translations
  en.json                  English translations

theme/                      palette, MUI theme, shared style helpers

proxy.js                    locale routing + route guards (Next 16 middleware)
```

## Data and forms

- **The contact form, and any form that reaches a third-party service, goes through `app/api/<name>/route.js`.** The route handler validates the input again on the server, calls the external service, and returns a JSON result. The client component posts to it with `fetch` and renders the outcome.
- **Secrets are read inside the route handler**, from environment variables without the `NEXT_PUBLIC_` prefix, and are never logged.
- **Validation lives in one shared module** imported by both the form and the route, so the browser and the server apply the same rules.
- **Every endpoint that sends mail, writes data, or triggers an expensive operation is rate limited** by sender/IP as appropriate.
- Public API routes must validate and sanitize all client input on the server.
- API routes must use explicit HTTP methods and reject unsupported methods.
- Do not expose internal errors, stack traces, provider responses, secrets, or implementation details to the client.
- Server Actions stay for internal pages (admin), where no public HTTP endpoint is wanted.

## Colours

- **Every colour comes from `theme/palette.js`.** No colour literal is written anywhere else: not in a component, not in `sx`, not in `globals.css`, not in an inline SVG.
- Components import the `palette` object and read a token from it.
- `globals.css` and any other plain CSS read the `--ob-*` custom properties, which `theme/ThemeRegistry.js` publishes on `:root` from the same tokens.
- Inline SVG uses `currentColor`, or a token passed in as a prop.
- A colour that does not exist yet is added to `theme/palette.js` first, with a name that says what it is for, and then used by its token.

## Security

### General
- Apply a sensible minimum security baseline automatically to every project.
- Never print, expose, commit, or hard-code API keys, tokens, passwords, credentials, or other secrets.
- Never read, modify, create, or expose `.env` files.
- Read secrets only through `process.env` where required.
- Never expose server-only environment variables to client components.
- Never use the `NEXT_PUBLIC_` prefix for secrets.
- Never change Stripe webhook configuration.
- Never remove, weaken, or bypass existing authentication or authorization checks.
- Never disable a security control just to make an error disappear.
- Prefer fixing the root cause over weakening security.

### Input and API Security
- Never trust client-side validation. Validate all public input again on the server.
- Sanitize and constrain input according to its expected type and purpose.
- Public endpoints that send mail, write data, trigger expensive operations, or interact with third-party services must be rate limited.
- State-changing public endpoints must have appropriate CSRF protection when they can be reached through browser cross-site requests.
- Authentication and sensitive-state cookies must use appropriate `HttpOnly`, `Secure`, and `SameSite` attributes.
- Do not leak stack traces, database errors, third-party API responses, or other internal implementation details to the client.
- Log only information that is safe to log. Never log secrets, credentials, tokens, or sensitive user data.

### Security Headers
- Every Next.js project must have a sensible security-header baseline.
- Configure security headers centrally, normally through `next.config.js` unless the existing architecture requires another location.
- The baseline should include:
    - `Content-Security-Policy`
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: SAMEORIGIN`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy` disabling browser capabilities the application does not use
    - `Strict-Transport-Security` in production when the site is served exclusively over HTTPS
- Disable framework identification where possible, for example `poweredByHeader: false`.
- Development-only CSP permissions such as `unsafe-eval` or WebSocket connections must never be enabled in production.
- Do not use broad CSP permissions such as `*`, unrestricted `https:`, or arbitrary third-party origins just to make something work.
- Do not blindly copy a CSP from another project. Adapt it to the actual application.
- Only add external origins to the CSP when a real feature requires them.
- When an external integration is added, allow only the minimum required origins and directives and explain why they are needed.
- Prefer self-hosted resources whenever the existing project already supports them.
- The security baseline must not contain secrets or hard-coded credentials.

### Security-Sensitive Features
- When implementing authentication, payments, webhooks, file uploads, user-generated content, admin functionality, or other security-sensitive features, review the relevant attack surface before implementation.
- Preserve all existing security checks.
- Use the least-permissive configuration that keeps the feature functional.
- Explain what is protected and any relevant limitations.
- Do not introduce a workaround that weakens security without explicit approval.

## Workflow
- Explain the problem before proposing a solution.
- Ask for confirmation before major refactors.
- Ask before installing or removing packages.
- If information is missing, ask instead of guessing.
- Explain every significant code change.
- For standard security configuration, establish the minimum security baseline automatically without waiting for separate approval.
- Before modifying existing security configuration, inspect the current configuration and preserve existing behavior unless there is a clear security reason to change it.
- If a security requirement conflicts with framework functionality, use the least-permissive configuration that keeps the application working and explain the trade-off.
- Do not make unrelated security, architecture, or dependency changes as part of a feature task.