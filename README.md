<p align="center">
  <a href="https://openrois.org/">
    <img src="static/img/logo.svg" alt="OpenRoIS logo" width="88" height="88">
  </a>
</p>

<h1 align="center">openrois.org</h1>

<p align="center">
  Source of the <a href="https://openrois.org/">OpenRoIS website and documentation</a>.
</p>

---

The site is built with [Docusaurus](https://docusaurus.io/) and deployed to GitHub Pages
on every push to `main`. The OpenRoIS middleware itself lives in
[openrois/openrois](https://github.com/openrois/openrois).

## Develop Locally

Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
npm ci
npm start          # development server with live reload on http://localhost:3000
npm run build      # production build into build/, fails on broken links
npm run serve      # serve the production build locally
```

## Structure

| Path | Contents |
|------|----------|
| `src/pages/index.tsx` | Homepage |
| `src/css/custom.css` | Theme: colors, typography, status pills |
| `docs/` | Documentation, organized as Getting started, Concepts, Guides, Reference, and Project |
| `sidebars.ts` | Documentation navigation |
| `static/img/` | Logo, diagrams (light and dark variants), and screenshots |
| `docusaurus.config.ts` | Site configuration, including redirects from former URLs |

## Writing Guidelines

- Write in a technical, precise voice. State what the software does, and mark anything
  not yet implemented as in progress or planned.
- Use "OpenRoIS" for the project, "RoIS 2.0" or "OMG RoIS Framework 2.0" for the
  specification, and "Apache-2.0" for the license.
- Avoid em dashes, en dashes, and semicolons in prose.
- Keep diagrams consistent with the colors of the OpenRoIS publications: blue for
  applications, green for the OpenRoIS core, amber for adapters, and gray for hosts.

## License

Content and code in this repository are licensed under the
[Apache License 2.0](LICENSE). Copyright 2026 Coarobo GK.
