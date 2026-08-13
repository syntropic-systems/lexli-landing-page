import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolPage } from '@/components/tool-page';
import { getTool, tools } from '@/data/tools';
import { getToolVisual } from '@/components/showcases';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: { canonical: `${SITE_URL}/tools/${tool.slug}` },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
    },
  };
}

export default async function ToolRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return <ToolPage tool={tool} visual={getToolVisual(tool.slug)} />;
}
