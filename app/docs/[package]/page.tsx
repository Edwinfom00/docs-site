import { redirect } from 'next/navigation';
import { getPackage, getFirstDocSlug } from '@/lib/content';

interface PageProps {
  params: Promise<{ package: string }>;
}

export default async function DocsPackageIndexPage({ params }: PageProps) {
  const { package: packageSlug } = await params;
  const pkg = getPackage(packageSlug);

  if (!pkg) {
    redirect('/');
  }

  const firstSlug = getFirstDocSlug(packageSlug, pkg.latestVersion);
  redirect(`/docs/${packageSlug}/${pkg.latestVersion}/en/${firstSlug}`);
}
