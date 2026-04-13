import fs from 'fs';
import path from 'path';

export interface Package {
  name: string;
  slug: string;
  description: string;
  version: string;
  versions: string[];
  latestVersion: string;
  latestVersionDate?: string;
  npm: string;
  github: string;
  license: string;
  author: string;
  color: string;
  icon: string;
  tags: string[];
}

export interface NavItem {
  title: string;
  slug: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface DocPage {
  title: string;
  description: string;
  content: string;
  slug: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getAllPackages(): Package[] {
  const packagesDir = path.join(CONTENT_DIR, 'packages');
  if (!fs.existsSync(packagesDir)) return [];
  
  const packageDirs = fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  return packageDirs.map(slug => {
    const metaPath = path.join(packagesDir, slug, 'meta.json');
    if (!fs.existsSync(metaPath)) return null;
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    return { ...meta, slug };
  }).filter(Boolean) as Package[];
}

export function getPackage(slug: string): Package | null {
  const metaPath = path.join(CONTENT_DIR, 'packages', slug, 'meta.json');
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
}

export function getNavigation(packageSlug: string, version: string, lang: string = 'en'): NavSection[] {
  let navPath = path.join(CONTENT_DIR, 'packages', packageSlug, version, lang, 'nav.json');
  if (!fs.existsSync(navPath) && lang !== 'en') {
    navPath = path.join(CONTENT_DIR, 'packages', packageSlug, version, 'nav.json');
  } else if (!fs.existsSync(navPath) && lang === 'en') {
    navPath = path.join(CONTENT_DIR, 'packages', packageSlug, version, 'nav.json');
  }
  
  if (!fs.existsSync(navPath)) return [];
  return JSON.parse(fs.readFileSync(navPath, 'utf-8'));
}

export function getDocPage(packageSlug: string, version: string, pageSlug: string, lang: string = 'en'): DocPage | null {
  let filePath = path.join(CONTENT_DIR, 'packages', packageSlug, version, lang, `${pageSlug}.mdx`);
  if (!fs.existsSync(filePath) && lang !== 'en') {
    filePath = path.join(CONTENT_DIR, 'packages', packageSlug, version, `${pageSlug}.mdx`);
  } else if (!fs.existsSync(filePath) && lang === 'en') {
    filePath = path.join(CONTENT_DIR, 'packages', packageSlug, version, `${pageSlug}.mdx`);
  }
  
  if (!fs.existsSync(filePath)) return null;
  
  const raw = fs.readFileSync(filePath, 'utf-8');
  
  // Parse frontmatter
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { title: pageSlug, description: '', content: raw, slug: pageSlug };
  }
  
  const frontmatterStr = frontmatterMatch[1];
  const content = frontmatterMatch[2];
  
  const titleMatch = frontmatterStr.match(/^title:\s*(.+)$/m);
  const descriptionMatch = frontmatterStr.match(/^description:\s*(.+)$/m);
  
  return {
    title: titleMatch ? titleMatch[1] : pageSlug,
    description: descriptionMatch ? descriptionMatch[1] : '',
    content,
    slug: pageSlug,
  };
}

export function getAllDocSlugs(packageSlug: string, version: string, lang: string = 'en'): string[] {
  let versionDir = path.join(CONTENT_DIR, 'packages', packageSlug, version, lang);
  if (!fs.existsSync(versionDir) && lang !== 'en') {
    versionDir = path.join(CONTENT_DIR, 'packages', packageSlug, version);
  } else if (!fs.existsSync(versionDir) && lang === 'en') {
    versionDir = path.join(CONTENT_DIR, 'packages', packageSlug, version);
  }
  
  if (!fs.existsSync(versionDir)) return [];
  
  return fs.readdirSync(versionDir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''));
}

export function getFirstDocSlug(packageSlug: string, version: string, lang: string = 'en'): string {
  const nav = getNavigation(packageSlug, version, lang);
  if (nav.length > 0 && nav[0].items.length > 0) {
    return nav[0].items[0].slug;
  }
  const slugs = getAllDocSlugs(packageSlug, version, lang);
  return slugs[0] || 'introduction';
}
