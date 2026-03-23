import { chromium } from '/Users/Charles/Coding/Projets/site-voile-club/node_modules/playwright/index.mjs'
import { createWriteStream } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const htmlPath = resolve(__dirname, 'index.html')
const totalSlides = 10

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 720 })

  await page.goto(`file://${htmlPath}`)
  await page.waitForTimeout(500)

  const screenshots = []

  for (let i = 1; i <= totalSlides; i++) {
    // Activer la slide via JS
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll('.slide')
      slides.forEach((s, j) => {
        s.style.opacity = j + 1 === idx ? '1' : '0'
        s.style.transform = j + 1 === idx ? 'translateX(0)' : 'translateX(60px)'
        s.style.pointerEvents = j + 1 === idx ? 'auto' : 'none'
      })
      const counter = document.getElementById('count')
      if (counter) counter.textContent = `${idx} / 10`
    }, i)

    await page.waitForTimeout(200)
    const buf = await page.screenshot({ type: 'png' })
    screenshots.push(buf)
    console.log(`  Slide ${i}/${totalSlides} capturée`)
  }

  await browser.close()

  // Générer un HTML multi-page print-ready et exporter en PDF
  const browser2 = await chromium.launch()
  const page2 = await browser2.newPage()
  await page2.setViewportSize({ width: 1280, height: 720 })

  // Construire un HTML avec les images en pages séparées
  const imagesBase64 = screenshots.map(buf => buf.toString('base64'))
  const printHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; }
  .page {
    width: 297mm;
    height: 210mm;
    page-break-after: always;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .page:last-child { page-break-after: avoid; }
  .page img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  @page {
    size: A4 landscape;
    margin: 0;
  }
</style>
</head>
<body>
${imagesBase64.map(b64 => `<div class="page"><img src="data:image/png;base64,${b64}" /></div>`).join('\n')}
</body>
</html>`

  await page2.setContent(printHtml, { waitUntil: 'networkidle' })

  const pdfPath = resolve(__dirname, 'voileweb-pitch.pdf')
  await page2.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  })

  await browser2.close()
  console.log(`\nPDF généré : ${pdfPath}`)
})()
