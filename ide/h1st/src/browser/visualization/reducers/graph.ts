import { createSlice } from "@reduxjs/toolkit";

import { IGraph, IVisualizationStore } from "../types";

const NODE_KEY = "id";

const initialState: IGraph = {
  nodes: [],
  edges: [],
  selected: undefined,
};

const getNodeIndex = (graph: IGraph, searchNode: any) => {
  return graph.nodes.findIndex((node) => {
    return node[NODE_KEY] === searchNode[NODE_KEY];
  });
};

// Helper to find the index of a given edge
const getEdgeIndex = (graph: IGraph, searchEdge: any) => {
  return graph.edges.findIndex((edge) => {
    return (
      edge.source === searchEdge.source && edge.target === searchEdge.target
    );
  });
};

export const GraphSlice = createSlice({
  name: "kernel",
  initialState,
  reducers: {
    setSelected: (state, { payload }) => {
      const { selected } = payload;
      state.selected = selected;
    },
    setNodes: (state, { payload }): void => {
      const { nodes = [] } = payload;
      state.nodes = nodes;
    },

    setEdges: (state, { payload }): void => {
      const { edges = [] } = payload;
      state.edges = edges;
    },

    setGraph: (state, { payload }): void => {
      const { nodes = [], edges = [] } = payload;
      state.nodes = nodes;
      state.edges = edges;
    },

    addEdge: (state, { payload }): void => {
      const { edge } = payload;

      state.edges.push(edge);
    },

    updateNode: (state, { payload }) => {
      const { node } = payload;
      const i = getNodeIndex(state, node);

      state.nodes[i] = node;
    },

    createNode: (state, { payload }) => {
      const { node } = payload;
      state.nodes.push(node);
    },
    swapEdge: (state, { payload }): void => {
      const { viewEdge, sourceViewNode, targetViewNode } = payload;
      const i = getEdgeIndex(state, viewEdge);
      const edge = JSON.parse(JSON.stringify(state.edges[i]));

      edge.source = sourceViewNode[NODE_KEY];
      edge.target = targetViewNode[NODE_KEY];

      state.edges[i] = edge;
    },
    deleteNode: (graph, { payload }) => {
      const { node, nodeArr } = payload;
      // Delete any connected edges
      const newEdges = graph.edges.filter((edge, i) => {
        return edge.source !== node[NODE_KEY] && edge.target !== node[NODE_KEY];
      });

      graph.nodes = nodeArr;
      graph.edges = newEdges;
    },

    deleteEdge: (graph, { payload }) => {
      const { edges } = payload;
      graph.edges = edges;
    },
  },
});

// Actions
export const graphActions = GraphSlice.actions;

// Selector
export const selectGraph = (state: IVisualizationStore): IGraph => state.graph;

export default GraphSlice.reducer;
