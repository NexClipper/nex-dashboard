import axios from 'axios'

const isLocal = process.env.REACT_APP_LOCAL === 'local'

const instance = axios.create({
  //   baseURL: 'http://192.168.2.110:32012/api/',
  baseURL:
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_URL_DEV
      : process.env.REACT_APP_API_PROD,
  params: {},
  headers: { 'Access-Control-Allow-Origin': '*' }
})

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default {
  getData(action: string, data?: any) {
    return instance.get(action, data)
  },
  postData(action: string, data?: any) {
    return instance.post(action, data)
  },
  putData(action: string, data?: any) {
    return instance.put(action, data)
  },
  deleteData(action: string) {
    return instance.delete(action)
  }
}
