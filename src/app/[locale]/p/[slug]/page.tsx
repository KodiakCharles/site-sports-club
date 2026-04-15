import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const pageBuilder = await payload.findGlobal({ slug: 'page-builder' }).catch(() => null)
  const pb = pageBuilder as Record<string, unknown> | null
  const pages = (pb?.pages as Record<string, unknown>[]) || []
  const page = pages.find(p => p.slug === slug && p.published)
  if (!page) return {}
  return generatePageMetadata({
    title: page.title as string,
    description: '',
    path: `/p/${slug}`,
    locale,
  })
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const pageBuilder = await payload.findGlobal({ slug: 'page-builder' }).catch(() => null)
  const pb = pageBuilder as Record<string, unknown> | null
  const pages = (pb?.pages as Record<string, unknown>[]) || []
  const page = pages.find(p => p.slug === slug && p.published)

  if (!page) notFound()

  const blocks = (page.blocks as { blockType: string; [key: string]: unknown }[]) || []

  return (
    <div>
      <BlockRenderer blocks={blocks} />
    </div>
  )
}
