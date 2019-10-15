import 'antd/dist/antd.css'
import {
  createGlobalStyle,
  GlobalStyleComponent,
  DefaultTheme
} from 'styled-components'
import reset from 'styled-reset'

const globalStyles: GlobalStyleComponent<{}, DefaultTheme> = createGlobalStyle`
    ${reset};
    body {
      background-color: #e5e5e5;
    }
`

export default globalStyles
