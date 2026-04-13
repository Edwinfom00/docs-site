'use client';

import Link from 'next/link';
import { Package, NavSection } from '@/lib/content';
import { useState } from 'react';

interface DocsSidebarProps {
  pkg: Package;
  version: string;
  lang: string;
  navigation: NavSection[];
  currentSlug: string;
  latestVersionDate?: string;
}

function isNew(dateStr?: string): boolean {
  if (!dateStr) return false;
  return Date.now() - new Date(dateStr).getTime() < 7 * 24 * 60 * 60 * 1000;
}

export default function DocsSidebar({ pkg, version, lang, navigation, currentSlug, latestVersionDate }: DocsSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const basePath = `/docs/${pkg.slug}/${version}/${lang}`;
  const showNewBadge = version === `v${pkg.latestVersion}` && isNew(latestVersionDate);

  return (
    <>
      <button
        id="sidebar-toggle"
        className="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>{mobileOpen ? 'Close' : 'Menu'}</span>
      </button>

      <aside className={`docs-sidebar${mobileOpen ? ' mobile-open' : ''}`} id="docs-sidebar">
        {/* Package header + version switcher */}
        <div className="sidebar-package">
          <Link href={`/docs/${pkg.slug}/${version}/${lang}/introduction`} className="package-name-link">
            <div className="package-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div className="package-display-name">{pkg.name}</div>
          </Link>

          {/* Version switcher */}
          <div className="version-switcher">
            <button
              className="version-switcher-btn"
              onClick={() => setVersionOpen(v => !v)}
              aria-expanded={versionOpen}
              aria-haspopup="listbox"
            >
              <span className="version-switcher-current">
                {version}
                {showNewBadge && <span className="version-new-badge">new</span>}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth={2}
                style={{ transform: versionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {versionOpen && (
              <>
                <div className="version-dropdown-backdrop" onClick={() => setVersionOpen(false)} />
                <ul className="version-dropdown" role="listbox" aria-label="Select version">
                  {pkg.versions.map((v) => {
                    const vLabel = v.startsWith('v') ? v : `v${v}`;
                    const isCurrent = vLabel === version;
                    const isLatest = vLabel === `v${pkg.latestVersion}`;
                    const href = `/docs/${pkg.slug}/${vLabel}/${lang}/${currentSlug}`;
                    return (
                      <li key={v} role="option" aria-selected={isCurrent}>
                        <a
                          href={href}
                          className={`version-option${isCurrent ? ' active' : ''}`}
                          onClick={() => setVersionOpen(false)}
                        >
                          <span>{vLabel}</span>
                          <span className="version-option-badges">
                            {isLatest && <span className="version-option-badge latest">latest</span>}
                            {isLatest && isNew(latestVersionDate) && (
                              <span className="version-option-badge new">new</span>
                            )}
                            {isCurrent && <span className="version-option-check">✓</span>}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Documentation navigation">
          {navigation.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              <ul className="nav-items" role="list">
                {section.items.map((item) => {
                  const href = `${basePath}/${item.slug}`;
                  const isActive = currentSlug === item.slug;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        className={`nav-link${isActive ? ' active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {item.title}
                        {showNewBadge && item.slug === 'playground' && (
                          <span className="nav-link-new-badge">new</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <a href={pkg.npm} target="_blank" rel="noopener noreferrer" className="sidebar-footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0v24h24V0H0zm19.2 19.2H12v-9.6H8.8v9.6H4.8V4.8h14.4v14.4z" />
            </svg>
            npm
          </a>
          <a href={pkg.github} target="_blank" rel="noopener noreferrer" className="sidebar-footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </aside>
    </>
  );
}
