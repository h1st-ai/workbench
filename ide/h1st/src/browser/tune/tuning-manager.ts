import { EnhancedStore } from "@reduxjs/toolkit";

interface ITuningManagerOptions {
  store: EnhancedStore;
}

export class TuningManager {
  private store: EnhancedStore;

  constructor({ store }: ITuningManagerOptions) {
    this.store = store;
  }

  test() {
    console.log("store", this.store);
  }
}
