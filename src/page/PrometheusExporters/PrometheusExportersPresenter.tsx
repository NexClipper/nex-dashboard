import React from 'react'
import { List, Card, Breadcrumb } from 'antd'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import TitleContainer from '../../components/TitleContainer'

const ListBox = styled.div`
  .ant-list .ant-card-body {
    height: 180px;
  }
`

const CoverImageContainr = styled.div`
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 120px !important;
  img {
    display: inline-block;
    max-width: 120px;
    max-height: 120px;
    padding: 16px;
  }
`

interface Iprops {
  data: IprometheusExportersData[]
}

const PrometheusExportersPresenter = ({ data }: Iprops) => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Prometheus Exporters</Breadcrumb.Item>
      </Breadcrumb>
      <TitleContainer level={2} text={'Prometheus Exporters'} />
      <ListBox>
        <List
          grid={{ gutter: 8, column: 4 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <a href={item.link} target="blank" title={item.title}>
                <Card
                  hoverable
                  cover={
                    <CoverImageContainr>
                      <img
                        src={
                          item.image_lik
                            ? item.image_lik
                            : 'PrometheusExportersLogos/Prometheus.svg'
                        }
                        alt={item.title}
                      />
                    </CoverImageContainr>
                  }
                >
                  <Card.Meta
                    title={item.title}
                    description={item.description}
                  />
                </Card>
              </a>
            </List.Item>
          )}
        />
      </ListBox>
    </>
  )
}

export default PrometheusExportersPresenter
