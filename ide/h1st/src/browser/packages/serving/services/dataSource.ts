const SERVING_URL =
  process.env.SERVING_URL ||
  `${window?.location?.origin + window?.location?.pathname ?? ''}`;

export const getServingServiceURL = (url: string) => `${SERVING_URL}${url}`;

export const getExampleServingServiceURL = (url: string) =>
  `${SERVING_URL}${url}?data=${encodeURI('[1, 2]')}`;
