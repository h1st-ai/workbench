import createEngine, {
  DiagramModel,
  PathFindingLinkFactory,
  DefaultPortModel,
  PortModel,
  PortModelGenerics,
  DagreEngine,
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
import { fetchGraph } from "../../services/dataProvider";
import { log } from "../../services/logging";

export default () => {
  //1) setup the diagram engine
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new ActionNodeFactory());
  engine.getNodeFactories().registerFactory(new StartNodeFactory());
  engine.getNodeFactories().registerFactory(new ConditionNodeFactory());
  engine.getNodeFactories().registerFactory(new EndNodeFactory());

  engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
  engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());

  engine.getLabelFactories().registerFactory(new CustomLabelFactory());

  const pathfinding = engine
    .getLinkFactories()
    .getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME);

  var model = new DiagramModel();
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

  React.useEffect(() => {
    setTimeout(() => {
      redistribute();
    }, 1000);
  }, []);

  const initGraph = async () => {
    const { nodes = [], edges = [] } = await fetchGraph();

    const nodeObj: { [key: string]: any } = {};

    nodes.forEach((node, idx) => {
      const { name, type } = node;

      switch (type) {
        case "start":
          const startNode = new StartNodeModel();
          nodeObj[name ?? `start-${idx}`] = startNode;
          model.addNode(startNode);
          break;
        case "action":
          const actionNode = new ActionNodeModel({
            name,
          });
          nodeObj[name ?? `action-${idx}`] = actionNode;
          model.addNode(actionNode);
          break;
        case "condition":
          const conditionNode = new ConditionNodeModel({
            name,
          });
          nodeObj[name ?? `condition-${idx}`] = conditionNode;
          model.addNode(conditionNode);
          break;
        case "end":
          const endNode = new EndNodeModel({
            name,
          });
          nodeObj[name ?? `end-${idx}`] = endNode;
          model.addNode(endNode);
          break;
      }
    });

    edges.forEach((edge) => {
      const { source, target, handleText } = edge;

      log("init graph", nodes, edges);

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
        model.addLink(link);
      }
    });

    redistribute();

    // updateGraph({ nodes, edges });
  };

  React.useEffect(() => {
    initGraph();
  }, []);

  //5) load model into engine
  engine.setModel(model);

  //6) render the diagram!
  return (
    <GraphCanvasWidget>
      <CanvasWidget engine={engine} />
    </GraphCanvasWidget>
  );
};
