import React, { ReactNode, ReactChild } from 'react'
import styled from 'styled-components'

const InfoContainerBox = styled.ul`
  display: flex;
  margin: 0;
  flex-wrap: wrap;
  li {
    width: 50%;
    margin-top: 16px;
    &:nth-child(1),
    :nth-child(2) {
      margin: 0;
    }
  }
  p {
    margin: 0;
  }
  .title {
    font-weight: 700;
    font-size: 1.25rem;
  }
`

interface IinfoContainer {
  children: ReactNode[] | ReactChild
}

function InfoContainer({ children }: IinfoContainer) {
  return <InfoContainerBox>{children}</InfoContainerBox>
}

export default InfoContainer
