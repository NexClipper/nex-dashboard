const isEmpty = (storage: Storage) => {
  return !storage
}

export const getValueFrom = (storage: Storage, key: string) => {
  if (isEmpty(storage)) return
  const rawData = storage.getItem(key)
  if (!rawData) return
  return JSON.parse(rawData)
}

export const setValueTo = (storage: Storage, key: string, data: any) => {
  if (isEmpty(storage)) {
    return
  }
  return storage.setItem(key, JSON.stringify(data))
}
