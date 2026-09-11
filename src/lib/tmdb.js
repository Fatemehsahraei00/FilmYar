const TOKEN = import.meta.env.VITE_TMDB_TOKEN
const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

async function get(path, params = {}) {
  const url = new URL(BASE + path)
  url.searchParams.set('language', 'fa-IR')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: 'application/json',
    },
  })
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`)
  return res.json()
}

/** Build a TMDB image URL. size: w200 | w300 | w500 | w780 | original ... */
export const img = (path, size = 'w500') => (path ? `${IMG}/${size}${path}` : '')

export const api = {
  trending: (media = 'all', window = 'day') => get(`/trending/${media}/${window}`),
  popularMovies: (page = 1) => get('/movie/popular', { page }),
  topRatedMovies: (page = 1) => get('/movie/top_rated', { page }),
  nowPlaying: (page = 1) => get('/movie/now_playing', { page }),
  upcoming: (page = 1) => get('/movie/upcoming', { page }),
  popularTv: (page = 1) => get('/tv/popular', { page }),
  topRatedTv: (page = 1) => get('/tv/top_rated', { page }),
  animation: (page = 1) =>
    get('/discover/movie', { with_genres: 16, sort_by: 'popularity.desc', page }),
  search: (query, page = 1) => get('/search/multi', { query, page, include_adult: false }),
  details: (mediaType, id) =>
    get(`/${mediaType}/${id}`, { append_to_response: 'credits,similar' }),
}

/* ---------- helpers ---------- */

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
/** Convert latin digits in any string/number to Persian digits */
export const faNum = (value) =>
  String(value ?? '').replace(/\d/g, (d) => FA_DIGITS[+d])

/** "movie" | "tv" for trending/multi-search items (falls back to guess) */
export const mediaTypeOf = (item) =>
  item.media_type && item.media_type !== 'person'
    ? item.media_type
    : item.first_air_date
      ? 'tv'
      : 'movie'

export const titleOf = (item) => item.title || item.name || ''
export const originalTitleOf = (item) => item.original_title || item.original_name || ''
export const yearOf = (item) =>
  (item.release_date || item.first_air_date || '').slice(0, 4)

export const ratingOf = (item) =>
  item.vote_average ? faNum(item.vote_average.toFixed(1)) : '—'

/** runtime in minutes -> «۲ ساعت و ۱۵ دقیقه» */
export const faRuntime = (minutes) => {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const parts = []
  if (h) parts.push(`${faNum(h)} ساعت`)
  if (m) parts.push(`${faNum(m)} دقیقه`)
  return parts.join(' و ')
}

export const MEDIA_LABEL = { movie: 'فیلم', tv: 'سریال' }
