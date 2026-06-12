import { recognize } from 'tesseract.js'

export type OcrProgress = {
  fileName: string
  status: string
  progress: number
}

export async function runOcrForImages(
  files: File[],
  onProgress: (progress: OcrProgress) => void,
) {
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
