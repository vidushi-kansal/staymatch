import axios from "https://cdn.skypack.dev/axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:5000/api"
});

export default API;