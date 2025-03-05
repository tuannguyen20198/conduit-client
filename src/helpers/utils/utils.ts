import dayjs, { Dayjs } from 'dayjs'
import SystemConst from './constants'

export const formatNumber = (value: MODEL.AmountValueType): string => {
  if (value === undefined || value === null) return ''

  if (parseNumber(value) !== 0) {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return '0'
}

export const parseNumber = (text: MODEL.AmountValueType) => {
  if (!text) return 0

  try {
    return Number(text || 0)
  } catch (e) {
    return 0
  }
}

export const formatDateTime = (date: string) => {
  return dayjs(date).format(SystemConst.FORMATS_DATE.DD_MM_YYYY)
}

export const getStrValue = (
  text?: number | string | null,
  keepZero: boolean = false
) => {
  if (typeof text === 'number') return text === 0 && !keepZero ? '' : '' + text
  return text || ''
}

export const delay = (s: number) => {
  return new Promise((resolve) => setTimeout(resolve, s))
}

export const genQueryForPaging = (params: MODEL.IPagingParams) => {
  const { current, pageSize = 10, ...restForm } = params
  const skipCount = (current - 1) * pageSize
  let query = ''
  query += `SkipCount=${skipCount}`
  query += `&MaxResultCount=${pageSize}`
  // query += `&sorting=fromDate`
  Object.entries(restForm).forEach(([key, value]) => {
    if (value) {
      if (key === 'rangePicker') {
        const fromDate = dayjs(value?.[0] as Dayjs)
          .startOf('day')
          .toISOString()
        const toDate = dayjs(value[1] as Dayjs)
          .endOf('day')
          .toISOString()
        query += `&fromDate=${fromDate}&toDate=${toDate}`
      } else {
        query += `&${key}=${value}`
      }
    }
  })
  return query
}

export const formatClientTime = (value: string, format = 'DD/MM/YYYY') => {
  if (!value) return '-'
  return dayjs(value).utc(true).local().format(format)
}

export const formarCurrency = (value: string | number) => {
  if (!value) return '-'
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}


export function base64ToFile(base64String: any, filename: any, mimeType: any) {
  // Check for data URI prefix and remove it if present
  const base64Data = base64String.includes('base64,') ? base64String.split('base64,')[1] : base64String

  // Decode Base64 to binary
  const byteString = atob(base64Data)

  // Convert binary data to Uint8Array
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  // Create a File object
  return new File([uint8Array], filename, { type: mimeType })
}

export function extractMimeAndFilename(base64String: string) {
  const regex = /^data:([^;]+);base64,/
  const match = base64String.match(regex)

  if (!match) return null

  const mimeType = match[1] || ''
  const extensionMap: { [key: string]: string } = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/gif': '.gif',
    'application/pdf': '.pdf'
  }
  const extension = extensionMap[mimeType] || ''
  const fileName = `file${extension}`

  return { mimeType, fileName }
}
