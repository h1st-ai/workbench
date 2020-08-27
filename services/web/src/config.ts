const dev = {
  API: {
    URL: '/api',
  },
  AUTH: {
    URL: 'http://localhost/access/auth',
  },
};

const prod = {
  API: {
    URL: '/api',
  },
  AUTH: {
    URL: 'http://cloud.h1st.at/auth',
  },
};

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

export default {
  ...config,
};
