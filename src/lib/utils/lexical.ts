/**
 * Convertisseur Lexical JSON → HTML
 * Compatible avec le format de sortie de @payloadcms/richtext-lexical
 */

type LexicalNode = {
  type: string
  version?: number
  // text node
  text?: string
  format?: number
  // element node
  children?: LexicalNode[]
  tag?: string          // heading: 'h1'–'h6'
  listType?: string     // list: 'bullet' | 'number' | 'check'
  value?: number        // listitem: numéro
  checked?: boolean
  // link node
  url?: string
  newTab?: boolean
  // upload node
  mimeType?: string
  url_upload?: string
  alt?: string
  width?: number
  height?: number
  // indent
  indent?: number
}

type LexicalRoot = {
  root: LexicalNode
}

// Flags de formatage du texte Lexical
const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_STRIKETHROUGH = 4
const FORMAT_UNDERLINE = 8
const FORMAT_CODE = 16
const FORMAT_SUBSCRIPT = 32
const FORMAT_SUPERSCRIPT = 64

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function convertText(node: LexicalNode): string {
  let html = escapeHtml(node.text ?? '')
  const fmt = node.format ?? 0

  if (fmt & FORMAT_CODE) html = `<code>${html}</code>`
  if (fmt & FORMAT_BOLD) html = `<strong>${html}</strong>`
  if (fmt & FORMAT_ITALIC) html = `<em>${html}</em>`
  if (fmt & FORMAT_STRIKETHROUGH) html = `<s>${html}</s>`
  if (fmt & FORMAT_UNDERLINE) html = `<u>${html}</u>`
  if (fmt & FORMAT_SUBSCRIPT) html = `<sub>${html}</sub>`
  if (fmt & FORMAT_SUPERSCRIPT) html = `<sup>${html}</sup>`

  return html
}

function convertChildren(nodes: LexicalNode[]): string {
  return nodes.map(convertNode).join('')
}

function convertNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text':
      return convertText(node)

    case 'linebreak':
      return '<br>'

    case 'paragraph': {
      const inner = convertChildren(node.children ?? [])
      return inner ? `<p>${inner}</p>\n` : '<br>\n'
    }

    case 'heading': {
      const tag = node.tag ?? 'h2'
      return `<${tag}>${convertChildren(node.children ?? [])}</${tag}>\n`
    }

    case 'quote':
      return `<blockquote>${convertChildren(node.children ?? [])}</blockquote>\n`

    case 'horizontalrule':
      return '<hr>\n'

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${convertChildren(node.children ?? [])}</${tag}>\n`
    }

    case 'listitem': {
      const inner = convertChildren(node.children ?? [])
      return `<li>${inner}</li>\n`
    }

    case 'link': {
      const href = escapeHtml(node.url ?? '#')
      const target = node.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${target}>${convertChildren(node.children ?? [])}</a>`
    }

    case 'autolink': {
      const href = escapeHtml(node.url ?? '#')
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${convertChildren(node.children ?? [])}</a>`
    }

    case 'upload': {
      if (node.mimeType?.startsWith('image/') && node.url_upload) {
        const src = escapeHtml(node.url_upload)
        const alt = escapeHtml(node.alt ?? '')
        const width = node.width ? ` width="${node.width}"` : ''
        const height = node.height ? ` height="${node.height}"` : ''
        return `<figure><img src="${src}" alt="${alt}"${width}${height} loading="lazy"></figure>\n`
      }
      return ''
    }

    case 'code':
      return `<pre><code>${convertChildren(node.children ?? [])}</code></pre>\n`

    case 'root':
      return convertChildren(node.children ?? [])

    default:
      // Nodes inconnus : on tente de rendre les enfants
      return convertChildren(node.children ?? [])
  }
}

/**
 * Convertit le JSON Lexical (stocké par Payload CMS) en HTML.
 * Retourne une chaîne vide si le contenu est absent ou invalide.
 */
export function convertLexicalToHTML(content: unknown): string {
  if (!content || typeof content !== 'object') return ''

  try {
    const lexical = content as LexicalRoot
    if (!lexical.root) return ''
    return convertNode(lexical.root).trim()
  } catch {
    return ''
  }
}
