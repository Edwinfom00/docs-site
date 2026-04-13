import { notFound, redirect } from 'next/navigation';
import { getPackage, getNavigation, getDocPage, getAllDocSlugs } from '@/lib/content';
import { markdownToHtml, extractToc } from '@/lib/mdx';
import DocsHeader from '@/components/DocsHeader';
import DocsSidebar from '@/components/DocsSidebar';
import DocContent from '@/components/DocContent';
import DocContentWithPlayground from '@/components/DocContentWithPlayground';
import TableOfContents from '@/components/TableOfContents';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    package: string;
    version: string;
    lang: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { package: packageSlug, version, lang, slug } = await params;
  const pkg = getPackage(packageSlug);
  const page = getDocPage(packageSlug, version, slug, lang);
  if (!pkg || !page) return {};
  return {
    title: `${page.title} — ${pkg.name}`,
    description: page.description || pkg.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { package: packageSlug, version, lang, slug } = await params;

  const pkg = getPackage(packageSlug);
  if (!pkg) notFound();

  const navigation = getNavigation(packageSlug, version, lang);
  const page = getDocPage(packageSlug, version, slug, lang);

  if (!page) {
    const slugs = getAllDocSlugs(packageSlug, version, lang);
    if (slugs.includes('introduction')) {
      redirect(`/docs/${packageSlug}/${version}/${lang}/introduction`);
    }
    notFound();
  }

  const html = await markdownToHtml(page.content);
  const toc = extractToc(page.content);

  const allItems = navigation.flatMap(s => s.items);
  const currentIndex = allItems.findIndex(item => item.slug === slug);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
  const basePath = `/docs/${packageSlug}/${version}/${lang}`;

  const hasPlayground = /<\s*SmokePlayground\s*\/?\s*>/i.test(html) || /<\s*smokeplayground/i.test(html);
  const ContentComponent = hasPlayground ? DocContentWithPlayground : DocContent;

  return (
    <>
      <DocsHeader lang={lang} packageSlug={packageSlug} version={version} slug={slug} />
      <div className="docs-page-wrapper">
        <div className="docs-layout">
          <DocsSidebar
            pkg={pkg}
            version={version}
            lang={lang}
            navigation={navigation}
            currentSlug={slug}
            latestVersionDate={pkg.latestVersionDate}
          />
          <div className="docs-main">
            <ContentComponent
              html={html}
              title={page.title}
              description={page.description}
              prevPage={prevItem ? { title: prevItem.title, href: `${basePath}/${prevItem.slug}` } : null}
              nextPage={nextItem ? { title: nextItem.title, href: `${basePath}/${nextItem.slug}` } : null}
            />
            <TableOfContents toc={toc} />
          </div>
        </div>
      </div>
    </>
  );
}
