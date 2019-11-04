import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import TitleContainer from '../components/TitleContainer'

const Event = () => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Event</Breadcrumb.Item>
      </Breadcrumb>
      <TitleContainer level={2} text={'Event'} />
    </>
  )
}

export default Event
