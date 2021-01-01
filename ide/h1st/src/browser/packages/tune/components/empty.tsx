import * as React from 'react';

export function EmptyComponent() {
  return (
    <div className="experiment-empty">
      <p>No experiments found</p>
      <button>New Experiment</button>
    </div>
  );
}
