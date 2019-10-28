import React from 'react'
import { Switch } from 'antd'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../modules'
import { toggleTheme } from '../modules/theme'
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
  const dark = useSelector((state: RootState) => state.theme.dark)
  const dispatch = useDispatch()
  const onChange = () => {
    dispatch(toggleTheme())
    if (dark) {
      Dom.addClassToBody('light')
      Dom.removeClassToBody('dark')
    } else {
      Dom.addClassToBody('dark')
      Dom.removeClassToBody('light')
    }
  }
  return (
    <>
      <ThemeSwitchContainer>
        <Switch
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          checked={dark}
          onChange={onChange}
        />
      </ThemeSwitchContainer>
    </>
  )
}

export default ThemeToggle
