import { defineBoot } from '#q-app'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.QCLI_COUCHDB_BASE_URL,
  auth: {
    username: import.meta.env.QCLI_COUCHDB_USERNAME,
    password: import.meta.env.QCLI_COUCHDB_PASSWORD,
  },
})

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
