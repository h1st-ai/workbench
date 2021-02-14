import { exec } from 'child_process';
import {
  END_TYPE,
  START_TYPE,
} from '../browser/packages/visualization/components/graph/consts';
import { IEdge } from '../browser/packages/visualization/types';

const execCommand = (command: string) => {
  return new Promise((res, rej) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        rej(err);
        return;
      }

      res(stdout);
    });
  });
};

const isEdgeExist = (edges: IEdge[], edge: IEdge): boolean =>
  edges.some(
    checkingEdge =>
      checkingEdge.source === edge.source &&
      checkingEdge.target === edge.target,
  );

const nameToTypeMapping: { [key: string]: string } = {
  start: START_TYPE,
  end: END_TYPE,
  condition: 'condition',
};

const convertNameToType = (name: string): string => nameToTypeMapping[name];

export { execCommand, isEdgeExist, convertNameToType };
