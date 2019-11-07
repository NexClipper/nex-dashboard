import React from 'react'
import { Menu, Breadcrumb } from 'antd'
import { Link, useHistory } from 'react-router-dom'

export interface IbreadcrumbDropdownMenu {
  id?: number
  link: string
  text: string
}

interface Iprops {
  overlayMenu: IbreadcrumbDropdownMenu[]
  dropdownText: any
}

const MenuItem = (item: IbreadcrumbDropdownMenu) => {
  return (
    <Menu.Item>
      <Link to={item.link} replace>
        {item.text}
      </Link>
    </Menu.Item>
  )
}

const BreadcrumbDropdown = ({ overlayMenu, dropdownText }: Iprops) => {
  const menu = <Menu>{overlayMenu.map(item => MenuItem(item))}</Menu>
  return <Breadcrumb.Item overlay={menu}>{dropdownText}</Breadcrumb.Item>
}

export default React.memo(BreadcrumbDropdown)
