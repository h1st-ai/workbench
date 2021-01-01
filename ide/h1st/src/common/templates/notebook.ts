export default (workspace: string, modelName: string) => {
  const structure = {
    cells: [
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "### H1st Configuration ###\n",
          "'''\n",
          "This part configures the default variable names for various step of the modelling process.\nModify with care.\n",
          "'''\n",
          `VAR_MODEL_FILE = '${modelName}.py'\n`,
          "VAR_MODEL = 'm'\n",
          "VAR_LOADED_DATA = 'loaded_data'\n",
          "VAR_PREPARED_DATA = 'prepared_data'\n",
          "VAR_PREDICTED_VALUE = 'predicted_val'\n",
          "\n",
          "\n",
          "%load_ext autoreload\n",
          "%autoreload 3",
          "\n",
          "import h1st as h1\n",
          "h1.init()\n",
          "### End H1st Configuration ###",
        ],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          `from ${workspace}.models.${modelName} import ${modelName} \n`,
          `m = ${modelName}()`,
        ],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: ["loaded_data = m.load_data()\n", "loaded_data"],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: ["prepared_data = m.prep_data(loaded_data)\n", "prepared_data"],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: ["m.train(prepared_data)"],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "eval_data = {} # Load evaluation data\n",
          "m.evaluate(eval_data)",
        ],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: ["m.persist()"],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "predict_data = {} # Get your data \n",
          "predicted_val = m.predict(predict_data)",
        ],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [],
      },
    ],
    metadata: {
      language_info: {
        codemirror_mode: {
          name: "ipython",
          version: 3,
        },
        file_extension: ".py",
        mimetype: "text/x-python",
        name: "python",
        nbconvert_exporter: "python",
        pygments_lexer: "ipython3",
        version: "3.7.7-final",
      },
      orig_nbformat: 2,
      kernelspec: {
        name: "",
        display_name: "",
      },
    },
    nbformat: 4,
    nbformat_minor: 2,
  };

  return JSON.stringify(structure, null, 2);
};

export const blankTemplate = {
  cells: [
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [],
    },
  ],
  metadata: {
    language_info: {
      codemirror_mode: {
        name: "ipython",
        version: 3,
      },
      file_extension: ".py",
      mimetype: "text/x-python",
      name: "python",
      nbconvert_exporter: "python",
      pygments_lexer: "ipython3",
      version: "3.7.7-final",
    },
    orig_nbformat: 2,
    kernelspec: {
      name: "",
      display_name: "",
    },
  },
  nbformat: 4,
  nbformat_minor: 2,
};
