import { useState } from 'react'
import { Flame, Film, Tv, Sparkles, Trophy, Ticket, Popcorn } from 'lucide-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MediaRow from './components/MediaRow'
import DetailModal from './components/DetailModal'
import SearchOverlay from './components/SearchOverlay'
import Footer from './components/Footer'
import { api, mediaTypeOf } from './lib/tmdb'

export default function App() {
  const [detail, setDetail] = useState(null) // { id, type }
  const [searchOpen, setSearchOpen] = useState(false)

  /** any card click: normalize to { id, type } for the detail modal */
  const select = (item) => setDetail({ id: item.id, type: mediaTypeOf(item) })

  const icon = (Icon) => (
    <span className="grid size-8 place-items-center rounded-lg bg-accent/20 text-accent-soft">
      <Icon className="size-4.5" />
    </span>
  )

  return (
    <div className="min-h-screen">
      <Navbar onSearch={() => setSearchOpen(true)} />

      <main>
        <Hero onSelect={select} />

        <MediaRow
          title="ترندهای این هفته"
          icon={icon(Flame)}
          fetcher={() => api.trending('all', 'week')}
          onSelect={select}
        />
        <MediaRow
          id="movies"
          title="فیلم‌های محبوب"
          icon={icon(Film)}
          fetcher={() => api.popularMovies()}
          onSelect={select}
        />
        <MediaRow
          id="series"
          title="سریال‌های محبوب"
          icon={icon(Tv)}
          fetcher={() => api.popularTv()}
          onSelect={select}
        />
        <MediaRow
          id="animation"
          title="انیمیشن‌های جذاب"
          icon={icon(Sparkles)}
          fetcher={() => api.animation()}
          onSelect={select}
        />
        <MediaRow
          title="برترین فیلم‌های تاریخ"
          icon={icon(Trophy)}
          fetcher={() => api.topRatedMovies()}
          onSelect={select}
        />
        <MediaRow
          title="در حال اکران"
          icon={icon(Ticket)}
          fetcher={() => api.nowPlaying()}
          onSelect={select}
        />
        <MediaRow
          title="به‌زودی در سینماها"
          icon={icon(Popcorn)}
          fetcher={() => api.upcoming()}
          onSelect={select}
        />
      </main>

      <Footer />

      {detail && <DetailModal target={detail} onClose={() => setDetail(null)} onSelect={select} />}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={select} />
    </div>
  )
}
