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

| Path                                | Contents                                                                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/pages/index.tsx`               | Homepage                                                                                             |
| `src/css/sibling.css`               | Fonts, header, footer, hero, cards, and status pills, shared word for word with `openrosde.org`      |
| `src/theme/Footer/Layout/index.tsx` | Layout of the footer, shared word for word with `openrosde.org`                                      |
| `src/css/custom.css`                | Palette of OpenRoIS, taken from its logo, and the figure styles                                      |
| `docs/`                             | Documentation, organized as Getting started, Concepts, Guides, Reference, and Project                |
| `sidebars.ts`                       | Documentation navigation                                                                             |
| `static/img/`                       | Logo, the logo of OpenRoSDE for the links to it, diagrams (light and dark variants), and screenshots |
| `docusaurus.config.ts`              | Site configuration, including redirects from former URLs                                             |

## Writing Guidelines

- Write in a technical, precise voice. State what the software does, and mark anything
  not yet implemented as in progress or planned.
- Use "OpenRoIS" for the project, "RoIS 2.0" or "OMG RoIS Framework 2.0" for the
  specification, and "Apache License 2.0" in prose. Use the SPDX identifier
  "Apache-2.0" in machine-readable metadata.
- Avoid em dashes, en dashes, and semicolons in prose.
- Keep diagrams consistent with the colors of the OpenRoIS publications: blue for
  applications, green for the OpenRoIS core, amber for adapters, and gray for hosts.
- Keep `static/img/openrosde-logo.svg` a copy of `static/img/logo.svg` of
  [openrosde/openrosde-docs](https://github.com/openrosde/openrosde-docs), and change
  `src/css/sibling.css` and `src/theme/Footer/Layout/index.tsx` in the same way there,
  since both sites share them word for word.

## License

Content and code in this repository are licensed under the
[Apache License 2.0](LICENSE). Copyright 2026 Coarobo GK.
