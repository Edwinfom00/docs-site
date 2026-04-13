'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import SmokePlayground from './SmokePlayground';

interface DocContentWithPlaygroundProps {
  html: string;
  title: string;
  description?: string;
  prevPage?: { title: string; href: string } | null;
  nextPage?: { title: string; href: string } | null;
}

// Split the HTML around the <SmokePlayground /> tag so we can inject the React component
function splitHtml(html: string): { before: string; after: string } {
  // The unified pipeline will render <SmokePlayground /> as-is (unknown tag)
  const marker = /<\s*SmokePlayground\s*\/?\s*>/i;
  const idx = html.search(marker);
  if (idx === -1) return { before: html, after: '' };
  const match = html.match(marker)!;
  return {
    before: html.slice(0, idx),
    after: html.slice(idx + match[0].length),
  };
}

export default function DocContentWithPlayground({
  html,
  title,
  description,
  prevPage,
  nextPage,
}: DocContentWithPlaygroundProps) {
  useEffect(() => {
    const figures = document.querySelectorAll('[data-rehype-pretty-code-figure]');
    figures.forEach((figure) => {
      if (figure.querySelector('.copy-button')) return;
      const pre = figure.querySelector('pre');
      if (!pre) return;
      const btn = document.createElement('button');
      btn.className = 'copy-button';
      btn.textContent = 'Copy';
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent || '';
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
      (figure as HTMLElement).style.position = 'relative';
      figure.appendChild(btn);
    });
  }, [html]);

  const { before, after } = splitHtml(html);

  return (
    <div className="doc-content-wrapper">
      {description && <p className="doc-description">{description}</p>}

      <div className="prose page-content">
        <div dangerouslySetInnerHTML={{ __html: before }} />
        <SmokePlayground />
        {after && <div dangerouslySetInnerHTML={{ __html: after }} />}
      </div>

      {(prevPage || nextPage) && (
        <nav className="doc-pagination" aria-label="Pagination">
          <div className="pagination-inner">
            {prevPage ? (
              <a href={prevPage.href} className="pagination-link pagination-prev">
                <span className="pagination-direction">← Previous</span>
                <span className="pagination-title">{prevPage.title}</span>
              </a>
            ) : <div />}
            {nextPage ? (
              <a href={nextPage.href} className="pagination-link pagination-next">
                <span className="pagination-direction">Next →</span>
                <span className="pagination-title">{nextPage.title}</span>
              </a>
            ) : <div />}
          </div>
        </nav>
      )}
    </div>
  );
}
