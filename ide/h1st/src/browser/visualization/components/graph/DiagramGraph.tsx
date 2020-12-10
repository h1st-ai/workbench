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
  var model = new DiagramModel();
  /*
    Set up darge engine to distribute
  */
  const dargeEngine = new DagreEngine({
    graph: {
      rankdir: "TB",
      ranker: "network-simplex",
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
  //2) setup the diagram model

  const yesActionNode = new ActionNodeModel({
    name: "MyModel1",
    color: "rgb(0,192,255)",
  });

  yesActionNode.setPosition(100, 200);

  const noActionNode = new ActionNodeModel({
    name: "MyModel1 No",
    color: "rgb(0,192,255)",
  });

  yesActionNode.setPosition(100, 200);

  const actionNodeIn = yesActionNode.getPort("in");
  const yesActionNodeOut = yesActionNode.getPort("out") as DefaultPortModel;
  const noActionNodeIn = noActionNode.getPort("in");
  const noActionNodeOut = noActionNode.getPort("out") as DefaultPortModel;
  // node1.setPosition(100, 100);
  // let port1 = node1.addOutPort("");

  const pathfinding = engine
    .getLinkFactories()
    .getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME);

  const startNode = new StartNodeModel({ name: "Start" });

  startNode.setPosition(500, 200);

  const startOutPort = startNode.getPort("out") as DefaultPortModel;

  const conditionNode = new ConditionNodeModel({ name: "condition node" });

  conditionNode.setPosition(500, 500);

  const conditionInPort = conditionNode.getPort("in");
  const conditionOutYes = conditionNode.getPort("outYes") as DefaultPortModel;
  const conditionOutNo = conditionNode.getPort("outNo") as DefaultPortModel;

  const linkStart = startOutPort?.link(
    conditionInPort as PortModel<PortModelGenerics>,
    pathfinding
  );

  linkStart.addLabel("start");

  const linkYes = conditionOutYes?.link(
    actionNodeIn as PortModel<PortModelGenerics>,
    pathfinding
  );

  // (linkYes as DefaultLinkModel).addLabel("yes");

  const linkNo = conditionOutNo?.link(
    noActionNodeIn as PortModel<PortModelGenerics>,
    pathfinding
  );

  const endNode = new EndNodeModel({ name: "end" });
  const endInPort = endNode.getPort("in");

  const linkYesToEnd = yesActionNodeOut.link(
    endInPort as PortModel<PortModelGenerics>,
    pathfinding
  );

  linkYesToEnd.addLabel(
    new CustomtLabelModel({
      label: "Yes",
      offsetY: 5,
    })
  );

  const linkBoToEnd = noActionNodeOut.link(
    endInPort as PortModel<PortModelGenerics>,
    pathfinding
  );

  linkBoToEnd.addLabel(
    new CustomtLabelModel({
      label: "No",
      offsetY: 5,
    })
  );

  model.addAll(
    // Node
    startNode,
    conditionNode,
    yesActionNode,
    noActionNode,
    endNode,
    // Link
    linkStart,
    linkYes,
    linkNo,
    linkYesToEnd,
    linkBoToEnd
    // link1
  );

  const initGraph = async () => {
    const { nodes = [], edges = [] } = await fetchGraph();

    log("init graph", nodes, edges);

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
