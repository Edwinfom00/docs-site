import { redirect } from 'next/navigation';
import { getPackage, getFirstDocSlug } from '@/lib/content';

interface PageProps {
  params: Promise<{ package: string; version: string }>;
}

export default async function DocsVersionIndexPage({ params }: PageProps) {
  const { package: packageSlug, version } = await params;
  const pkg = getPackage(packageSlug);
  
  if (!pkg) {
    redirect('/');
  }

  const firstSlug = getFirstDocSlug(packageSlug, version);
  redirect(`/docs/${packageSlug}/${version}/en/${firstSlug}`);
}
