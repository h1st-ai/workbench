import * as React from 'react';

const DeploymentHistoryTable = () => {
  return (
    <div className="deployment-history-table">
      <table cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Graph</th>
            <th>Status</th>
            <th>Deployed On</th>
            <th>Instance Size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>serve_1</td>
            <td>graphClassName</td>
            <td>Active</td>
            <td>Dec 20, 2020</td>
            <td>Large</td>
          </tr>
          <tr>
            <td>serve_1</td>
            <td>graphClassName</td>
            <td>Active</td>
            <td>Dec 20, 2020</td>
            <td>Large</td>
          </tr>
          <tr>
            <td>serve_1</td>
            <td>graphClassName</td>
            <td>Active</td>
            <td>Dec 20, 2020</td>
            <td>Large</td>
          </tr>
          <tr>
            <td>serve_1</td>
            <td>graphClassName</td>
            <td>Active</td>
            <td>Dec 20, 2020</td>
            <td>Large</td>
          </tr>
          <tr>
            <td>serve_1</td>
            <td>graphClassName</td>
            <td>Active</td>
            <td>Dec 20, 2020</td>
            <td>Large</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Information = () => {
  return (
    <div className="serving-right serving-information">
      <DeploymentHistoryTable />
    </div>
  );
};

export { Information };
