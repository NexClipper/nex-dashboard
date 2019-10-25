import 'antd/dist/antd.css'
// import '../styles/antdDark.less'
import {
  createGlobalStyle,
  GlobalStyleComponent,
  DefaultTheme
} from 'styled-components'
import reset from 'styled-reset'

const globalStyles: GlobalStyleComponent<{}, DefaultTheme> = createGlobalStyle`
    ${reset};
    body.dark {
      color: rgba(255, 255, 255, 0.65);
      background-color: #30303d;
      .ant-layout {
        color: rgba(255, 255, 255, 0.65) !important;
        background-color: #30303d !important;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: rgba(255, 255, 255, 0.85);
      }
    }
`

export default globalStyles
