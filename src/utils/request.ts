/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IsUnknown } from '@/types/common'
import axios, {
  type AxiosInstance,
  type AxiosInterceptorManager,
  type AxiosInterceptorOptions,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

type RawOnFulfilled<T> = Parameters<AxiosInterceptorManager<T>['use']>[0]
type RawOnRejected<T> = Parameters<AxiosInterceptorManager<T>['use']>[1]

type Interceptor = {
  onFulfilled?: (value: AxiosResponse) => any | Promise<any>
  onRejected?: (error: any) => any
  options?: AxiosInterceptorOptions
}

type Config = Omit<AxiosRequestConfig, 'baseURL'> &
  (
    | {
        interceptors?: {
          request?: Interceptor
          response?: Interceptor
        }
      }
    | {
        unwrap?: boolean
        errorLike?: (data: any) => boolean
      }
  )

type TypedAxiosInstance<R> = Omit<AxiosInstance, 'get'> & {
  get<D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
}

export const createRequest = <
  R extends C extends {
    interceptors?: {
      response?: {
        onFulfilled?: (value: AxiosResponse) => infer R
      }
    }
  }
    ? IsUnknown<Awaited<R>> extends true
      ? AxiosResponse
      : Awaited<R>
    : C extends {
          unwrap?: infer Unwrap
        }
      ? Unwrap extends true
        ? AxiosResponse['data']
        : AxiosResponse
      : AxiosResponse,
  C extends Config = Config,
>(
  baseURL: string,
  config?: C,
): TypedAxiosInstance<R> => {
  config = config ?? ({} as C)

  const instance = axios.create({
    baseURL,
    ...config,
  })

  // request
  {
    const onFulfilled: RawOnFulfilled<InternalAxiosRequestConfig> =
      'interceptors' in config
        ? (config.interceptors?.request?.onFulfilled as RawOnFulfilled<InternalAxiosRequestConfig>)
        : (config) => config
    const onRejected: RawOnRejected<AxiosResponse> =
      'interceptors' in config
        ? (config.interceptors?.request?.onRejected as RawOnRejected<AxiosResponse>)
        : (error) => Promise.reject(error)

    instance.interceptors.request.use(onFulfilled, onRejected)
  }

  // response
  {
    const onFulfilled: RawOnFulfilled<R> =
      'interceptors' in config
        ? (config.interceptors?.response?.onFulfilled as RawOnFulfilled<R>)
        : (response) => {
            let data = response
            let isErrorLike = false

            if ('unwrap' in config) {
              if (config.unwrap) {
                data = response.data
              }
            }

            if ('errorLike' in config) {
              isErrorLike = config?.errorLike?.(data) || false
            }

            console.log(isErrorLike)

            return isErrorLike ? Promise.reject({ __CODE__: 'ERROR_LIKE', data }) : data
          }
    const onRejected: RawOnRejected<R> =
      'interceptors' in config
        ? (config.interceptors?.response?.onRejected as RawOnRejected<R>)
        : (error) => Promise.reject(error)

    instance.interceptors.response.use(onFulfilled, onRejected)
  }

  return instance
}
