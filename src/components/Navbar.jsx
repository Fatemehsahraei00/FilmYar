import { useEffect, useState } from 'react'
import { Clapperboard, Search, LogIn } from 'lucide-react'

const LINKS = [
  { href: '#home', label: 'خانه' },
  { href: '#movies', label: 'فیلم' },
  { href: '#series', label: 'سریال' },
  { href: '#animation', label: 'انیمیشن' },
]

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-base-deep/85 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl'
          : 'bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        {/* logo */}
        <a href="#home" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-hover shadow-[0_0_24px_rgba(81,40,136,0.8)]">
            <Clapperboard className="size-5 text-white" strokeWidth={2.2} />
          </span>
          <span className="text-2xl font-black tracking-tight text-ink">
            فیلم<span className="text-accent-soft">‌یار</span>
          </span>
        </a>

        {/* nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-lg font-bold text-ink-dim transition-colors hover:bg-white/5 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSearch}
            aria-label="جست‌وجوی فیلم و سریال"
            className="flex h-10 items-center gap-2 rounded-full border border-accent/50 bg-base-deep/50 px-4 text-ink-dim backdrop-blur transition-all hover:border-accent-soft hover:text-ink hover:shadow-[0_0_20px_rgba(81,40,136,0.5)]"
          >
            <Search className="size-4.5" />
            <span className="hidden text-base sm:inline">جست‌وجو...</span>
          </button>
          <button
            type="button"
            className="hidden h-10 items-center gap-1.5 rounded-full bg-accent px-5 text-base font-bold text-white shadow-[0_4px_18px_rgba(81,40,136,0.55)] transition-all hover:bg-accent-hover sm:flex"
          >
            <LogIn className="size-4" />
            ورود
          </button>
        </div>
      </div>
    </header>
  )
}
