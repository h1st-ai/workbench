const uniqid = require("uniqid");

export const DEFAULT_CELL = {
  cell_type: "code",
  execution_count: 0,
  metadata: {},
  outputs: [],
  source: [],
};

export const createNewCellStructure = () => {
  return {
    ...DEFAULT_CELL,
    id: uniqid(),
  };
};
