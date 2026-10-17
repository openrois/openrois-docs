/**
 * Footer of the sibling kit of openrosde.org and openrois.org.
 *
 * This file is shared word for word with the other site:
 *   https://github.com/openrosde/openrosde-docs/blob/main/src/theme/Footer/Layout/index.tsx
 *   https://github.com/openrois/openrois-docs/blob/main/src/theme/Footer/Layout/index.tsx
 * Change it in both repositories in the same way. It wraps the footer of
 * Docusaurus with a brand block, the logo at full size beside the name and
 * the tagline of the site, and takes everything else from
 * docusaurus.config.ts, so it holds nothing of either project.
 * src/css/sibling.css styles it.
 */

import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {ThemeClassNames, useThemeConfig} from '@docusaurus/theme-common';
import type {Props} from '@theme/Footer/Layout';

export default function FooterLayout({style, links, copyright}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {footer} = useThemeConfig();
  const logo = footer?.logo;
  const logoUrl = useBaseUrl(logo?.src ?? '');
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', 'sibling-footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid">
        <div className="sibling-footer__main">
          <div className="sibling-footer__brand">
            <Link to="/" className="sibling-footer__home" aria-label={`${siteConfig.title} home page`}>
              {logo && (
                <img
                  className="sibling-footer__logo"
                  src={logoUrl}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                />
              )}
            </Link>
            <div className="sibling-footer__identity">
              <Link to="/" className="sibling-footer__name">
                {siteConfig.title}
              </Link>
              <p className="sibling-footer__motto">{siteConfig.tagline}</p>
            </div>
          </div>
          {links}
        </div>
        {copyright && <div className="footer__bottom">{copyright}</div>}
      </div>
    </footer>
  );
}
