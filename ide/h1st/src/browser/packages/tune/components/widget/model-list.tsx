import * as React from 'react';

function ModelList() {
  React.useEffect(() => {
    (async function() {
      const res = await fetch(
        'https://staging.h1st.ai/project/svvgb7jvke/api/models',
      );
      console.log('model list', res);
    });
  });
  return <div></div>;
}

export default ModelList;
