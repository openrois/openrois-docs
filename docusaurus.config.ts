import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenRoIS',
  tagline: 'Open-source middleware for the OMG RoIS Framework 2.0',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here (custom domain)
  url: 'https://openrois.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // Custom domain serves from root, so baseUrl is '/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'openrois', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  // GitHub Pages adds a trailing slash by default. Set explicitly to avoid issues.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Enable mermaid diagrams
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/openrois/openrois-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/openrois-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenRoIS',
      logo: {
        alt: 'OpenRoIS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'White Paper',
        },
        {
          href: 'https://github.com/openrois/openrois',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'White Paper',
          items: [
            {
              label: 'Introduction',
              to: '/docs/White%20Paper/introduction',
            },
            {
              label: 'Architecture',
              to: '/docs/White%20Paper/layered-architecture',
            },
            {
              label: 'Wire Protocol',
              to: '/docs/White%20Paper/wire-protocol',
            },
            {
              label: 'Deployment Topologies',
              to: '/docs/White%20Paper/deployment-topologies',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/openrois/openrois',
            },
            {
              label: 'OMG RoIS Spec',
              href: 'https://www.omg.org/spec/RoIS/2.0/Beta2',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Coarobo GK. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
