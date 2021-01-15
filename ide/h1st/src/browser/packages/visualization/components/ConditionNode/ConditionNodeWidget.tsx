import { PortWidget } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { log } from '../../services/logging';

const ConditionNodeWidget = (props: any) => {
  log('condition node widget', props);
  const { node } = props;
  const { ports } = node;

  const haveBoth = React.useMemo(() => {
    return (
      Object.keys(ports?.outYes?.links).length > 0 &&
      Object.keys(ports.outNo?.links).length > 0
    );
  }, [ports?.outYes?.links, ports?.outNo?.links]);

  console.log('haveBoth', haveBoth);
  return (
    <div className="start-node">
      <svg
        width={200}
        height={122}
        dangerouslySetInnerHTML={{
          __html: `<g>
          <path d="M 1 60 L 100 0 L 200 60 L 100 120 Z" fill="#ffffff" stroke="#2241B0" stroke-width="2" stroke-miterlimit="10" pointer-events="all"></path>
          <text x="50%" y="50%" fill="#2241B0" style="font: 14px sans-serif; white-space: pre-line;
          text-anchor: middle;">${props.node?.options?.name ?? ''}</text>
          </g>`,
        }}
      ></svg>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort('in')}
        style={{
          // left: props.size - 8,
          // top: -10,
          top: 0,
          left: '50%',
          position: 'absolute',
        }}
      >
        <div className="circle-port" />
      </PortWidget>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort('outYes')}
        style={{
          // left: props.size - 8,
          // top: -10,
          top: haveBoth ? '48%' : '95%',
          left: haveBoth ? 0 : '50%',
          position: 'absolute',
        }}
      >
        <div className="circle-port" />
      </PortWidget>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort('outNo')}
        style={{
          // left: props.size - 8,
          // top: -10,
          top: haveBoth ? '48%' : '95%',
          right: haveBoth ? 0 : '50%',
          position: 'absolute',
        }}
      >
        <div
          className="circle-port"
          style={
            {
              // width: 10,
              // height: 10,
            }
          }
        />
      </PortWidget>
    </div>
  );
};

export { ConditionNodeWidget };
