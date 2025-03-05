import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useNavigate } from 'react-router-dom'
import { notification } from '../../components/sections/Notification'
import { useNProgress } from '../../helpers/hooks/useNProgress'
import { useRequest } from 'ahooks'
import authenticateService from '@services/auth'
import { setCookie } from '@helpers/utils/storeageUtils'
import COOKIE from '@enums/Cookies'
import Cookies from 'js-cookie'
const LoginPage = () => {
  useNProgress()
  const [form] = useForm()
  const navigate = useNavigate()

  const onFinish = (values: AUTH.ILoginRequest) => {
    run(values);
  }
  // const loginMutation = useMutation({
  //   mutationFn: AuthApi.login,
  //   onSuccess: (data: any) => {
  //     const userId = localStorage.getItem('user_id')

  //     // Lưu token vào cookies
  //     const token = data.data.data
  //     Cookies.set('auth_token', token, { expires: 1 }) // 1 ngày
  //     if (userId === null || userId.trim() === '' || !userId) {
  //       const newUserId = form.getFieldValue('username')
  //       localStorage.setItem('user_id', newUserId)
  //     }
  //     notification.success({ message: 'Đăng nhập', description: `Thành công!` })
  //     navigate('/')
  //   },
  //   onError: () => {
  //     notification.error({ message: 'Đăng nhập', description: `Sai thông tin đăng nhập hoặc mật khẩu!` })
  //     form.resetFields()
  //   }
  // })


  const { run } = useRequest(authenticateService.login, {
    manual: true,
    onError: () => {
      notification.error({ message: 'Đăng nhập', description: `Sai thông tin đăng nhập hoặc mật khẩu!` })
    },
    onSuccess: async (response: AUTH.ILoginResponse) => {
      const token = response.data;
      if (token) {
        Cookies.set('access_token', token, { expires: 1 }) // 1 ngày
        Cookies.set('userID', form.getFieldValue('username'), { expires: 1 }) // 1 ngày
        navigate('/')
      }
    },
  })

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <section className="flex h-screen w-screen">
      <div className="flex h-full w-full items-center justify-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 p-6">
        <div className="flex flex-col w-full sm:w-auto md:flex-row items-center gap-3 sm:gap-10 rounded-xl bg-white p-10 py-4 shadow-xl">
          <img
            src="../images/Logo-Binh-Dien.webp"
            alt="Welcome"
            className=" sm:w-[400px] h-[160px] md:h-full lg:object-cover opacity-95 "
          />

          <div className="flex w-full lg:min-w-[350px] lg:max-w-[720px] flex-1 flex-col">
            <p className="text-center text-[36px] font-medium uppercase">Đăng nhập</p>

            <Form
              form={form}
              name="basic"
              initialValues={{ remember: true }}
              autoComplete="off"
              layout="vertical"
              onFinishFailed={onFinishFailed}
              //</div>onFinish={(vals) => {
                //localStorage.removeItem('user_id')
               // loginMutation.mutate(vals)
            //  }}
              onFinish={onFinish}
            //  onFinishFailed={onFinishFailed}
              className="flex flex-col pt-3"
            >
              <Form.Item
                label="Tài khoản"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
              >
                <Input size="large" placeholder="Tài khoản" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password size="large" placeholder="Mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button
             //     loading={loginMutation.isPending}
                  className="!mt-8 w-full"
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
