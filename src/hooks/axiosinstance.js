import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: 'https://6836-110-54-169-211.ngrok-free.app/expenseApp/public',
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
    'ngrok-skip-browser-warning': '1', // Add this line
  }
});

const axiosInstance = axios.create({
  baseURL: 'https://6836-110-54-169-211.ngrok-free.app/expenseApp/public',

  headers: {
    'ngrok-skip-browser-warning': '1', // Add this line
  }
});

export { axiosInstance, api };