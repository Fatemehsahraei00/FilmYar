import { useEffect } from 'react'
import { X, Star, Play, CalendarDays, Clock } from 'lucide-react'
import { useTmdb } from '@/hooks/useTmdb'
import {
  api,
  img,
  faNum,
  faRuntime,
  titleOf,
  originalTitleOf,
  yearOf,
  ratingOf,
  mediaTypeOf,
  MEDIA_LABEL,
} from '@/lib/tmdb'

export default function DetailModal({ target, onClose, onSelect }) {
  const { id, type } = target
  const { data, loading } = useTmdb(() => api.details(type, id), [type, id])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const title = data ? titleOf(data) : ''
  const backdrop = img(data?.backdrop_path, 'w1280')
  const poster = img(data?.poster_path, 'w500')
  const cast = (data?.credits?.cast || []).slice(0, 10)
  const similar = (data?.similar?.results || []).filter((s) => s.poster_path).slice(0, 10)
  const seasons = data?.number_of_seasons

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="animate-pop-in relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-b from-surface to-base-deep shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* backdrop header */}
        <div className="relative aspect-video max-h-[46vh] w-full overflow-hidden">
          {backdrop ? (
            <img src={backdrop} alt="" className="size-full object-cover" />
          ) : (
            <div className="skeleton size-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-base-deep via-base-deep/40 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="absolute end-4 top-4 grid size-10 place-items-center rounded-full bg-base-deep/80 text-ink backdrop-blur transition-all hover:scale-105 hover:bg-accent"
          >
            <X className="size-5" />
          </button>

          {!loading && data && (
            <div className="animate-rise-in absolute inset-x-0 bottom-0 flex items-end gap-4 p-5 sm:p-7">
              {poster && (
                <img
                  src={poster}
                  alt={title}
                  className="hidden aspect-[2/3] w-28 rounded-xl border border-white/15 shadow-2xl sm:block"
                />
              )}
              <div className="pb-1">
                <h2 className="text-glow line-clamp-2 text-3xl font-black leading-snug sm:text-4xl">
                  {title}
                </h2>
                {originalTitleOf(data) && originalTitleOf(data) !== title && (
                  <p className="mt-1 text-sm text-ink-dim/70" dir="ltr">
                    {originalTitleOf(data)}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-bold text-ink-dim">
                  <span className="flex items-center gap-1 text-glow">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {ratingOf(data)}
                  </span>
                  {yearOf(data) && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-4" />
                      {faNum(yearOf(data))}
                    </span>
                  )}
                  {data.runtime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {faRuntime(data.runtime)}
                    </span>
                  ) : seasons ? (
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {faNum(seasons)} فصل
                    </span>
                  ) : null}
                  <span className="rounded-md border border-accent-soft/40 px-2 py-0.5">
                    {MEDIA_LABEL[mediaTypeOf(data)]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* body */}
        <div className="space-y-6 p-5 sm:p-7">
          {loading && (
            <div className="space-y-3">
              <div className="skeleton h-4 w-3/4 rounded-full" />
              <div className="skeleton h-4 w-full rounded-full" />
              <div className="skeleton h-4 w-5/6 rounded-full" />
            </div>
          )}

          {!loading && data && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-lg font-black text-white shadow-[0_8px_24px_rgba(81,40,136,0.6)] transition-all hover:bg-accent-hover"
                >
                  <Play className="-scale-x-100 size-5 fill-white" />
                  پخش
                </button>
                {(data.genres || []).map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-accent/45 bg-accent/15 px-3.5 py-1.5 text-sm font-bold text-accent-soft"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="mb-2 text-lg font-black text-ink">داستان</h3>
                <p className="text-base leading-8 text-ink-dim" dir="auto">
                  {data.overview || 'توضیحاتی برای این اثر ثبت نشده است.'}
                </p>
              </div>

              {cast.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-black text-ink">بازیگران</h3>
                  <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                    {cast.map((c) => (
                      <div key={`${c.credit_id}-${c.id}`} className="w-24 shrink-0 text-center">
                        <img
                          src={img(c.profile_path, 'w185')}
                          alt={c.name}
                          loading="lazy"
                          className="aspect-square w-24 rounded-2xl border border-white/10 object-cover"
                        />
                        <p className="mt-1.5 line-clamp-2 text-xs font-bold leading-5 text-ink-dim">
                          {c.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similar.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-black text-ink">آثار مشابه</h3>
                  <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                    {similar.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelect({ id: s.id, type: mediaTypeOf(s) })}
                        className="group/sim w-28 shrink-0 text-right"
                      >
                        <img
                          src={img(s.poster_path, 'w300')}
                          alt={titleOf(s)}
                          loading="lazy"
                          className="aspect-[2/3] w-28 rounded-2xl border border-white/10 object-cover transition-all group-hover/sim:-translate-y-1 group-hover/sim:border-accent-soft/60"
                        />
                        <p className="mt-1.5 line-clamp-2 text-xs font-bold leading-5 text-ink-dim group-hover/sim:text-accent-soft">
                          {titleOf(s)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
