import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const SERVING_URL = 'http://localhost:8000';

export const getServingDeployments = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/deployments`);
    return res.data;
  } catch (error) {
    return [];
  }
};

export const removeServingDeployment = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/api/deployments-history/${id}`);
  } catch (error) {}
};

export const stopServingDeployment = async (classname: string) => {
  try {
    await axios.delete(`${BASE_URL}/api/deployments/${classname}`);
  } catch (error) {}
};

export const getServingServiceURL = (url: string) => `${SERVING_URL}${url}`;

export const getExampleServingServiceURL = (url: string) =>
  `${SERVING_URL}${url}?data=[1, 2]`;
