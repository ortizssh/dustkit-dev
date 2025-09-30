import { fetcher, type FetcherOptions, type JsonSerializable } from './fetcher'

interface ApiClientConfig {
  baseURL: string
  getAccessToken?: () => Promise<string | null>
}

export type ApiClientRequestOptions = Omit<FetcherOptions, 'body'>

export interface ApiClient {
  get<T>(path: string, options?: ApiClientRequestOptions): Promise<T>
  post<T>(path: string, data?: JsonSerializable, options?: ApiClientRequestOptions): Promise<T>
  put<T>(path: string, data?: JsonSerializable, options?: ApiClientRequestOptions): Promise<T>
  patch<T>(path: string, data?: JsonSerializable, options?: ApiClientRequestOptions): Promise<T>
  delete<T>(path: string, options?: ApiClientRequestOptions): Promise<T>
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const getHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {}

    if (config.getAccessToken) {
      const token = await config.getAccessToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  const client = fetcher({
    baseURL: config.baseURL,
  })

  const withAuthHeaders = async <T>(
    request: (headers: Record<string, string>) => Promise<T>,
  ): Promise<T> => {
    const headers = await getHeaders()
    return request(headers)
  }

  return {
    get: async <T>(path: string, options?: ApiClientRequestOptions): Promise<T> =>
      withAuthHeaders((headers) => client.get<T>(path, { ...options, headers })),

    post: async <T>(
      path: string,
      data?: JsonSerializable,
      options?: ApiClientRequestOptions,
    ): Promise<T> =>
      withAuthHeaders((headers) => client.post<T>(path, data, { ...options, headers })),

    put: async <T>(
      path: string,
      data?: JsonSerializable,
      options?: ApiClientRequestOptions,
    ): Promise<T> =>
      withAuthHeaders((headers) => client.put<T>(path, data, { ...options, headers })),

    patch: async <T>(
      path: string,
      data?: JsonSerializable,
      options?: ApiClientRequestOptions,
    ): Promise<T> =>
      withAuthHeaders((headers) => client.patch<T>(path, data, { ...options, headers })),

    delete: async <T>(path: string, options?: ApiClientRequestOptions): Promise<T> =>
      withAuthHeaders((headers) => client.delete<T>(path, { ...options, headers })),
  }
}
