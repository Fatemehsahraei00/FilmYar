import { Clapperboard, Heart } from 'lucide-react'
import { faNum } from '@/lib/tmdb'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/5 bg-base-deep/60">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-hover">
            <Clapperboard className="size-4.5 text-white" />
          </span>
          <div>
            <p className="text-lg font-black text-ink">
              فیلم<span className="text-accent-soft">‌یار</span>
            </p>
            <p className="text-xs text-ink-dim/60">پیشنهاد فیلم و سریال بر اساس سلیقه شما</p>
          </div>
        </div>

        <p className="max-w-md text-center text-sm leading-7 text-ink-dim/60">
          این محصول از API سایت
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="mx-1 font-bold text-accent-soft hover:underline"
            dir="ltr"
          >
            TMDB
          </a>
          استفاده می‌کند اما توسط TMDB تأیید یا گواهی نشده است.
        </p>

        <p className="flex items-center gap-1.5 text-sm text-ink-dim/60">
          ساخته‌شده با
          <Heart className="size-4 fill-accent-soft text-accent-soft" />
          · {faNum(1405)}
        </p>
      </div>
    </footer>
  )
}
