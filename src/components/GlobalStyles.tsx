import 'antd/dist/antd.css'
import '../styles/darkTheme.scss'
import {
  createGlobalStyle,
  GlobalStyleComponent,
  DefaultTheme
} from 'styled-components'
import reset from 'styled-reset'

const globalStyles: GlobalStyleComponent<{}, DefaultTheme> = createGlobalStyle`
    ${reset};
`

export default globalStyles
