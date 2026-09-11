import { useEffect, useRef, useState } from 'react'
import { Search, Loader2, Clapperboard } from 'lucide-react'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import MediaCard from './MediaCard'
import { api, mediaTypeOf } from '@/lib/tmdb'

const DEBOUNCE_MS = 450

export default function SearchOverlay({ open, onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 60)
    } else {
      document.body.style.overflow = ''
    }
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    setTouched(true)
    const t = setTimeout(() => {
      api
        .search(q)
        .then((res) =>
          setResults((res.results || []).filter((r) => r.media_type !== 'person' && r.poster_path)),
        )
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query])

  if (!open) return null

  const showEmpty = touched && !loading && query.trim().length >= 2 && results.length === 0

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 overflow-y-auto bg-base-deep/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="جست‌وجو"
    >
      <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-20 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Field>
            <FieldLabel htmlFor="movie-search">جست‌وجوی فیلم و سریال</FieldLabel>
            <div className="relative">
              <Search className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-accent-soft" />
              <Input
                ref={inputRef}
                id="movie-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="نام فیلم، سریال یا انیمیشن..."
                className="pe-12 text-lg"
                autoComplete="off"
              />
            </div>
            {query.trim().length < 2 ? (
              <FieldDescription>
                حداقل ۲ حرف بنویسید؛ نتیجه‌ها از پایگاه داده TMDB دریافت می‌شوند.
              </FieldDescription>
            ) : null}
          </Field>
        </div>

        {loading && (
          <div className="mt-14 flex justify-center">
            <Loader2 className="size-9 animate-spin text-accent-soft" />
          </div>
        )}

        {showEmpty && (
          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <Clapperboard className="size-12 text-accent/60" />
            <p className="text-lg font-bold text-ink-dim">
              چیزی برای «{query.trim()}» پیدا نشد.
            </p>
            <p className="text-sm text-ink-dim/60">
              املای نام را بررسی کنید یا عبارت دیگری امتحان کنید.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 grid grid-cols-2 justify-items-center gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((r) => (
              <MediaCard
                key={`${mediaTypeOf(r)}-${r.id}`}
                item={r}
                className="w-full"
                onSelect={(it) => {
                  onClose()
                  onSelect?.(it)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="fixed end-5 top-5 grid size-11 place-items-center rounded-full border border-accent/50 bg-base/70 text-xl font-black text-ink backdrop-blur transition-all hover:bg-accent hover:text-white"
        aria-label="بستن جست‌وجو"
      >
        ✕
      </button>
    </div>
  )
}
