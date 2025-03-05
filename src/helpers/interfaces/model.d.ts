declare namespace MODEL {
  export type AmountValueType = number | string | null | undefined

  export interface IResponseBase<P = any> {
    status?: number | string
    errorCode?: string | null
    message?: string | null
    result: P
    errors?: IErrorResult[]
  }
  export interface IErrorResult {
    errorCode: string
    errorMessage: string
    propertyName: string
  }
  export interface IPagingResult<P = any> {
    pageIndex: number
    pageSize: number
    totalRecords: number
    data: P[]
    items: p[]
    totalCount: number
  }
  export interface IPagingNotificationResult<P = any> extends IPagingResult {
    totalUnreadCount: number
  }

  export interface IPagingParams {
    current: number
    pageSize: number
    rangePicker?: Object[]
  }
}
