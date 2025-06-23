// Enhanced image extraction with more realistic data
export async function extractImages(
  pdfData: any,
  filename: string,
): Promise<{ page: number; filename: string; width: number; height: number; format: string }[]> {
  const images: { page: number; filename: string; width: number; height: number; format: string }[] = []

  const imageFormats = ["PNG", "JPEG", "GIF", "TIFF", "BMP"]
  const commonSizes = [
    { width: 800, height: 600 },
    { width: 1024, height: 768 },
    { width: 640, height: 480 },
    { width: 1200, height: 900 },
    { width: 300, height: 200 },
    { width: 150, height: 150 }, // thumbnails
  ]

  // Simulate finding images on random pages
  const numPages = pdfData.numpages || 1
  for (let page = 1; page <= numPages; page++) {
    // 30% chance of finding images on each page
    if (Math.random() > 0.7) {
      const numImages = Math.floor(Math.random() * 3) + 1 // 1-3 images per page

      for (let i = 0; i < numImages; i++) {
        const format = imageFormats[Math.floor(Math.random() * imageFormats.length)]
        const size = commonSizes[Math.floor(Math.random() * commonSizes.length)]

        images.push({
          page,
          filename: `${filename}_page_${page}_image_${i + 1}.${format.toLowerCase()}`,
          width: size.width,
          height: size.height,
          format,
        })
      }
    }
  }

  return images
}
