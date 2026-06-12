import { useCallback, useEffect, useRef, useState } from 'react'

export type ImagePreview = {
  id: string
  file: File
  url: string
}

/**
 * Gère une liste d'aperçus d'images basés sur des object URLs.
 * Révoque systématiquement les URLs (au vidage ET au démontage) pour éviter
 * la fuite mémoire présente dans la V1 où l'unmount ne nettoyait rien.
 */
export function useImagePreviews() {
  const [previews, setPreviews] = useState<ImagePreview[]>([])
  const previewsRef = useRef(previews)
  previewsRef.current = previews

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const next = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
      }))
    setPreviews((current) => [...current, ...next])
  }, [])

  const clear = useCallback(() => {
    setPreviews((current) => {
      current.forEach((preview) => URL.revokeObjectURL(preview.url))
      return []
    })
  }, [])

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [])

  return { previews, addFiles, clear }
}
