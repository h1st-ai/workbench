import * as React from 'react';
import { Provider } from 'react-redux';
import Graph from '../components/graph/Graph';

export const GraphContainer = (props: { store: any }) => {
  return (
    <div style={{ height: '100%' }}>
      <Provider store={props.store}>
        <Graph />
      </Provider>
    </div>
  );
};
