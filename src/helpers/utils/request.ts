import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
  type Canceler,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getCookie } from './storeageUtils'
import COOKIE_NAMES from '../enums/Cookies'
import _get from 'lodash/get'
import { type APIError, catchingError, errorMapper } from './errorMapper'

import { notification } from 'antd'
// const [api, contextHolder] = notification.useNotification()

export enum REQUEST_HEADER_KEYS {
  USER_NAME = 'username',
  AD_TOKEN = 'ad-token',
  TOKEN = 'token',
}

type ConfigData = {
  skipLoading?: boolean
}

export default class Request {
  protected instance: AxiosInstance
  protected cancel?: Canceler
  protected isThrowError = true
  protected manualHandleError = false
  protected contentType = 'application/json; charset=utf-8'
  protected readonly baseURL: string

  protected isShowLoading = false
  protected skipAuthen = false

  private TIME_OUT = 60000

  public constructor(baseURL: string) {
    if (!baseURL) throw new Error('API url can not empty')

    this.baseURL = baseURL
    this.instance = axios.create({
      baseURL,
      timeout: this.TIME_OUT,
      headers: {
        'Content-type': this.contentType,
      },
    })
    this.initializeRequestInterceptor()
    this.initializeResponseInterceptor()
  }

  private initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this.handleRequest)
  }

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    )
  }

  private handleRequest = async (
    config: InternalAxiosRequestConfig<ConfigData>
  ) => {
    if (this.skipAuthen) {
      return config
    }

    let accessToken: string | null = this.getAccessTokenSync()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }

    // success
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  }

  private handleResponse = (response?: AxiosResponse) => {
    return response?.data || ({} as AxiosResponse<any, any>).data
  }

  private getRequestConfigData = (
    config?: AxiosRequestConfig<ConfigData>
  ): ConfigData | undefined => {
    try {
      return typeof config?.data === 'string'
        ? JSON.parse(config?.data || '{}')
        : config?.data || {}
    } catch (e) {
      console.log('e', e)
    }

    return {}
  }

  private hasResponseErrorCallback = (errorCode?: string) => {
    if (!errorCode) return

    const message = errorMapper(errorCode)

    if (this.manualHandleError) return

    notification.error({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    })

  }

  private hasResponseError = (error: AxiosError | APIError) => {
    catchingError(error, this.hasResponseErrorCallback as any)
  }

  // private hasResponseError = (error: AxiosError) => {
  //   // catchingError(error, this.hasResponseErrorCallback)
  //   if (this.manualHandleError) {
  //     return null
  //   } else {
  //     let errorCode: string | undefined | number

  //     if (axios.isAxiosError(error)) {
  //       const axiosError = error as AxiosError<{
  //         errorCode?: string
  //         StatusCode?: number
  //       }>
  //       errorCode =
  //         axiosError.response?.data?.StatusCode ||
  //         `${axiosError.response?.status || ''}` ||
  //         axiosError.code
  //     } else {
  //       const status = _get(error, 'status')
  //       const strErrorCode = _get(error, 'errorCode')
  //       const message = _get(error, 'message')

  //       if (parseNumber(status) === 200) errorCode = ''
  //       else errorCode = strErrorCode || message
  //     }
  //   }
  // }

  private watchGetAccessToken = (
    resolve: (value: string | PromiseLike<string>) => void
  ) => {
    const timer = setTimeout(() => {
      const accessToken = this.getAccessTokenSync()
      if (accessToken) {
        clearTimeout(timer)
        resolve(accessToken)
        return
      }

      this.watchGetAccessToken(resolve)
    }, 30)
  }

  private getAccessToken = async () => {
    return new Promise<string>((resolve) => {
      this.watchGetAccessToken(resolve)
    })
  }

  private getAccessTokenSync = () => {
    return getCookie(COOKIE_NAMES.ACCESS_TOKEN)
  }

  private handleError = async (error: AxiosError) => {
    // const configData = this.getRequestConfigData(error?.config)

    const { status } = error.response || {}
    if (status === 401 || status === 403) {
      // TODO:
      return null
    }

    this.hasResponseError(error)

    if (this.manualHandleError) throw error.response?.data

    return error.response?.data
  }
}
