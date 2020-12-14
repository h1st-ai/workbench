import {
  DiagramEngine,
  DiagramModel,
  PathFindingLinkFactory,
} from "@projectstorm/react-diagrams";
import * as React from "react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { GraphCanvasWidget } from "./GraphCanvasWidget";
import { fetchGraphDetail, fetchModules } from "../../services/dataProvider";
import { ChooseGraphModal } from "../ChooseGraphDialog";
import { log } from "../../services/logging";
import { initGraph, initGraphEngine, redistribute } from "./utils";

const GraphContainer = ({
  engine,
  model,
}: {
  engine: DiagramEngine;
  model: DiagramModel;
}) => {
  const [showChooseGraphModal, setShowChooseGraphModal] = React.useState(false);
  const [graphs, setGraphs] = React.useState<string[]>([]);

  const pathfinding = engine
    .getLinkFactories()
    .getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME);

  const populateGraph = async (graph: string) => {
    const { nodes = [], edges = [] } = await fetchGraphDetail(graph);

    initGraph({
      edges,
      nodes,
      pathfinding,
      model,
    });

    await engine.repaintCanvas(true);
  };

  const fetchData = async () => {
    const graphs = await fetchModules();
    if (graphs.length > 0) {
      setGraphs(graphs);
      setShowChooseGraphModal(true);
      return;
    }

    const [graph] = graphs;
    if (graph) {
      populateGraph(graph);
    }
  };

  const handleSelectGraph = (graph: string) => {
    populateGraph(graph);
    setShowChooseGraphModal(false);
    log("Graph selected", graph);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <GraphCanvasWidget>
      <CanvasWidget engine={engine} />
      {showChooseGraphModal && (
        <ChooseGraphModal
          graphs={graphs}
          handleSelectGraph={handleSelectGraph}
        />
      )}
    </GraphCanvasWidget>
  );
};

const Wrapper = () => {
  const engine = initGraphEngine();
  const model = new DiagramModel();

  // Load model into engine
  engine.setModel(model);

  model.registerListener({
    eventDidFire: (event: any) => {
      const { isCreated } = event;

      if (isCreated) {
        setImmediate(() => {
          redistribute({ model, engine });
        });
      }
    },
  });

  return <GraphContainer engine={engine} model={model} />;
};

export default Wrapper;
