import { useState, useCallback } from 'react'
import { apiCall } from '../services/http'

export function useApiCall() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const call = useCallback(async (path, method = 'GET', body = null) => {
    setLoading(true)
    setResult(null)
    const r = await apiCall(path, method, body)
    setResult(r)
    setLoading(false)
    return r
  }, [])

  const reset = useCallback(() => { setResult(null); setLoading(false) }, [])

  return { result, loading, call, reset }
}
