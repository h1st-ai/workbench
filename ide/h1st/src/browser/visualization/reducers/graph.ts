import { createSlice } from "@reduxjs/toolkit";

import { IGraph, IVisualizationStore } from "../types";

const initialState: IGraph = {
  nodes: [],
  edges: [],
};

export const GraphSlice = createSlice({
  name: "kernel",
  initialState,
  reducers: {
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
  },
});

// Actions
export const graphActions = GraphSlice.actions;

// Selector
export const selectGraph = (state: IVisualizationStore): IGraph => state.graph;

export default GraphSlice.reducer;
