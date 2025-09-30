export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue | undefined }
export type JsonRecord = { [key: string]: JsonValue | undefined }
export type JsonSerializable = JsonValue | JsonRecord
export type QueryParamValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryParamValue>

export interface FetcherConfig {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
}

export interface FetcherOptions extends Omit<RequestInit, 'body'> {
  params?: QueryParams
  timeout?: number
  body?: BodyInit | null
}

class Fetcher {
  private readonly baseURL: string
  private readonly defaultHeaders: Record<string, string>
  private readonly timeout: number

  constructor(config: FetcherConfig = {}) {
    this.baseURL = config.baseURL ?? ''
    this.defaultHeaders = config.headers ?? {}
    this.timeout = config.timeout ?? 30_000
  }

  private buildURL(path: string, params?: QueryParams): string {
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

      const data = (await response.json()) as T
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async get<T>(path: string, options?: FetcherOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(path: string, data?: JsonSerializable, options?: FetcherOptions): Promise<T> {
    const body = data === undefined ? null : JSON.stringify(data)
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body,
    })
  }

  async put<T>(path: string, data?: JsonSerializable, options?: FetcherOptions): Promise<T> {
    const body = data === undefined ? null : JSON.stringify(data)
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body,
    })
  }

  async patch<T>(path: string, data?: JsonSerializable, options?: FetcherOptions): Promise<T> {
    const body = data === undefined ? null : JSON.stringify(data)
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body,
    })
  }

  async delete<T>(path: string, options?: FetcherOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export function fetcher(config?: FetcherConfig): Fetcher {
  return new Fetcher(config)
}
