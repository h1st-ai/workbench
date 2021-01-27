import axios from 'axios';

const BASE_URL = process.env.TUNE_URL || 'https://staging.h1st.ai';
const SERVING_URL = process.env.SERVING_URL || 'https://staging.h1st.ai';

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

export const stopServingDeployment = async (
  classname: string,
  version: number,
) => {
  try {
    await axios.delete(`${BASE_URL}/api/deployments/${classname}/${version}`);
  } catch (error) {}
};

export const getServingServiceURL = (url: string) => `${SERVING_URL}${url}`;

export const getExampleServingServiceURL = (url: string) =>
  `${SERVING_URL}${url}?data=${encodeURI('[1, 2]')}`;
