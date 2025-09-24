"use client"

import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef } from "react"

export function AvatarUpload({
  label = "Avatar",
  id = "avatar",
  value,
  onChange,
  error,
}: {
  label?: string
  id?: string
  value: string | null
  onChange: (file: File | null) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-4 rounded-xl border bg-background/80 p-3 backdrop-blur-sm transition",
          error ? "border-red-300 bg-red-50" : "border-gray-200",
        )}
      >
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-muted">
          {value ? (
            <img src={value || "/placeholder.svg"} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p className="text-foreground">Upload a new image</p>
            <p className="text-xs">PNG or JPG up to 2MB</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-rose-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-rose-50"
            >
              Choose File
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50"
              >
                Remove
              </button>
            ) : null}
          </div>
          <input
            id={id}
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              onChange(file ?? null)
            }}
          />
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
