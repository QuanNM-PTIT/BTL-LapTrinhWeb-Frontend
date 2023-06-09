import axios from "axios";

axios.defaults.baseURL = "https://web-production-92e4.up.railway.app/";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');