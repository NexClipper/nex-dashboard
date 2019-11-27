import React from 'react'
import { Typography } from 'antd'

const { Title } = Typography

interface Iprops {
  level: 1 | 2 | 3 | 4
  text: string | null
}

const TitleContainer = ({ level, text }: Iprops) => {
  return (
    <>
      <Title level={level}>{text}</Title>
    </>
  )
}

export default React.memo(TitleContainer)
