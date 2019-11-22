import { observable } from 'mobx'

interface IthemeStroe {
  dark: boolean
  toggleTheme: () => void
}

interface clusterStroe {
  id: number
  name: string
  setCluster: (id: number, name: string) => void
}

const themeStroe: IthemeStroe = observable({
  dark: true,
  toggleTheme: () => (themeStroe.dark = themeStroe.dark ? false : true)
})

const clusterStroe: clusterStroe = observable({
  id: 1,
  name: '',
  setCluster: (id: number, name: string) => {
    clusterStroe.id = id
    clusterStroe.name = name
  }
})

export { themeStroe, clusterStroe }
