import {
  createStandardAction,
  ActionType,
  createReducer
} from 'typesafe-actions'

const TOGGLE_THEME = 'theme/TOGGLE_THEME'

export const toggleTheme = createStandardAction(TOGGLE_THEME)()

const actions = { toggleTheme }
type ThemeAction = ActionType<typeof actions>

type ThemeState = {
  dark: boolean
}

const initialState: ThemeState = {
  dark: true
}

const theme = createReducer<ThemeState, ThemeAction>(initialState, {
  [TOGGLE_THEME]: state => ({ dark: !state.dark })
})

export default theme
