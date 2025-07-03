export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const baseURL = config.public.baseApi

  const apiFetch = async <T = any>(
    endpoint: string,
    options: Partial<Parameters<typeof fetch>[1]> = {}
  ): Promise<T | undefined> => {
    const url = `${baseURL}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...useRequestHeaders(['cookie']),
      ...(options.headers || {}),
    }

    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || `HTTP ${res.status}`)
    }

    const contentLength = res.headers.get('content-length')
    const contentType = res.headers.get('content-type')

    if (contentLength !== '0' && contentType?.includes('application/json')) {
      return res.json()
    }

    return undefined
  }

  const api = {
    get: <T = any>(endpoint: string, params?: Record<string, any>) => {
      const query = params
        ? '?' + new URLSearchParams(params as Record<string, string>).toString()
        : ''
      return apiFetch<T>(`${endpoint}${query}`, { method: 'GET' })
    },

    post: <T = any>(endpoint: string, body?: any) =>
      apiFetch<T>(endpoint, { method: 'POST', body }),

    put: <T = any>(endpoint: string, body?: any) => apiFetch<T>(endpoint, { method: 'PUT', body }),

    delete: <T = any>(endpoint: string, body?: any) =>
      apiFetch<T>(endpoint, { method: 'DELETE', body }),
  }

  return {
    provide: {
      api,
    },
  }
})
