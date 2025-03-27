import axios from "axios";

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks",
  timeout: 5000,
});

export default customFetch;
