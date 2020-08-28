import config from 'config';

export function makeApiParams({
  url,
  method,
  token,
  headers = {},
  ...rest
}: any) {
  return {
    url: `${config.API.URL}/${url}`,
    method,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    ...rest,
  };
}
