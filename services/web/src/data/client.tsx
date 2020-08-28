import config from 'config';

export function makeApiParams({ url, method, headers = {}, token }: any) {
  return {
    url: `${config.API.URL}/${url}`,
    method,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
}
