import Link from 'next/link';
import { getAllPackages } from '@/lib/content';
import DocsHeader from '@/components/DocsHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edwin Packages — Documentation',
  description: 'Official documentation for open-source packages by Edwin Fom',
};

export default function HomePage() {
  const packages = getAllPackages();

  return (
    <>
      <DocsHeader />
      <main className="home-page">
        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-dot" />
            Open Source Packages
          </div>
          <h1 className="hero-title">
            Build with<br />
            <span className="hero-gradient">confidence</span>
          </h1>
          <p className="hero-subtitle">
            Production-ready TypeScript packages for modern applications.
            Security, reliability, and developer experience — first-class.
          </p>
          <div className="hero-actions">
            {packages[0] && (
              <Link
                href={`/docs/${packages[0].slug}/v${packages[0].latestVersion}/introduction`}
                className="btn-primary"
                id="get-started-btn"
              >
                Get Started →
              </Link>
            )}
            <a
              href="https://github.com/Edwinfom00"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              id="github-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
              GitHub
            </a>
          </div>
        </section>

        {/* Packages grid */}
        <section className="packages-section">
          <div className="section-header">
            <h2 className="section-title">Packages</h2>
            <p className="section-subtitle">
              {packages.length} package{packages.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="packages-grid">
            {packages.map((pkg) => (
              <Link
                key={pkg.slug}
                href={`/docs/${pkg.slug}/v${pkg.latestVersion}/en/introduction`}
                className="package-card"
                id={`package-${pkg.slug}`}
              >
                <div className="card-header">
                  <div className="card-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <span className="card-version">v{pkg.latestVersion}</span>
                </div>
                <div className="card-name">{pkg.name}</div>
                <p className="card-description">{pkg.description}</p>
                <div className="card-tags">
                  {pkg.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="card-footer">
                  <span className="card-meta">{pkg.license}</span>
                  <span className="card-meta">by {pkg.author}</span>
                  <span className="card-arrow">→</span>
                </div>
              </Link>
            ))}

            {/* Coming soon card */}
            <div className="package-card coming-soon">
              <div className="card-header">
                <div className="card-icon card-icon-muted">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <span className="card-version card-version-muted">soon</span>
              </div>
              <div className="card-name card-name-muted">More packages</div>
              <p className="card-description card-desc-muted">
                Additional packages are under development. Watch the GitHub repository for announcements.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
