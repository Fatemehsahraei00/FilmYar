import { Star, Film, Tv } from 'lucide-react'
import { img, faNum, titleOf, yearOf, ratingOf, mediaTypeOf, MEDIA_LABEL } from '@/lib/tmdb'

export default function MediaCard({ item, onSelect, className = '' }) {
  const type = mediaTypeOf(item)
  const title = titleOf(item)
  const year = yearOf(item)
  const poster = img(item.poster_path, 'w500')

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      aria-label={title}
      className={`group/card relative w-[150px] shrink-0 snap-start text-right sm:w-[170px] ${className}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-surface shadow-lg transition-all duration-300 group-hover/card:-translate-y-1.5 group-hover/card:border-accent-soft/60 group-hover/card:shadow-[0_14px_38px_rgba(81,40,136,0.55)]">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover/card:scale-108"
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-surface to-base-deep">
            <Film className="size-9 text-accent/60" />
          </div>
        )}

        {/* hover gradient + play hint */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-deep/95 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
        <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
          <span className="grid size-12 place-items-center rounded-full bg-accent/90 shadow-[0_0_30px_rgba(81,40,136,0.9)]">
            <svg viewBox="0 0 24 24" className="size-5 translate-x-px -scale-x-100 fill-white">
              <path d="M8 5.14v13.72L19 12 8 5.14Z" />
            </svg>
          </span>
        </div>

        {/* rating badge */}
        {item.vote_average > 0 && (
          <span className="absolute start-2 top-2 flex items-center gap-1 rounded-lg bg-base-deep/85 px-1.5 py-0.5 text-xs font-bold text-glow backdrop-blur">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {ratingOf(item)}
          </span>
        )}

        {/* media type badge */}
        <span className="absolute end-2 top-2 flex items-center gap-1 rounded-lg bg-accent/85 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur">
          {type === 'tv' ? <Tv className="size-3" /> : <Film className="size-3" />}
          {MEDIA_LABEL[type]}
        </span>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-ink transition-colors group-hover/card:text-accent-soft">
          {title}
        </h3>
        {year && (
          <p className="mt-0.5 text-xs text-ink-dim/70">
            {faNum(year)} · {MEDIA_LABEL[type]}
          </p>
        )}
      </div>
    </button>
  )
}
