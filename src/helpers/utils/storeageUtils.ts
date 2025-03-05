import COOKIE_NAMES from '@helpers/enums/Cookies'
export const isLocalHost = () => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '' ||
    process.env.NODE_ENV === 'development'
  ) {
    return true
  }
  return false
}

export const setCookie = (
  cookieName: string,
  cookieValue: string | number | object,
  msSeconds = 6000000
): void => {
  const d = new Date()
  d.setTime(d.getTime() + msSeconds)
  const expires = `expires=${d.toUTCString()}`
  const domain = isLocalHost()
    ? ''
    : `;domain=${import.meta.env.VITE_DOMAIN_NAME}`
  document.cookie = `${cookieName}=${cookieValue};${expires}${domain};path=/`
}

export const getCookie = (cookieName: string): string => {
  const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`))
  if (match) return match[2].replace(/['"]+/g, '')
  return ''
}

export const deleteCookie = (cookieName: string) => {
  if (getCookie(cookieName)) {
    const domain = isLocalHost()
      ? ''
      : `;domain=${import.meta.env.VITE_DOMAIN_NAME}`
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT${domain};path=/`
  }
}

export const deleteAllCookies = (
  domainName = import.meta.env.VITE_DOMAIN_NAME
) => {
  const cookies = document.cookie.split(';')
  const domain =
    isLocalHost() || domainName === '' ? '' : `;domain=${domainName}`

  for (const element of cookies) {
    const cookie = element
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT${domain};path=/`
  }
}

export const getRolesCookie = () => {
  const roles = getCookie(COOKIE_NAMES.USER_ROLES)
  const listRoles = roles.split(',')
  return listRoles || []
}
