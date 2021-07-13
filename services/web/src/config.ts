const dev = {
  API: {
    URL: 'http://localhost/api',
  },
  AUTH: {
    URL: 'https://login.h1st.ai/auth',
  },
};

const staging = {
  API: {
    URL: 'https://builder-stg.aitomatic.com/api',
  },
  AUTH: {
    URL: 'https://login.h1st.ai/auth',
  },
};

const prod = {
  API: {
    URL: 'https://builder.aitomatic.com/api',
  },
  AUTH: {
    URL: 'https://login.h1st.ai/auth',
  },
};

let config = dev;

if (process.env.REACT_APP_STAGE === 'production') {
  config = prod;
} else if (process.env.REACT_APP_STAGE === 'staging') {
  config = staging;
}

export default {
  ...config,
};
