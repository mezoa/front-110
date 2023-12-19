import axios from "axios";
import Cookies from "js-cookie";
const api = axios.create({
  baseURL: 'http://expenseapp.test',
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`
  }
});

const axiosInstance = axios.create({
  baseURL: 'http://expenseapp.test',
});

export { axiosInstance, api };