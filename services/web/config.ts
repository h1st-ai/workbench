const dev = {
  API: {
    URL: 'http://localhost:3000',
  },
};

const prod = {
  API: {
    URL: '/api',
  },
};

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

export default {
  ...config,
};
