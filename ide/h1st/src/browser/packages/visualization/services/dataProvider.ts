import {
  ACTION_TYPE,
  START_TYPE,
  END_TYPE,
  SPECIAL_EDGE_TYPE,
} from '../components/graph/consts';
import { IEdge, INode } from '../types';
import { log } from './logging';
// import { log } from "./logging";

const API_ENDPOINT = process.env.TUNE_SERVER || 'http://localhost:3003';

const fetchModules = async () => {
  const fetchModulesResponse = await fetch(`${API_ENDPOINT}/api/graphs`);
  const modules = await fetchModulesResponse.json();

  const graphs = Object.keys(modules).reduce(
    (graphs: string[], module: string) => {
      graphs.push(...modules[module]);
      return graphs;
    },
    [],
  );

  return graphs;
};

const fetchGraphDetail = async (graphName: string) => {
  const graphDetailResponse = await fetch(
    `${API_ENDPOINT}/api/graphs/${graphName}/topology`,
  );

  const graphDetail = await graphDetailResponse.json();

  const graphNode: { [key: string]: {} } = {};
  const graphEdges: IEdge[] = [];

  const nodeNames = Object.keys(graphDetail);

  nodeNames.forEach((name: string) => {
    if (!graphNode[name]) {
      // Init node if not exist
      graphNode[name] = {
        id: name,
        name: graphDetail[name].node_name,
        title: graphDetail[name].node_name,
        subModels: graphDetail[name].ensemble_sub_models,
        type:
          convertNameToType(graphDetail[name].node_name) ?? // to handle start, end
          convertNameToType(graphDetail[name].node_type) ?? // to handle decisions
          ACTION_TYPE,
        // x: Math.random() * 1000,
        // y: Math.random() * 1000,
      };
    }
    const { edges = [] } = graphDetail[name];

    edges.forEach((edge: any) => {
      if (edge.next_node_id) {
        const newEdge = {
          handleText: edge.edge_label,
          source: name,
          target: edge.next_node_id,
          type: SPECIAL_EDGE_TYPE,
        };
        if (!isEdgeExist(graphEdges, newEdge)) {
          graphEdges.push(newEdge);
        }
      }
    });
  });

  return {
    nodes: Object.keys(graphNode).map(name => graphNode[name]) as INode[],
    edges: graphEdges,
  };
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

const fetchModuleGraphs = async (graphs: string[]) => {
  const graphDetails = await Promise.all(
    graphs.map(graph => fetchGraphDetail(graph)),
  );
  log('graph deail', graphDetails);
};

const fetchGraph = async (): Promise<{
  nodes: INode[];
  edges: IEdge[];
}> => {
  return {
    nodes: [],
    edges: [],
  };
};

export { fetchGraph, fetchModules, fetchGraphDetail, fetchModuleGraphs };
