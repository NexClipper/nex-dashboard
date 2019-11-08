const TOGGLE_THEME = 'theme/TOGGLE_THEME' as const

export const toggleTheme = () => ({
  type: TOGGLE_THEME
})

type ThemeAction = ReturnType<typeof toggleTheme>

export type ThemeState = {
  dark: boolean
}

const initialState: ThemeState = {
  dark: true
}

const theme = (
  state: ThemeState = initialState,
  action: ThemeAction
): ThemeState => {
  switch (action.type) {
    case TOGGLE_THEME:
      return { dark: !state.dark }
    default:
      return state
  }
}

export default theme
