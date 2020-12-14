import createEngine, {
  DefaultPortModel,
  DiagramEngine,
  DiagramModel,
  PathFindingLinkFactory,
  PortModel,
  PortModelGenerics,
} from "@projectstorm/react-diagrams";
import { IEdge, INode } from "../../types";
import { ActionNodeFactory, ActionNodeModel } from "../ActionNode";
import { ConditionNodeFactory, ConditionNodeModel } from "../ConditionNode";
import { CustomLabelFactory, CustomtLabelModel } from "../CustomLabel";
import { AdvancedLinkFactory } from "../DirectedLink";
import { EndNodeFactory, EndNodeModel } from "../EndNode";
import { StartNodeFactory, StartNodeModel } from "../StartNode";

const initGraph = ({
  model,
  nodes,
  edges,
  pathfinding,
}: {
  model: DiagramModel;
  nodes: INode[];
  edges: IEdge[];
  pathfinding: PathFindingLinkFactory;
}) => {
  const nodeObj: { [key: string]: any } = {};
  nodes.forEach((node, idx) => {
    const { name, type } = node;
    // log("model add node", type);
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
      model.addLink(link);
    }
  });
};

const initGraphEngine = (): DiagramEngine => {
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

  return engine;
};

export { initGraph, initGraphEngine };
