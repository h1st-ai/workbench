import { createSlice } from "@reduxjs/toolkit";

import { IStore, IKernel } from "../types";

const initialState: IKernel = {
  currentKernel: undefined,
  connectionStatus: "disconnected",
  status: "disconnected",
  executionQueue: [],
};

export const KernelSlice = createSlice({
  name: "kernel",
  initialState,
  reducers: {
    setKernelInfo: (state, { payload }): void => {
      const { kernel } = payload;
      state.currentKernel = kernel;
    },
    listKernel: (state): void => {
      console.log("listKernel");
    },
    setKernelStatus: (state, { payload }): void => {
      state.connectionStatus = payload;
    },
    addCellToQueue: (state, { payload }): void => {
      state.executionQueue.push(payload.id);
    },
    removeCellFromQueue: (state): void => {
      state.executionQueue.shift();
    },
  },
});

// Actions
export const kernelActions = KernelSlice.actions;

// Selector
export const selectKernel = (state: IStore): IKernel => state.kernel;

export default KernelSlice.reducer;
