export const convertToTitleCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, ' $1') // Thêm dấu cách trước chữ hoa
    .replace(/^./, (char) => char.toUpperCase()) // Viết hoa chữ cái đầu
}

export const getYoutubeVideoId = (url: string) => {
  try {
    // Xử lý các trường hợp url null hoặc rỗng
    if (!url) return null

    // Pattern để match ID video từ URL YouTube
    const patterns = [
      // Matching: youtube.com/watch?v=VIDEO_ID
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,

      // Matching: youtube.com/embed/VIDEO_ID
      /youtube\.com\/embed\/([^&\n?#]+)/,

      // Matching: youtu.be/VIDEO_ID
      /youtu\.be\/([^&\n?#]+)/
    ]

    // Kiểm tra từng pattern
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  } catch (error) {
    console.error('Error extracting YouTube video ID:', error)
    return null
  }
}

export const isLocalHost = (): boolean => {
  const hostname = window.location.hostname
  console.log('hostname', hostname)
  return hostname === 'localhost' || hostname === ''
}

export const setCookie = (cookieName: string, cookieValue: string | number | object, minutes = 10080): void => {
  const d = new Date()
  d.setTime(d.getTime() + minutes * 60000)
  const expires = `expires=${d.toUTCString()}`
  const domain = isLocalHost() ? '' : `;domain=${import.meta.env.VITE_API_URL}`
  document.cookie = `${cookieName}=${cookieValue};${expires}${domain};path=/`
}

export const getCookie = (cookieName: string): string => {
  const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`))
  if (match) return match[2].replace(/['"]+/g, '')
  return ''
}

export const deleteCookie = (cookieName: string) => {
  if (getCookie(cookieName)) {
    const domain = isLocalHost() ? '' : `;domain=${import.meta.env.VITE_API_URL}`
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT${domain};path=/`
  }
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const base64Payload = token.split('.')[1] // Lấy phần payload
    const payload = JSON.parse(atob(base64Payload)) // Giải mã Base64
    const currentTime = Math.floor(Date.now() / 1000) // Thời gian hiện tại (giây)

    return payload.exp < currentTime // Kiểm tra thời gian hết hạn
  } catch (error) {
    console.error('Invalid token', error)
    return true // Token không hợp lệ được coi là đã hết hạn
  }
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

function getFilenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null;

  // Match the filename in the header
  const filenameMatch = header.match(/filename\*?=(?:UTF-8'')?["']?([^;"'\r\n]+)/);

  // Return the extracted filename, if found
  return filenameMatch && filenameMatch[1] ? decodeURIComponent(filenameMatch[1]) : null;
}

export function downloadBlob(blob: Blob, filename: string) {
  // Create a temporary anchor element
  const link = document.createElement('a');

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
//  const filename = getFilenameFromContentDisposition(contentDisposition) || 'downloaded-file';

  // Set the download attribute with the desired filename
  link.href = url;
  link.download = filename;

  // Append the link to the document body
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Clean up by removing the link and revoking the object URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
