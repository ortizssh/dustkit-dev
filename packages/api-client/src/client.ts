import { fetcher } from './fetcher'

interface ApiClientConfig {
  baseURL: string
  getAccessToken?: () => Promise<string | null>
}

export interface ApiClient {
  get<T>(path: string, options?: any): Promise<T>
  post<T>(path: string, data?: any, options?: any): Promise<T>
  put<T>(path: string, data?: any, options?: any): Promise<T>
  patch<T>(path: string, data?: any, options?: any): Promise<T>
  delete<T>(path: string, options?: any): Promise<T>
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const getHeaders = async () => {
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

  return {
    async get<T>(path: string, options?: any): Promise<T> {
      const headers = await getHeaders()
      return client.get<T>(path, { ...options, headers })
    },
    
    async post<T>(path: string, data?: any, options?: any): Promise<T> {
      const headers = await getHeaders()
      return client.post<T>(path, data, { ...options, headers })
    },
    
    async put<T>(path: string, data?: any, options?: any): Promise<T> {
      const headers = await getHeaders()
      return client.put<T>(path, data, { ...options, headers })
    },
    
    async patch<T>(path: string, data?: any, options?: any): Promise<T> {
      const headers = await getHeaders()
      return client.patch<T>(path, data, { ...options, headers })
    },
    
    async delete<T>(path: string, options?: any): Promise<T> {
      const headers = await getHeaders()
      return client.delete<T>(path, { ...options, headers })
    },
  }
}