import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  category: z
    .enum(['competition', 'stages', 'vie-du-club', 'distinctions', 'partenariat'])
    .optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10),
  coverImageUrl: z.string().url().optional(),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  publishedAt: z.string().datetime().optional(),
})

async function authenticateApiKey(req: NextRequest) {
  const apiKey =
    req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '')
  if (!apiKey) return null

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'club-settings' })
  const s = settings as Record<string, unknown>

  if (!s.apiEnabled) return null
  if (s.apiKey !== apiKey) return null

  return { payload, settings: s }
}

// GET /api/articles — List published articles
export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req)
  if (!auth)
    return NextResponse.json(
      { error: 'Unauthorized. Provide a valid x-api-key header.' },
      { status: 401 },
    )

  const { payload } = auth
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const category = req.nextUrl.searchParams.get('category')

  const where = { status: { equals: 'published' }, ...(category ? { category: { equals: category } } : {}) }
  const { docs, totalDocs, totalPages } = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit,
    page,
  })

  return NextResponse.json({
    articles: docs.map((d: Record<string, unknown>) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      category: d.category,
      excerpt: d.excerpt,
      status: d.status,
      publishedAt: d.publishedAt,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
    pagination: { total: totalDocs, totalPages, page, limit },
  })
}

// POST /api/articles — Create a new article
export async function POST(req: NextRequest) {
  const auth = await authenticateApiKey(req)
  if (!auth)
    return NextResponse.json(
      { error: 'Unauthorized. Provide a valid x-api-key header.' },
      { status: 401 },
    )

  const { payload } = auth

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data

  try {
    // Check if slug already exists
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: `Article with slug "${data.slug}" already exists` },
        { status: 409 },
      )
    }

    const article = await payload.create({
      collection: 'posts',
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        status: data.status,
        publishedAt:
          data.publishedAt || (data.status === 'published' ? new Date().toISOString() : undefined),
      },
    })

    return NextResponse.json(
      {
        success: true,
        article: {
          id: article.id,
          title: (article as Record<string, unknown>).title,
          slug: (article as Record<string, unknown>).slug,
          status: (article as Record<string, unknown>).status,
        },
      },
      { status: 201 },
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to create article', details: String(err) },
      { status: 500 },
    )
  }
}

// OPTIONS /api/articles — CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
