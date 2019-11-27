import React from 'react'
import { Select } from 'antd'
import styled from 'styled-components'

const { Option } = Select

const SelectContainer = styled.div`
  .ant-select {
    min-width: 150px;
    max-width: 200px;
  }
`

interface Ioptions {
  value: string
  text: string
}

interface Iprops {
  onChange: (
    value: string,
    option: React.ReactElement<any> | React.ReactElement<any>[]
  ) => void
}

const SelectDate = ({ onChange }: Iprops) => {
  const options: Ioptions[] = [
    {
      value: '15 minute',
      text: 'Last 15 minutes'
    },
    {
      value: '1 hour',
      text: 'Last 1 hours'
    },
    {
      value: '3 hour',
      text: 'Last 3 hours'
    },
    {
      value: '6 hour',
      text: 'Last 6 hours'
    },
    {
      value: '12 hour',
      text: 'Last 12 hours'
    },
    {
      value: '1 day',
      text: 'Last 24 hours'
    },
    {
      value: '2 day',
      text: 'Last 2 days'
    },
    {
      value: '7 day',
      text: 'Last 7 days'
    },
    {
      value: '1 month',
      text: 'Last 30 days'
    }
  ]
  return (
    <SelectContainer>
      <Select defaultValue="15 minute" onChange={onChange}>
        {options.map(option => (
          <Option value={option.value} key={option.text}>
            {option.text}
          </Option>
        ))}
      </Select>
    </SelectContainer>
  )
}

export default React.memo(SelectDate)
