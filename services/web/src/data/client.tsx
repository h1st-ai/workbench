import config from 'config';
import store from '../stores';

export function makeApiParams({ url, method, headers = {}, ...rest }: any) {
  const state = store.getState();

  return {
    url: `${config.API.URL}/${url}`,
    method,
    headers: {
      ...headers,
      Authorization: `Bearer ${state.auth.token}`,
    },
    ...rest,
  };
}
