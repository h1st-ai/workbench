const dev = {
  API: {
    URL: 'http://localhost/api',
  },
  AUTH: {
    URL: 'http://localhost/access/auth',
  },
};

const prod = {
  API: {
    URL: 'https://cloud.h1st.ai/api',
  },
  AUTH: {
    URL: 'https://cloud.h1st.ai/auth',
  },
};

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

export default {
  ...config,
};
