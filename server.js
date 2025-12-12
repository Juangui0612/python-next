import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '10000', 10)
const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('Starting server...')
console.log(`Port: ${port}`)
console.log(`Hostname: ${hostname}`)
console.log(`Environment: ${dev ? 'development' : 'production'}`)

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`✓ Server ready on http://${hostname}:${port}`)
    })
})