import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js. Do not use client-side code here (browser APIs, JSX).

const GITHUB_ORG = 'https://github.com/openrois';
const GITHUB_REPO = 'https://github.com/openrois/openrois';
// The arXiv abstract URL of the paper (arXiv:2609.21178, announced 2026-09-21).
// Keep in sync with src/pages/index.tsx.
const PAPER_URL = 'https://arxiv.org/abs/2609.21178';
const ROIS_SPEC = 'https://www.omg.org/spec/RoIS/2.0';
const COAROBO_URL = 'https://coarobo.com/';
// The sibling site, which shares src/css/sibling.css and the layout of the
// header, the hero, and the footer with this one.
const SIBLING_URL = 'https://openrosde.org/';
// The first year of OpenRoIS, that of the first commit of its repositories
// (2026-06-25), which starts the copyright line of the footer.
const FIRST_YEAR = 2026;
const CURRENT_YEAR = new Date().getFullYear();
const COPYRIGHT_YEARS = CURRENT_YEAR > FIRST_YEAR ? `${FIRST_YEAR}-${CURRENT_YEAR}` : `${FIRST_YEAR}`;
// A project of the family with its number and its logo, for the Open Source dropdown and the footer.
// The numbers are those of coarobo.com, OpenRoSDE first since it came first, then OpenRoIS.
// static/img/openrosde-logo.svg is a copy of static/img/logo.svg of openrosde/openrosde-docs.
const familyProject = (slug: string, number: string, logo: string, name: string): string =>
  `<span class="sibling-project"><span class="sibling-number sibling-number--${slug}">${number}</span>` +
  `<img src="${logo}" alt="" width="20" height="20">${name}</span>`;
const OPENROSDE = familyProject('openrosde', '01', '/img/openrosde-logo.svg', 'OpenRoSDE');
const OPENROIS = familyProject('openrois', '02', '/img/logo.svg', 'OpenRoIS');

// The documentation used to live in a single "White Paper" folder. These
// redirects keep links to the old pages working after the restructure.
const whitePaperRedirects: Array<{from: string; to: string}> = [
  ['introduction', '/docs/intro'],
  ['background', '/docs/concepts/rois-overview'],
  ['architectural-decisions', '/docs/concepts/design-principles'],
  ['recursive-engine', '/docs/concepts/recursive-engine'],
  ['layered-architecture', '/docs/concepts/architecture'],
  ['component-contract', '/docs/concepts/component-contract'],
  ['type-pipeline', '/docs/concepts/type-pipeline'],
  ['developer-experience', '/docs/guides/service-application'],
  ['wire-protocol', '/docs/reference/wire-protocol'],
  ['deployment-topologies', '/docs/concepts/deployment-topologies'],
  ['transport-strategy', '/docs/concepts/transports-and-media'],
  ['control-data-plane', '/docs/concepts/transports-and-media'],
  ['security-architecture', '/docs/concepts/security'],
  ['component-library-package-management', '/docs/reference/components'],
  ['roadmap-maturity', '/docs/project/roadmap'],
  ['hub-marketplace', '/docs/project/roadmap'],
  ['related-work', '/docs/project/related-work'],
  ['conclusion', '/docs/intro'],
].map(([page, to]) => ({from: `/docs/White Paper/${page}`, to}));

const config: Config = {
  title: 'OpenRoIS',
  tagline:
    'A community-driven open-source middleware implementing the OMG Robotic Interaction Service (RoIS) Framework 2.0',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://openrois.org',
  baseUrl: '/',

  organizationName: 'openrois',
  projectName: 'openrois-docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      type: 'text/css',
    },
  ],

  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
    },
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'OpenRoIS',
        url: 'https://openrois.org/',
        description:
          'A community-driven open-source middleware implementing the OMG Robotic Interaction Service (RoIS) Framework 2.0.',
        codeRepository: GITHUB_REPO,
        license: 'https://www.apache.org/licenses/LICENSE-2.0',
        programmingLanguage: ['Python', 'TypeScript', 'C#'],
        author: {'@type': 'Organization', name: 'OpenRoIS Community'},
      }),
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/openrois/openrois-docs/edit/main/',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          // sibling.css is shared word for word with openrosde.org, and custom.css holds the palette of OpenRoIS.
          customCss: ['./src/css/sibling.css', './src/css/custom.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: whitePaperRedirects,
      },
    ],
  ],

  // The place of the site in the family, which the shared footer shows beside its name.
  customFields: {
    sibling: {slug: 'openrois', number: '02'},
  },

  themeConfig: {
    image: 'img/openrois-social-card.jpg',
    metadata: [
      {
        name: 'keywords',
        content:
          'OpenRoIS, RoIS, Robotic Interaction Service, OMG, human-robot interaction, HRI, middleware, ROS 2, Unity, JSON-RPC, WebSocket, open-source, community-driven',
      },
      {name: 'author', content: 'OpenRoIS Community'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'alpha-status',
      content:
        'OpenRoIS is in alpha. The API may change before 1.0. <a href="/docs/project/roadmap">See the roadmap</a>.',
      isCloseable: true,
    },
    navbar: {
      title: 'OpenRoIS',
      hideOnScroll: false,
      logo: {
        alt: 'OpenRoIS logo',
        src: 'img/logo.svg',
      },
      items: [
        {type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Documentation'},
        {to: '/docs/getting-started/quickstart', label: 'Quick Start', position: 'left'},
        {to: '/docs/reference/wire-protocol', label: 'Protocol', position: 'left'},
        {to: '/docs/project/roadmap', label: 'Roadmap', position: 'left'},
        {to: '/docs/project/contributing', label: 'Contributing', position: 'left'},
        {href: PAPER_URL, label: 'Paper', position: 'right'},
        {
          href: ROIS_SPEC,
          label: 'RoIS Specification',
          position: 'right',
        },
        {
          type: 'dropdown',
          label: 'Open Source',
          position: 'right',
          items: [
            {href: SIBLING_URL, html: OPENROSDE},
            {to: '/', html: OPENROIS, activeBaseRegex: '^/'},
            {href: COAROBO_URL, label: 'Led by Coarobo GK', className: 'sibling-dropdown-lead'},
          ],
        },
        {
          href: GITHUB_REPO,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'OpenRoIS logo',
        src: 'img/logo.svg',
        href: '/',
        width: 64,
        height: 64,
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Quick Start', to: '/docs/getting-started/quickstart'},
            {label: 'Wire Protocol', to: '/docs/reference/wire-protocol'},
            {label: 'Architecture', to: '/docs/concepts/architecture'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'Roadmap', to: '/docs/project/roadmap'},
            {label: 'Contributing', to: '/docs/project/contributing'},
            {label: 'Citing OpenRoIS', to: '/docs/project/citing'},
            {label: 'Related Work', to: '/docs/project/related-work'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub Organization', href: GITHUB_ORG},
            {label: 'Issues', href: `${GITHUB_REPO}/issues`},
            {label: 'arXiv Preprint', href: PAPER_URL},
            {label: 'OMG RoIS Specification', href: ROIS_SPEC},
          ],
        },
        {
          title: 'Open Source',
          items: [
            {
              html: `<a class="footer__link-item" href="${SIBLING_URL}" target="_blank" rel="noopener noreferrer">${OPENROSDE}</a>`,
            },
            {html: `<a class="footer__link-item" href="/">${OPENROIS}</a>`},
            {label: 'Led by Coarobo GK', href: COAROBO_URL},
          ],
        },
      ],
      copyright: [
        `© ${COPYRIGHT_YEARS} Coarobo GK and the OpenRoIS community.`,
        'Licensed under the Apache License 2.0.',
        'OpenRoIS is a trademark of Coarobo GK. RoIS is a trademark of the Object Management Group.',
      ].join('<br>'),
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'python', 'csharp', 'yaml'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
