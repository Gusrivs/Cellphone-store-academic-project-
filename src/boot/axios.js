import { defineBoot } from '#q-app'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5984/fpi-imagenes',
})

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
