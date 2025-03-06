import _get from 'lodash/get'
import axios, { type AxiosError } from 'axios'
import { parseNumber } from './utils'
import i18n from "i18next"; 

export type APIError = {
  errorCode?: string | null | number
  code?: string | null | number
  succeeded?: boolean
  success?: boolean
  message?: string
  messageNotice?: string
}

export type ErrorMessage = {
  title: string
  message: string
  code: string
  type: 'warning' | 'confirmation' | 'error'
  isOpenErrorModal: boolean
}

export const catchingError = (
  error: Error | AxiosError | APIError,
  callbackError?: (errorCode?: string | number) => void
) => {
  let errorCode: string | undefined | number
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      errorCode?: string
      StatusCode?: number
      error_message?: string
    }>
    errorCode =
      String(axiosError.response?.data?.StatusCode) ||
      `${axiosError.response?.status || ''}` ||
      axiosError.code

    // response could include error_message
    if (axiosError?.response?.data.error_message) {
      errorCode = 'ERR_BAD_REQUEST'
    }
  } else {
    const status = _get(error, 'status')
    const strErrorCode = _get(error, 'errorCode')
    const message = _get(error, 'message')

    if (parseNumber(status) === 200) errorCode = ''
    else errorCode = strErrorCode || message
  }

  if (errorCode === 'ERR_CANCELED') return

  errorCode && console.log(errorCode, error)

  callbackError?.(errorCode)
}

export const errorMapper = (errorCode?: string | number): ErrorMessage => {
  const result = {
    title: '',
    message: '',
    code: '',
    type: 'error',
    isOpenErrorModal: true,
  } as any

  if (!errorCode) return result

  const tOptions = { defaultValue: '', reqID: '' }

  result.code = typeof errorCode == 'string' ? errorCode.trim().toLocaleUpperCase() : errorCode
  if (result.code === 'ERR_NETWORK') {
    result.title = i18n.t('error.noConnection.title', tOptions)
    result.message = i18n.t('error.noConnection.description', tOptions)
  }

  if (result.code === 'ERR_BAD_REQUEST') {
    return result;
  }

  if (!result.message) {
    result.message = i18n.t(`message.code.${result.code}`, tOptions)
  }

  if (!result.message) {
    result.message = i18n.t(`response.error.${result.code}`, tOptions)
  }

  if (!result.message) {
    result.message = i18n.t(`exception.${result.code}.description`, tOptions)
  }

  if (!result.message) {
    result.message = errorCode
    result.title = result.title || i18n.t('common.modal.error.title', tOptions)
  }

  return result
}
