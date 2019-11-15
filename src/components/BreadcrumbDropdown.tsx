import React from 'react'
import { Menu, Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

export interface IbreadcrumbDropdownMenu {
  id?: number
  link?: string
  text: string
  onClick?: () => void
}

interface Iprops {
  overlayMenu: IbreadcrumbDropdownMenu[]
  dropdownText: string
}

const MenuItem = (item: IbreadcrumbDropdownMenu) => {
  return (
    <Menu.Item key={item.text} onClick={item.onClick}>
      {item.link ? (
        <Link to={item.link} replace>
          {item.text}
        </Link>
      ) : (
        <>{item.text}</>
      )}
    </Menu.Item>
  )
}

const BreadcrumbDropdown = ({ overlayMenu, dropdownText }: Iprops) => {
  const menu = <Menu>{overlayMenu.map(item => MenuItem(item))}</Menu>
  return <Breadcrumb.Item overlay={menu}>{dropdownText}</Breadcrumb.Item>
}

export default React.memo(BreadcrumbDropdown)
