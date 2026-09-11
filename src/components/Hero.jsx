import { useEffect, useState } from 'react'
import { Play, Info, Star } from 'lucide-react'
import AsciiTiles from './AsciiTiles'
import { useTmdb } from '@/hooks/useTmdb'
import { api, img, faNum, titleOf, yearOf, ratingOf, mediaTypeOf, MEDIA_LABEL } from '@/lib/tmdb'

const SLIDE_MS = 8000

export default function Hero({ onSelect }) {
  const { data, loading } = useTmdb(() => api.trending('all', 'day'), [])
  const slides = (data?.results || [])
    .filter((it) => it.backdrop_path && mediaTypeOf(it) !== 'person')
    .slice(0, 5)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => clearInterval(t)
  }, [slides.length])

  const item = slides[index]

  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden pt-16">
      {/* ASCII Tiles animation — the site opener */}
      <div className="absolute inset-0">
        <AsciiTiles
          className="absolute inset-0 size-full"
          images={slides.map((s) => img(s.poster_path, 'w342'))}
          activeImage={item ? img(item.poster_path, 'w342') : ''}
        />
      </div>

      {/* legibility gradients (RTL: text sits on the right) */}
      <div className="absolute inset-0 bg-gradient-to-l from-base-deep via-base-deep/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#241126] to-transparent" />

      <div className="relative mx-auto flex min-h-[86vh] max-w-[1400px] flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
        {loading || !item ? (
          <div className="space-y-4">
            <div className="skeleton h-5 w-40 rounded-full" />
            <div className="skeleton h-14 w-3/4 max-w-xl rounded-2xl" />
            <div className="skeleton h-4 w-2/3 max-w-lg rounded-full" />
            <div className="skeleton h-4 w-1/2 max-w-md rounded-full" />
            <div className="skeleton h-12 w-56 rounded-full" />
          </div>
        ) : (
          <div key={item.id} className="animate-rise-in flex w-full max-w-4xl items-end gap-5 sm:gap-8">
            {/* poster of the active slide */}
            <div className="hidden shrink-0 sm:block">
              <img
                src={img(item.poster_path, 'w500')}
                alt={titleOf(item)}
                className="aspect-[2/3] w-36 rounded-2xl border border-accent-soft/40 object-cover shadow-[0_16px_48px_rgba(81,40,136,0.55)] sm:w-44 lg:w-52"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-3 flex items-center gap-2 text-base font-bold text-accent-soft">
                <span className="inline-block size-2 animate-pulse rounded-full bg-accent-soft" />
                داغِ امروز در فیلم‌یار
              </p>

              <div className="flex items-start gap-4">
                {/* mobile poster — beside title */}
                <img
                  src={img(item.poster_path, 'w342')}
                  alt={titleOf(item)}
                  className="aspect-[2/3] w-24 shrink-0 rounded-xl border border-accent-soft/40 object-cover shadow-[0_10px_30px_rgba(81,40,136,0.5)] sm:hidden"
                />
                <h1 className="text-glow text-4xl font-black leading-tight sm:text-6xl">
                  {titleOf(item)}
                </h1>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-bold text-ink-dim">
                <span className="flex items-center gap-1.5 text-glow">
                  <Star className="size-4.5 fill-amber-400 text-amber-400" />
                  {ratingOf(item)}
                </span>
                {yearOf(item) && <span>{faNum(yearOf(item))}</span>}
                <span className="rounded-md border border-accent-soft/40 px-2 py-0.5 text-sm">
                  {MEDIA_LABEL[mediaTypeOf(item)]}
                </span>
              </div>

              <p className="line-clamp-3 mt-4 max-w-xl text-lg leading-8 text-ink-dim">
                {item.overview || 'توضیحاتی برای این اثر ثبت نشده است.'}
              </p>

              <div className="mt-7 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelect?.(item)}
                  className="flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-lg font-black text-white shadow-[0_10px_30px_rgba(81,40,136,0.65)] transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
                >
                  <Play className="-scale-x-100 size-5 fill-white" />
                  تماشا
                </button>
                <button
                  type="button"
                  onClick={() => onSelect?.(item)}
                  className="flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 text-lg font-black text-ink backdrop-blur transition-all hover:border-accent-soft/60 hover:bg-white/10"
                >
                  <Info className="size-5" />
                  اطلاعات بیشتر
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5 trending posters — pick a slide */}
        {slides.length > 1 && (
          <div className="mt-9 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            {slides.map((s, i) => {
              const poster = img(s.poster_path, 'w185')
              const active = i === index
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-label={titleOf(s)}
                  title={titleOf(s)}
                  onClick={() => setIndex(i)}
                  className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    active
                      ? 'border-accent-soft shadow-[0_0_20px_rgba(157,123,216,0.85)] scale-105'
                      : 'border-white/15 opacity-60 hover:opacity-90 hover:border-white/35'
                  }`}
                >
                  {poster ? (
                    <img src={poster} alt={titleOf(s)} className="aspect-[2/3] w-14 object-cover sm:w-16" />
                  ) : (
                    <div className="grid aspect-[2/3] w-14 place-items-center bg-surface sm:w-16">
                      <Play className="size-4 text-accent-soft" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
