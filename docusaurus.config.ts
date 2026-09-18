import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js. Do not use client-side code here (browser APIs, JSX).

const GITHUB_ORG = 'https://github.com/openrois';
const GITHUB_REPO = 'https://github.com/openrois/openrois';
// The arXiv abstract URL of the paper. Empty until the preprint is announced
// (submitted 2026-09-17 as arXiv:submit/8095926). Keep in sync with src/pages/index.tsx.
const PAPER_URL = '';
const ROIS_SPEC = 'https://www.omg.org/spec/RoIS/2.0';

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
    'Open-source middleware implementing the OMG Robotic Interaction Service (RoIS) Framework 2.0',
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
          'Open-source middleware implementing the OMG Robotic Interaction Service (RoIS) Framework 2.0.',
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
          customCss: './src/css/custom.css',
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

  themeConfig: {
    image: 'img/openrois-social-card.jpg',
    metadata: [
      {
        name: 'keywords',
        content:
          'OpenRoIS, RoIS, Robotic Interaction Service, OMG, human-robot interaction, HRI, middleware, ROS 2, Unity, JSON-RPC, WebSocket, open source',
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
        {to: '/docs/getting-started/quickstart', label: 'Quickstart', position: 'left'},
        {to: '/docs/reference/wire-protocol', label: 'Protocol', position: 'left'},
        {to: '/docs/project/roadmap', label: 'Roadmap', position: 'left'},
        ...(PAPER_URL ? [{href: PAPER_URL, label: 'arXiv Preprint', position: 'right' as const}] : []),
        {
          href: ROIS_SPEC,
          label: 'RoIS Specification',
          position: 'right',
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
        width: 36,
        height: 36,
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Quickstart', to: '/docs/getting-started/quickstart'},
            {label: 'Architecture', to: '/docs/concepts/architecture'},
            {label: 'Wire Protocol', to: '/docs/reference/wire-protocol'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'Roadmap', to: '/docs/project/roadmap'},
            {label: 'Related Work', to: '/docs/project/related-work'},
            {label: 'Citing OpenRoIS', to: '/docs/project/citing'},
            {label: 'Contributing', to: '/docs/project/contributing'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'OpenRoIS GitHub Organization', href: GITHUB_ORG},
            {label: 'Issues', href: `${GITHUB_REPO}/issues`},
            ...(PAPER_URL ? [{label: 'OpenRoIS arXiv Preprint', href: PAPER_URL}] : []),
            {label: 'OMG RoIS Specification', href: ROIS_SPEC},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Coarobo GK. Developed by Coarobo GK and the OpenRoIS community under the Apache License 2.0.<br>OpenRoIS is a trademark of Coarobo GK. RoIS is a trademark of the Object Management Group.`,
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
