import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Kean Teng Docs',
  tagline: 'Learning documentation from work and personal projects',
  favicon: 'img/favicon.png',

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexPages: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://keanteng.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs-migrate/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'keanteng', // Usually your GitHub org/user name.
  projectName: 'docs-migrate', // Usually your repo name.

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'style',
      attributes: {},
      innerHTML: `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-gadget { color: transparent !important; }
        body { top: 0px !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
      `,
    },
  ],

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
          showLastUpdateTime: true,
          editUrl:
            'https://github.com/keanteng/docs-migrate/tree/main/',
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
    image: 'img/favicon.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kean Teng Docs',
      items: [
        {
          href: 'https://github.com/keanteng/docs-migrate',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Sections',
          items: [
            { label: 'Development Environment', to: '/docs/development-environment/wsl' },
            { label: 'Version Control (Git)', to: '/docs/version-control/git' },
            { label: 'Cloud & DevOps', to: '/docs/cloud-devops/aws-cli' },
            { label: 'Docker', to: '/docs/cloud-devops/docker' },
            { label: 'Other Tools', to: '/docs/other-tools/others' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/keanteng/docs-migrate' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Khor Kean Teng. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['powershell', 'bash', 'docker', 'yaml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
