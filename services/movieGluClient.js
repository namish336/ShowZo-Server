import axios from "axios";

const movieGluClient = axios.create({
  baseURL: "https://api-gate2.movieglu.com/",
  headers: {
    client: process.env.MOVIEGLU_CLIENT,
    "x-api-key": process.env.MOVIEGLU_API_KEY,
    authorization: process.env.MOVIEGLU_AUTH,
    territory: "IN",
    "api-version": "v201",
    geolocation: "30.7363;76.7884",
  },
});


// 🔥 Automatically attach fresh datetime on EVERY request
movieGluClient.interceptors.request.use((config) => {
  config.headers["device-datetime"] = new Date().toISOString();
  return config;
});

export default movieGluClient;
