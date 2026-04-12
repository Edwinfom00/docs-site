'use client';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  if (toc.length === 0) return null;

  return (
    <aside className="toc-aside">
      <div className="toc-title">On This Page</div>
      <nav aria-label="Table of contents">
        <ul className="toc-list">
          {toc.map((item) => (
            <li key={item.id} className={`toc-item toc-level-${item.level}`}>
              <a href={`#${item.id}`} className="toc-link">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
