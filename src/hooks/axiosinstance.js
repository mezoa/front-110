import axios from "axios";
import Cookies from "js-cookie";
const axiosInstance = axios.create({
  baseURL: 'http://expenseapp.test',
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`
  }
});

export default axiosInstance;