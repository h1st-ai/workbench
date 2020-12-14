import {
  DagreEngine,
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
import { initGraph, initGraphEngine } from "./utils";

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

  /*
    Set up darge engine to distribute
  */
  const dargeEngine = new DagreEngine({
    graph: {
      rankdir: "TB",
      // align: "UD",
      ranker: "longest-path",
      marginx: 25,
      marginy: 25,
    },
    includeLinks: true,
  });

  const redistribute = () => {
    dargeEngine.redistribute(model);

    engine
      .getLinkFactories()
      .getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME)
      .calculateRoutingMatrix();
    engine.repaintCanvas();
  };

  const populateGraph = async (graph: string) => {
    const { nodes = [], edges = [] } = await fetchGraphDetail(graph);

    initGraph({
      edges,
      nodes,
      pathfinding,
      model,
    });

    await engine.repaintCanvas(true);
    setTimeout(() => {
      redistribute();
    }, 20);
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

  return <GraphContainer engine={engine} model={model} />;
};

export default Wrapper;
