import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'

/**
 * Namava-style horizontal carousel row with edge arrow buttons.
 * RTL-aware: content starts at the right edge.
 */
export default function MediaRow({ title, icon, fetcher, onSelect, id }) {
  const scroller = useRef(null)
  const { data, loading, error } = useRow(fetcher)
  const items = (data?.results || []).filter((it) => it.poster_path)

  const scrollByAmount = (dir) => {
    const el = scroller.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    // In RTL a negative `left` scrolls toward later items (visually leftward)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section id={id} className="scroll-mt-24 py-5">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-3.5 flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-black text-ink sm:text-2xl">{title}</h2>
          <ChevronLeft className="mt-0.5 size-5 text-accent-soft" />
        </div>

        <div className="group/row relative">
          {loading && (
            <div className="flex gap-3.5 overflow-hidden">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton aspect-[2/3] w-[150px] shrink-0 rounded-2xl sm:w-[170px]"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-400/25 bg-red-950/25 px-4 py-6 text-center text-ink-dim">
              خطا در دریافت فهرست؛ اینترنت یا کلید TMDB را بررسی کنید.
            </div>
          )}

          {!loading && !error && (
            <>
              <div
                ref={scroller}
                className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-pl-4 pb-1"
              >
                {items.map((item) => (
                  <MediaCard key={`${item.id}-${mediaId(item)}`} item={item} onSelect={onSelect} />
                ))}
              </div>

              {/* arrows (visible on hover / always on touch-less wide screens) */}
              <ArrowBtn side="start" onClick={() => scrollByAmount(1)} />
              <ArrowBtn side="end" onClick={() => scrollByAmount(-1)} />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function ArrowBtn({ side, onClick }) {
  const isStart = side === 'start'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isStart ? 'قبلی' : 'بعدی'}
      className={`absolute top-0 z-10 hidden h-[calc(100%-14px)] w-11 items-center justify-center opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 md:flex ${
        isStart
          ? 'start-0 bg-gradient-to-l from-base-deep/95 to-transparent'
          : 'end-0 bg-gradient-to-r from-base-deep/95 to-transparent'
      }`}
    >
      <span className="grid size-9 place-items-center rounded-full bg-accent/85 text-white shadow-lg backdrop-blur transition-transform hover:scale-110">
        {isStart ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
      </span>
    </button>
  )
}

/* tiny hook so the row owns its own fetching */
import { useTmdb } from '@/hooks/useTmdb'
function useRow(fetcher) {
  return useTmdb(fetcher, [])
}
function mediaId(item) {
  return item.media_type || (item.first_air_date ? 'tv' : 'movie')
}
