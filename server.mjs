import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const port = Number(process.env.PORT) || 4173

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function resolveFile(urlPath) {
  const pathname = decodeURIComponent((urlPath ?? '/').split('?')[0])
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '')
  const resolved = join(distDir, relative)
  const root = distDir.replace(/\\/g, '/')
  const normalized = resolved.replace(/\\/g, '/')
  if (!normalized.startsWith(root)) return join(distDir, 'index.html')
  return resolved
}

createServer(async (req, res) => {
  try {
    let filePath = resolveFile(req.url)
    let body
    try {
      body = await readFile(filePath)
    } catch {
      filePath = join(distDir, 'index.html')
      body = await readFile(filePath)
    }
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
    })
    res.end(body)
  } catch (err) {
    console.error(err)
    res.writeHead(500)
    res.end('Internal Server Error')
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Serving dist on http://0.0.0.0:${port}`)
})
