const SERVING_URL = process.env.SERVING_URL || 'https://staging.h1st.ai';

export const getServingServiceURL = (url: string) => `${SERVING_URL}${url}`;

export const getExampleServingServiceURL = (url: string) =>
  `${SERVING_URL}${url}?data=${encodeURI('[1, 2]')}`;
