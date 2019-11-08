const partial = (func: any, ...boundArgs: any) => (...remainingArgs: any) =>
  func(...boundArgs, ...remainingArgs)

import { setValueTo, getValueFrom } from './core'
import { localStorage } from './browser'

export const setValueToLocalStorage = partial(setValueTo, localStorage)
export const getValueFromLocalStorage = partial(getValueFrom, localStorage)
