import axios from "axios";
import axiosRetry from "axios-retry";

const api = axios.create({
  baseURL:"http://localhost:8080/api/v1"
})

axiosRetry(api, { retries: 4 })

export { api }