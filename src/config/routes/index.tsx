import { createBrowserRouter } from 'react-router-dom'

const newRouter = createBrowserRouter([
  {
    path: '/login',
    lazy: () => import('@pages/Login').then((module) => ({ Component: module.default }))
  },
])

export default newRouter
