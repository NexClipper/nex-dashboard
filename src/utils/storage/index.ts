import {
  setValueToLocalStorage,
  getValueFromLocalStorage
} from './localStorage'

const LOCAL_STORAGE_KEY = '__felog_local_storage_key__'

export const getData = () => getValueFromLocalStorage(LOCAL_STORAGE_KEY)

export const setData = (val: any) =>
  setValueToLocalStorage(LOCAL_STORAGE_KEY, val)
