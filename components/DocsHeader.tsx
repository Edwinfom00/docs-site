import Link from 'next/link';
import { getAllPackages } from '@/lib/content';
import SearchModal from './SearchModal';

interface DocsHeaderProps {
  lang?: string;
  packageSlug?: string;
  version?: string;
  slug?: string;
}

export default function DocsHeader({ lang = 'en', packageSlug, version, slug }: DocsHeaderProps = {}) {
  const packages = getAllPackages();

  return (
    <header className="docs-header">
      <div className="header-inner">
        {/* Logo */}
        <Link href="/" className="header-logo">
          <div className="logo-mark">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="logo-text">edwinfom</span>
          <span className="logo-separator">/</span>
          <span className="logo-packages">packages</span>
        </Link>

        {/* Center nav — packages */}
        <nav className="header-nav" aria-label="Package navigation">
          {packages.map((pkg) => (
            <Link
              key={pkg.slug}
              href={`/docs/${pkg.slug}/v${pkg.latestVersion}/${lang}/introduction`}
              className="header-nav-link"
            >
              {pkg.name}
            </Link>
          ))}
        </nav>

        {/* Search bar (client component) */}
        <SearchModal lang={lang} />

        {/* Right actions */}
        <div className="header-actions">
          {packageSlug && version && slug && (
            <Link
              href={`/docs/${packageSlug}/${version}/${lang === 'fr' ? 'en' : 'fr'}/${slug}`}
              className="header-lang-switch"
              style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}
              aria-label="Switch Language"
            >
              {lang === 'fr' ? (
                // 🇺🇸 United States Flag
                <svg width="20" height="14" viewBox="0 0 7410 3900">
                  <rect width="7410" height="3900" fill="#b22234" />
                  <g fill="#fff">
                    {[...Array(6)].map((_, i) => (
                      <rect key={i} y={(i * 2 + 1) * 300} width="7410" height="300" />
                    ))}
                  </g>
                  <rect width="2964" height="2100" fill="#3c3b6e" />
                </svg>
              ) : (
                // 🇫🇷 France Flag
                <svg width="20" height="14" viewBox="0 0 3 2">
                  <rect width="1" height="2" x="0" fill="#0055A4" />
                  <rect width="1" height="2" x="1" fill="#ffffff" />
                  <rect width="1" height="2" x="2" fill="#EF4135" />
                </svg>
              )}
            </Link>
          )}
          <a
            href="https://github.com/Edwinfom00/ai-guard"
            target="_blank"
            rel="noopener noreferrer"
            className="header-action-btn"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://www.npmjs.com/package/@edwinfom/ai-guard"
            target="_blank"
            rel="noopener noreferrer"
            className="header-action-btn"
            aria-label="npm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0v24h24V0H0zm19.2 19.2H12v-9.6H8.8v9.6H4.8V4.8h14.4v14.4z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
