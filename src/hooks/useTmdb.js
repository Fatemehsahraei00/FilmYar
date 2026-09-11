import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Runs an async TMDB fetcher and returns { data, loading, error }.
 * Safe against out-of-order responses when `deps` change.
 */
export function useTmdb(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const reload = useCallback(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fetcherRef
      .current()
      .then((res) => alive && setData(res))
      .catch((err) => alive && setError(err))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, deps)

  useEffect(() => reload(), [reload])

  return { data, loading, error }
}
