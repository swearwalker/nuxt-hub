interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
  retry: boolean
  retryDelay: number
  maxRetries: number
}

interface ApiResponse<T = any> {
  data: T
  status: number
  headers: Headers
}

interface Api {
  get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>>
  post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  delete<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>>
}

declare module '#app' {
  interface NuxtApp {
    $api: Api
  }
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    NUXT_PUBLIC_BASE_API: string
  }
}
