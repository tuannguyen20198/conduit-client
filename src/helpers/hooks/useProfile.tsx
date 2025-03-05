import { useAsyncEffect, useRequest } from 'ahooks'
import { notification } from 'antd'
import COOKIE_NAMES from '@helpers/enums/Cookies'
import menu from '@config/routes/menu'
import { useAppDispatch } from '@store/hooks'
import {
  saveMenu,
} from '@redux-slices/global.slice'

const useGetUserProfile = ({ token }: { token: string }) => {
  const dispatch: any = useAppDispatch()
  //[TODO] can implement getProfile 
  const {
    runAsync: getProfile,
    data,
    loading,
  } = useRequest(() => Promise.resolve(), {
    manual: true,
    onError: () => {
      dispatch(saveMenu(menu))
    },
    onSuccess: async () => {
      dispatch(saveMenu(menu))
    },
  })

  useAsyncEffect(async () => {
    if (token) {
      getProfile()
      // getListEmployeeInYourOrganization('')
    }
  }, [token])

  return {
    data,
    loading,
  }
}

export { useGetUserProfile }
