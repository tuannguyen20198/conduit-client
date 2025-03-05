import { AppstoreOutlined, CaretDownOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Layout, Menu, MenuProps, Space } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content, Header } from 'antd/es/layout/layout'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import mainLogo from '/images/Logo-Binh-Dien.webp'
import { deleteAllCookies } from '@helpers/utils/storeageUtils'

const MainLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false)
  const selectedKey = useLocation().pathname
  const user = localStorage.getItem('user')

  const itemsMenu = [
    // { key: 'bots', icon: <RedditOutlined />, label: <Link to={'/bots'}>Bots</Link> },
    { key: 'home', icon: <AppstoreOutlined />, label: <Link to={'/'}>Bots</Link> }
    // { key: 'archives', icon: <DatabaseOutlined />, label: <Link to={'/archives'}>Lưu trữ</Link> }
  ]

  const items: MenuProps['items'] = [
    {
      label: (
        <Link
          to={'/login'}
          onClick={() => {
            localStorage.removeItem('user_id')
            localStorage.removeItem('bot_conversation')
            localStorage.removeItem('bot_data')
            deleteAllCookies();
            // Cookies.remove('auth_token')
          }}
        >
          Logout
        </Link>
      ),
      key: '0'
    }
  ]

  const itemActive = () => {
    const pathList: any = { '/chatbot': 'chatbot', '/archives': 'archives', '/bots': 'bots' }

    for (const path in pathList) {
      if (selectedKey.startsWith(path)) {
        return [pathList[path]]
      }
    }
    return ['home']
  }

  const defaultOpenKeys = selectedKey.split('/')?.[1]

  return (
    <Layout className="">
      <Header className="sticky top-0 z-20 flex items-center bg-white p-0 shadow-sm justify-between px-10">
        <Link to={'/'}>
          <div className="flex items-center gap-2">
            <img
              src={mainLogo}
              alt="logo"
              width={48}
              height={48}
              className={clsx('h-[48px] w-[48px] object-contain')}
            />
            <span className="font-medium text-[18px] decoration-from-font">Chatbot</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <p className="dark:text-customColor-dark">{user}</p>
          <span className="font-medium">{localStorage.getItem('user_id')}</span>
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar icon={<UserOutlined />} className="bg-slate-400 dark:bg-slate-400" />
                <CaretDownOutlined className="!text-[#BDBDC0]" />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={(value) => setCollapsed(value)}
          className="!fixed"
        >
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={itemActive()}
            className="!h-screen"
            mode="inline"
            items={itemsMenu}
          />
        </Sider>

        <Content className={clsx('ml-[200px] h-auto !duration-300', collapsed && '!ml-[80px] !duration-600')}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
