import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionPage } from '@/components/solution-page';
import { getSolution, solutionPages } from '@/data/solutions';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return solutionPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSolution(slug);
  if (!page) return {};

  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `${SITE_URL}/solutions/${page.slug}` },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${SITE_URL}/solutions/${page.slug}`,
    },
  };
}

export default async function SolutionRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSolution(slug);
  if (!page) notFound();

  return <SolutionPage page={page} />;
}
