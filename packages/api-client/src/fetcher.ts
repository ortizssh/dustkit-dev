interface FetcherConfig {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
}

interface FetcherOptions extends RequestInit {
  params?: Record<string, any>
  timeout?: number
}

class Fetcher {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(config: FetcherConfig = {}) {
    this.baseURL = config.baseURL || ''
    this.defaultHeaders = config.headers || {}
    this.timeout = config.timeout || 30000
  }

  private buildURL(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }

  private async request<T>(path: string, options: FetcherOptions = {}): Promise<T> {
    const { params, timeout = this.timeout, ...fetchOptions } = options
    const url = this.buildURL(path, params)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async get<T>(path: string, options?: FetcherOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(path: string, data?: any, options?: FetcherOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(path: string, data?: any, options?: FetcherOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(path: string, data?: any, options?: FetcherOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string, options?: FetcherOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export function fetcher(config?: FetcherConfig): Fetcher {
  return new Fetcher(config)
}