import createEngine, {
  DagreEngine,
  DefaultPortModel,
  DiagramEngine,
  DiagramModel,
  PathFindingLinkFactory,
  PortModel,
  PortModelGenerics,
} from "@projectstorm/react-diagrams";
import * as React from "react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { GraphCanvasWidget } from "./GraphCanvasWidget";
import { ActionNodeFactory, ActionNodeModel } from "../ActionNode";
import { StartNodeFactory, StartNodeModel } from "../StartNode";
import { ConditionNodeFactory, ConditionNodeModel } from "../ConditionNode";
import { EndNodeFactory, EndNodeModel } from "../EndNode";
import { AdvancedLinkFactory } from "../DirectedLink";
import { CustomLabelFactory, CustomtLabelModel } from "../CustomLabel";
import { fetchGraphDetail, fetchModules } from "../../services/dataProvider";
import { ChooseGraphModal } from "../ChooseGraphDialog";
import { log } from "../../services/logging";

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
    const graphModel = model;
    const nodeObj: { [key: string]: any } = {};
    nodes.forEach((node, idx) => {
      const { name, type } = node;
      // log("model add node", type);
      switch (type) {
        case "start":
          const startNode = new StartNodeModel();
          nodeObj[name ?? `start-${idx}`] = startNode;
          graphModel.addNode(startNode);
          break;
        case "action":
          const actionNode = new ActionNodeModel({
            name,
          });
          nodeObj[name ?? `action-${idx}`] = actionNode;
          graphModel.addNode(actionNode);
          break;
        case "condition":
          const conditionNode = new ConditionNodeModel({
            name,
          });
          nodeObj[name ?? `condition-${idx}`] = conditionNode;
          graphModel.addNode(conditionNode);
          break;
        case "end":
          const endNode = new EndNodeModel({
            name,
          });
          nodeObj[name ?? `end-${idx}`] = endNode;
          graphModel.addNode(endNode);
          break;
      }
    });

    edges.forEach((edge) => {
      const { source, target, handleText } = edge;
      if (nodeObj[source]) {
        let outPort, inPort;
        if (nodeObj[source] instanceof ConditionNodeModel) {
          if (handleText === "yes") {
            outPort = nodeObj[source].getPort("outYes");
          } else {
            outPort = nodeObj[source].getPort("outNo");
          }
        } else {
          outPort = nodeObj[source].getPort("out") as DefaultPortModel;
        }
        inPort = nodeObj[target].getPort("in");
        const link = outPort?.link(
          inPort as PortModel<PortModelGenerics>,
          pathfinding
        );
        link.addLabel(
          new CustomtLabelModel({
            label: handleText ?? "",
            offsetY: 5,
          })
        );
        // log("model add link");
        graphModel.addLink(link);
      }
    });

    await engine.repaintCanvas(true);
    setTimeout(() => {
      redistribute();
    }, 20);
  };

  const initGraph = async () => {
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
    initGraph();
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
  // Setting the diagram engine
  const engine = createEngine();

  // Setup Factories
  engine.getNodeFactories().registerFactory(new ActionNodeFactory());
  engine.getNodeFactories().registerFactory(new StartNodeFactory());
  engine.getNodeFactories().registerFactory(new ConditionNodeFactory());
  engine.getNodeFactories().registerFactory(new EndNodeFactory());

  engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
  engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());

  engine.getLabelFactories().registerFactory(new CustomLabelFactory());
  const model = new DiagramModel();

  // Load model into engine
  engine.setModel(model);

  return <GraphContainer engine={engine} model={model} />;
};

export default Wrapper;
