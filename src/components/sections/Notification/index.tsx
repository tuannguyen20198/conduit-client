import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons'
import { notification as antdNotification } from 'antd'

export const notification = {
  error: ({ message, description, placement = 'top' }: any) => {
    antdNotification.error({
      message,
      description,
      placement,
      className: 'notification',
      showProgress: true,
      pauseOnHover: true,
      icon: <CloseCircleFilled style={{ color: '#f5222e' }} />
    })
  },
  warning: ({ message, description, placement = 'top' }: any) => {
    antdNotification.warning({
      message,
      description,
      placement,
      className: 'notification',
      showProgress: true,
      pauseOnHover: true,
      icon: <InfoCircleFilled style={{ color: '#f9bf02' }} />
    })
  },
  success: ({ message, description, placement = 'top' }: any) => {
    antdNotification.success({
      message,
      description,
      placement,
      className: 'notification',
      showProgress: true,
      pauseOnHover: true,
      icon: <CheckCircleFilled style={{ color: '#52C51A' }} />
    })
  }
}
