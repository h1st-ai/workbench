import { createSlice } from "@reduxjs/toolkit";

import { IStore, IKernel } from "../types";

const initialState: IKernel = {
  currentKernel: undefined,
  connectionStatus: "disconnected",
  status: "idle",
};

export const KernelSlice = createSlice({
  name: "kernel",
  initialState,
  reducers: {
    listKernel: (state): void => {
      console.log("listKernel");
    },
    setKernelStatus: (state, { payload }): void => {
      state.connectionStatus = payload;
    },
  },
});

// Actions
export const kernelActions = KernelSlice.actions;

// Selector
export const selectKernel = (state: IStore): IKernel => state.kernel;

export default KernelSlice.reducer;
