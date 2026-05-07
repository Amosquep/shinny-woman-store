import fs from "fs"
import pdfPoppler from "pdf-poppler"

const pdfFile = "./shinny.pdf"
const outputDir = "./public/product-images"

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const options = {
  format: "jpeg",
  out_dir: outputDir,
  out_prefix: "page",
  page: null,
}

pdfPoppler
  .convert(pdfFile, options)
  .then(() => {
    console.log("✅ Imágenes extraídas correctamente")
  })
  .catch((error) => {
    console.error(error)
  })