import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const fetchAlerts = () => API.get("/alerts");
export const fetchMap = () => API.get("/alerts/map");
export const fetchGraph = () => API.get("/anomaly/graph");
export const fetchPrediction = () => API.get("/prediction");
export const fetchAllZones = () => API.get("/analysis/");
export const fetchRisk = () => API.get("/risk/top");
export const sendQuery = (question) =>
  API.post("/query", { question });
