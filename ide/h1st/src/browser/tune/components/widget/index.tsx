import * as React from 'react';

function ExperimentContent() {
  React.useEffect(() => {
    (async function() {
      const res = await fetch(
        'https://staging.h1st.ai/project/q3pfv1rwqv/api/models',
      );
      console.log('model list', res);
    })();
  });
  return <div></div>;
}

export default ExperimentContent;
