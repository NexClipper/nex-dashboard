import React from 'react'
import { Switch } from 'antd'
import styled from 'styled-components'
import { themeStroe } from '../store'
import * as Dom from '../utils/dom'

const ThemeSwitchContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  .ant-switch {
    position: absolute;
    right: 16px;
    top: 52px;
    margin-bottom: 16px;
    background-color: #ecf0f1 !important;
  }
  .ant-switch-checked {
    background-color: #34495e !important;
  }
`

function ThemeToggle() {
  const onChange = () => {
    themeStroe.toggleTheme()
    if (themeStroe.dark) {
      Dom.addClassToBody('dark')
      Dom.removeClassToBody('light')
    } else {
      Dom.addClassToBody('light')
      Dom.removeClassToBody('dark')
    }
  }
  return (
    <>
      <ThemeSwitchContainer>
        <Switch
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          defaultChecked
          onChange={onChange}
        />
      </ThemeSwitchContainer>
    </>
  )
}

export default React.memo(ThemeToggle)
