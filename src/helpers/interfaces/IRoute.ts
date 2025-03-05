export interface IRoute {
  path?: string
  name: string
  exact?: boolean
  component?: any
  props?: any
  icon?: any
  children?: any
  key: string
  layoutType?: string
  subMenu?: IRoute[]
  hideInMenu?: boolean
}

export interface IMenu {
  key: string
  label?: string
  icon?: any
  children?: IMenu[]
  path?: string
  childPath?: string[]
  access?: string[]
  roles?: string[]
  orgLength?: number
}
