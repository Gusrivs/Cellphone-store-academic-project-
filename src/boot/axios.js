import { defineBoot } from '#q-app'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://couchdbbackend.esaapp.com', // Replace with your API base URL
  username: 'fpiimagenes',
  password: 'OdioFirebaseCerroStorage2026uesMINERV', // Ahi le falta una a al final, es que me da miedo hacer pruebas todavia
})

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
