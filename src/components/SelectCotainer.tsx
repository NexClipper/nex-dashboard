import React from 'react'
import { Select } from 'antd'

const { Option } = Select

interface Ioptions {
  value: string
  text: string
}

interface Iprops {
  onChange: (
    value: any,
    option: React.ReactElement<any> | React.ReactElement<any>[]
  ) => void
  options: Ioptions[]
}

const SelectContainer = ({ onChange, options }: Iprops) => {
  return (
    <>
      <Select onChange={onChange}>
        {options.map(option => {
          ;<Option value={option.value}>{option.text}</Option>
        })}
      </Select>
    </>
  )
}

export default React.memo(SelectContainer)
