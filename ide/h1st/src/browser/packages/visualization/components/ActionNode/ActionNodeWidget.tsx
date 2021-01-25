import { PortWidget } from '@projectstorm/react-diagrams';
import * as React from 'react';
import styled from 'styled-components';

const SubModule = styled.div`
  padding: 12px;
  border-radius: 5px;
  background: #2241b0;
  color: white;
  font-size: 12px;
  margin: 8px;
`;

const ActionNodeWidget = (props: any) => {
  return (
    <div
      className="action-node"
      style={{
        padding: 12,
        border: '2px solid #2241B0',
        borderRadius: 5,
        textAlign: 'center',
      }}
    >
      {props?.node?.options?.name}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {props?.node?.options?.subModels?.map((name: string, idx: number) => (
          <div key={idx}>
            <SubModule>{name}</SubModule>
          </div>
        ))}
      </div>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort('in')}
        style={{
          top: -5,
          left: '50%',
          position: 'absolute',
        }}
      >
        <div
          className="circle-port"
          style={{
            width: 0,
            height: 0,
          }}
        />
      </PortWidget>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort('out')}
        style={{
          bottom: 0,
          left: '50%',
          position: 'absolute',
        }}
      >
        <div
          className="circle-port"
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
          }}
        />
      </PortWidget>
    </div>
  );
};

export { ActionNodeWidget };
