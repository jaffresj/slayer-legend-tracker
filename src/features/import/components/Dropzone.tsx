import { ImageIcon, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { cx } from '@/lib/classes'
import type { ImagePreview } from '../hooks/useImagePreviews'

type DropzoneProps = {
  previews: ImagePreview[]
  onAddFiles: (files: FileList | File[]) => void
  onClear: () => void
  progress?: string
}

export function Dropzone({ previews, onAddFiles, onClear, progress }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          onAddFiles(event.dataTransfer.files)
        }}
        className={cx(
          'flex min-h-56 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6 text-center transition',
          isDragging ? 'border-amber-400/60 bg-amber-400/5' : 'border-slate-700 bg-slate-950/55',
        )}
      >
        <UploadCloud className="text-amber-200" size={34} aria-hidden />
        <div>
          <p className="font-semibold text-slate-100">Déposer les images</p>
          <p className="mt-1 text-sm text-slate-500">PNG, JPG ou WebP</p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-amber-400/45 hover:text-amber-100 focus-within:ring-2 focus-within:ring-amber-300/60">
          <ImageIcon size={18} aria-hidden />
          Choisir des fichiers
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files) onAddFiles(event.target.files)
              event.target.value = ''
            }}
          />
        </label>
      </div>

      {previews.length ? (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">{previews.length} image(s)</p>
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-medium text-slate-400 transition hover:text-rose-200"
            >
              Vider
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {previews.map((preview) => (
              <figure
                key={preview.id}
                className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
              >
                <img
                  src={preview.url}
                  alt={preview.file.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="truncate px-3 py-2 text-xs text-slate-400">
                  {preview.file.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}

      {progress ? <p className="mt-4 text-sm text-amber-200">{progress}</p> : null}
    </div>
  )
}
