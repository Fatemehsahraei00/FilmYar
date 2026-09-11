import { useEffect, useRef } from 'react'

/**
 * ASCII Tiles — a field of glassy tiles made of glowing ASCII characters.
 * From-scratch equivalent of the React Bits Pro "ASCII Tiles" component,
 * themed with the site palette (#301934 / #512888).
 * Tiles light up from drifting glow blobs and react to the pointer.
 * Optional `images` URLs are painted inside random tiles as part of the animation.
 */
const CHARS = '▶★☆◆●○♦♠♣♥♪♫▮▯▰▱◉◎▪▫FTV'

const TILE = 62
const GAP = 9
const STEP = TILE + GAP
const R = 240 // pointer influence radius
const IMAGE_TILE_RATIO = 0.22 // share of tiles that carry a poster

/** Preload poster images for canvas drawing (needs CORS). */
function loadImage(url) {
  return new Promise((resolve) => {
    const el = new Image()
    el.crossOrigin = 'anonymous'
    el.onload = () => resolve(el)
    el.onerror = () => resolve(null)
    el.src = url
  })
}

export default function AsciiTiles({ className = '', density = 1, images = [], activeImage = '' }) {
  const canvasRef = useRef(null)
  const imagesRef = useRef(images)
  const activeImageRef = useRef(activeImage)
  imagesRef.current = images
  activeImageRef.current = activeImage

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let raf = 0
    let running = true
    let tiles = []
    let W = 0
    let H = 0
    const imageCache = new Map()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }

    const assignPosterTiles = () => {
      const urls = imagesRef.current.filter(Boolean)
      if (!urls.length) return
      const posterTiles = tiles.filter(() => Math.random() < IMAGE_TILE_RATIO)
      posterTiles.forEach((t, i) => {
        t.imageUrl = urls[i % urls.length]
      })
    }

    const preloadImages = async () => {
      const urls = [...new Set(imagesRef.current.filter(Boolean))]
      await Promise.all(
        urls.map(async (url) => {
          if (imageCache.has(url)) return
          const el = await loadImage(url)
          if (el) imageCache.set(url, el)
        }),
      )
    }

    const drawCover = (el, x, y, size) => {
      const iw = el.naturalWidth
      const ih = el.naturalHeight
      if (!iw || !ih) return
      const scale = Math.max(size / iw, size / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = x + (size - dw) / 2
      const dy = y + (size - dh) / 2
      ctx.drawImage(el, dx, dy, dw, dh)
    }

    const build = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = Math.max(1, Math.round(W * dpr))
      canvas.height = Math.max(1, Math.round(H * dpr))
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const step = STEP / density
      const cols = Math.ceil(W / step) + 1
      const rows = Math.ceil(H / step) + 1
      tiles = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          tiles.push({
            x: c * step,
            y: r * step,
            size: step - GAP,
            chars: Array.from({ length: 4 }, () => CHARS[(Math.random() * CHARS.length) | 0]),
            seed: Math.random() * Math.PI * 2,
            imageUrl: null,
          })
        }
      }
      assignPosterTiles()
    }

    const intensity = (t, time) => {
      // two slow glow waves drifting across the field
      const a = 0.5 + 0.5 * Math.sin(t.x * 0.0055 + time * 0.00045 + t.seed)
      const b = 0.5 + 0.5 * Math.sin(t.y * 0.0075 - time * 0.00032 + t.seed * 1.7)
      let wave = Math.pow(a * b, 1.6) * 0.5
      // boost tiles showing the currently featured poster
      if (t.imageUrl && t.imageUrl === activeImageRef.current) wave = Math.min(1, wave + 0.35)
      // pointer proximity boost
      const dx = t.x + t.size / 2 - mouse.x
      const dy = t.y + t.size / 2 - mouse.y
      const d = Math.sqrt(dx * dx + dy * dy)
      const near = d < R ? (1 - d / R) * 1.1 : 0
      return Math.min(1, wave + near)
    }

    const frame = (time) => {
      if (!running) return
      ctx.clearRect(0, 0, W, H)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (const t of tiles) {
        const v = intensity(t, time)
        const radius = Math.round(9 * (1 - v) + 14)
        const poster = t.imageUrl ? imageCache.get(t.imageUrl) : null

        ctx.beginPath()
        ctx.roundRect(t.x, t.y, t.size, t.size, radius)

        // poster inside the tile — fades in with the glow wave
        if (poster) {
          ctx.save()
          ctx.clip()
          ctx.globalAlpha = 0.08 + v * 0.82
          drawCover(poster, t.x, t.y, t.size)
          ctx.restore()

          // purple tint so posters blend with the site palette
          ctx.beginPath()
          ctx.roundRect(t.x, t.y, t.size, t.size, radius)
          ctx.fillStyle = `rgba(48, 25, 52, ${0.55 - v * 0.35})`
          ctx.fill()
        }

        // glassy tile overlay
        ctx.beginPath()
        ctx.roundRect(t.x, t.y, t.size, t.size, radius)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.015 + v * 0.045})`
        ctx.fill()
        ctx.strokeStyle = `rgba(154, 106, 240, ${0.08 + v * 0.6})`
        ctx.lineWidth = 1
        ctx.stroke()

        if (v < 0.07) continue

        // ASCII chars on tiles without posters, or faintly on poster tiles at peak glow
        if (!poster || v > 0.55) {
          if (Math.random() < 0.015) {
            t.chars[(Math.random() * t.chars.length) | 0] = CHARS[(Math.random() * CHARS.length) | 0]
          }

          const cr = Math.round(120 + v * 115)
          const cg = Math.round(60 + v * 70)
          const cb = Math.round(190 + v * 65)
          ctx.font = `${Math.round(10 + v * 4)}px "Courier New", monospace`
          if (v > 0.5) {
            ctx.shadowColor = 'rgba(185, 138, 238, 0.9)'
            ctx.shadowBlur = 14 * v
          }
          ctx.fillStyle = poster
            ? `rgba(${cr}, ${cg}, ${cb}, ${0.08 + v * 0.35})`
            : `rgba(${cr}, ${cg}, ${cb}, ${0.2 + v * 0.8})`
          const half = t.size / 2
          const off = t.size * 0.26
          const pos = [
            [half - off, half - off],
            [half + off, half - off],
            [half - off, half + off],
            [half + off, half + off],
          ]
          for (let i = 0; i < 4; i++) {
            ctx.fillText(t.chars[i], t.x + pos[i][0], t.y + pos[i][1])
          }
          ctx.shadowBlur = 0
        }
      }

      raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    build()
    preloadImages()
    raf = requestAnimationFrame(frame)
    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [density, images.join('|'), activeImage])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
