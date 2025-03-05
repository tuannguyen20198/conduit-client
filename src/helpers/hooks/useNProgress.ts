import * as NProgress from 'nprogress'
import React from 'react'
import { useLocation } from 'react-router-dom'

export const useNProgress = () => {
  const pathname = useLocation().pathname

  React.useEffect(() => {
    NProgress.start()
    NProgress.done()
  }, [pathname])
}
