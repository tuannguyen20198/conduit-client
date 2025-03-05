import React, { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './config/routes'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import { store } from '@store/store'
import theme from '@config/theme'
import styles from './App.module.scss'
import { classNamesFunc } from 'classnames-generics'
import { ErrorBoundary } from 'react-error-boundary'
import locale from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.locale('vi-VN')
dayjs.extend(utc)
dayjs.extend(timezone)
const classNames = classNamesFunc()
// dayjs.prototype.formatLocalV

const Application: React.FunctionComponent<{}> = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading... </div>}>
        <Provider store={store}>
          <ConfigProvider theme={theme.theme} locale={locale}>
            <div className={classNames(styles.appContainer)}>
              <RouterProvider router={router} />
            </div>
          </ConfigProvider>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  )
}

export default Application
