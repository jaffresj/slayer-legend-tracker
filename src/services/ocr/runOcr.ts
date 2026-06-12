export type OcrProgress = {
  fileName: string
  status: string
  progress: number
}

/**
 * Lance l'OCR sur une série d'images.
 *
 * Tesseract.js (~600 kB + WASM + modèles de langue) est importé
 * dynamiquement ici : il ne fait donc PAS partie du bundle initial et n'est
 * téléchargé que lorsque l'utilisateur lance réellement une reconnaissance.
 */
export async function runOcrForImages(
  files: File[],
  onProgress: (progress: OcrProgress) => void,
): Promise<string> {
  const { recognize } = await import('tesseract.js')
  const results: string[] = []

  for (const file of files) {
    const result = await recognize(file, 'fra+eng', {
      logger: (message) => {
        onProgress({
          fileName: file.name,
          status: message.status,
          progress: Math.round((message.progress ?? 0) * 100),
        })
      },
    })
    results.push(result.data.text)
  }

  return results.join('\n\n')
}
