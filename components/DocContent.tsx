'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface DocContentProps {
  html: string;
  title: string;
  description?: string;
  prevPage?: { title: string; href: string } | null;
  nextPage?: { title: string; href: string } | null;
}

export default function DocContent({ html, title, description, prevPage, nextPage }: DocContentProps) {
  useEffect(() => {
    // Add copy buttons to code blocks
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

    // Also handle plain pre blocks
    const prosePreBlocks = document.querySelectorAll('.prose > pre');
    prosePreBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-button')) return;
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'copy-button';
      btn.textContent = 'Copy';
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent || '';
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
      wrapper.appendChild(btn);
    });
  }, [html]);

  return (
    <div className="doc-content-wrapper">
      {/* Page description */}
      {description && (
        <p className="doc-description">{description}</p>
      )}

      {/* Content */}
      <div
        className="prose page-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Prev/Next navigation */}
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
