import { LeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="mx-auto w-[90%]">
      <Link to={'/'} className="transition-colors hover:text-blue-500 ">
        <Button size="large" icon={<LeftOutlined />} className="mt-12">
          Trở lại
        </Button>
      </Link>

      <div className="flex h-full flex-col items-center justify-center gap-5 pt-6 md:pt-12">
        <h1 className="text-primary-main text-center text-[30px] font-bold text-red-500">Ôi! Không tìm thấy trang</h1>
        <img src="../images/404.gif" alt="Page not found" className="object-contain" />
      </div>
    </section>
  )
}

export default NotFoundPage
