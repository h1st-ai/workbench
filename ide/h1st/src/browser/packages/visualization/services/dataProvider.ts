import {
  ACTION_TYPE,
  SPECIAL_TYPE,
  START_TYPE,
  END_TYPE,
  SPECIAL_EDGE_TYPE,
} from "../components/graph/elements";
import { IEdge, INode } from "../types";
import { log } from "./logging";

const API_ENDPOINT = process.env.TUNE_SERVER || "http://localhost:3002";
const fetchModules = async () => {
  const fetchModulesResponse = await fetch(`${API_ENDPOINT}/api/graphs`);
  return fetchModulesResponse.json();
};

const fetchGraphDetail = async (graphName: string) => {
  const graphDetailResponse = await fetch(
    `${API_ENDPOINT}/api/graphs/${graphName}/topology`
  );

  return graphDetailResponse.json();
};

const isEdgeExist = (edges: IEdge[], edge: IEdge): boolean =>
  edges.some(
    (checkingEdge) =>
      checkingEdge.source === edge.source && checkingEdge.target === edge.target
  );

const nameToTypeMapping: { [key: string]: string } = {
  start: START_TYPE,
  end: END_TYPE,
  dicision: SPECIAL_TYPE,
};

const convertNameToType = (name: string): string => nameToTypeMapping[name];

const fetchModuleGraphs = async (graphs: string[]) => {
  const graphDetails = await Promise.all(
    graphs.map((graph) => fetchGraphDetail(graph))
  );

  const graphNode: { [key: string]: {} } = {};
  const graphEdges: IEdge[] = [];

  graphDetails.forEach((graphDetail) => {
    const nodeNames = Object.keys(graphDetail);

    // Init node if not exist
    nodeNames.forEach((name: string) => {
      if (!graphNode[name]) {
        graphNode[name] = {
          id: name,
          name: graphDetail[name].node_name,
          title: graphDetail[name].node_name,
          type: convertNameToType(graphDetail[name].node_name) ?? ACTION_TYPE,
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
  });

  return {
    nodes: Object.keys(graphNode).map((name) => graphNode[name]) as INode[],
    edges: graphEdges,
  };
};

const fetchGraph = async (): Promise<{
  nodes: INode[];
  edges: IEdge[];
}> => {
  try {
    const modulesResponse = await fetchModules();

    const modules = Object.keys(modulesResponse);

    const modulesGraphs = await Promise.all(
      modules.map((module) => fetchModuleGraphs(modulesResponse[module]))
    );
    let { nodes, edges } = modulesGraphs.reduce(
      ({ nodes, edges }, module) => {
        nodes.push(...module.nodes);
        edges.push(...module.edges);

        return {
          nodes,
          edges,
        };
      },
      { nodes: [], edges: [] }
    );

    return { nodes, edges };
  } catch (error) {
    log("fetch graph error", { error });
  }

  return {
    nodes: [],
    edges: [],
  };

  // const graphsDetails = await Promise.all(graphs.map((graph) => {

  // })
};

export { fetchGraph };
