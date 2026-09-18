import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js. Do not use client-side code here (browser APIs, JSX).

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['getting-started/quickstart', 'getting-started/installation'],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        'concepts/rois-overview',
        'concepts/architecture',
        'concepts/design-principles',
        'concepts/recursive-engine',
        'concepts/component-contract',
        'concepts/type-pipeline',
        'concepts/transports-and-media',
        'concepts/deployment-topologies',
        'concepts/security',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: ['guides/service-application', 'guides/components-and-adapters'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: ['reference/wire-protocol', 'reference/components', 'reference/sdks'],
    },
    {
      type: 'category',
      label: 'Project',
      collapsed: false,
      items: [
        'project/roadmap',
        'project/related-work',
        'project/contributing',
        'project/citing',
      ],
    },
  ],
};

export default sidebars;
