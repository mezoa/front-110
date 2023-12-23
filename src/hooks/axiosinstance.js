import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: 'https://0ae9-49-148-169-139.ngrok-free.app/expenseApp/public',
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
    'ngrok-skip-browser-warning': '1', // Add this line
  }
});

const axiosInstance = axios.create({
  baseURL: 'https://0ae9-49-148-169-139.ngrok-free.app/expenseApp/public',
  headers: {
    'ngrok-skip-browser-warning': '1', // Add this line
  }
});

export { axiosInstance, api };