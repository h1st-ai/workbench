import * as React from "react";
import { cloneDeep } from "lodash";
import {
  GraphView, // required
} from "react-digraph";
// import Modal from "./Modal";
import {
  default as graphConfig,
  EMPTY_EDGE_TYPE,
  CUSTOM_EMPTY_TYPE,
  NODE_KEY,
  POLY_TYPE,
  SPECIAL_CHILD_SUBTYPE,
  SPECIAL_EDGE_TYPE,
  SPECIAL_TYPE,
  SKINNY_TYPE,
} from "./elements";
import { useDispatch, useSelector } from "react-redux";
import { selectGraph, graphActions } from "../../reducers/graph";
import { IEdge, IGraph } from "../../types";

const sampleGraph: IGraph = {
  edges: [
    {
      handleText: "5",
      source: "start1",
      target: "a1",
      type: SPECIAL_EDGE_TYPE,
    },
    {
      handleText: "5",
      source: "a1",
      target: "a2",
      type: SPECIAL_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "a2",
      target: "a4",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "a1",
      target: "a3",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "a3",
      target: "a4",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "a1",
      target: "a5",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "a4",
      target: "a1",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "a1",
      target: "a6",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "24",
      source: "a1",
      target: "a7",
      type: EMPTY_EDGE_TYPE,
    },
  ],
  nodes: [
    {
      id: "start1",
      title: "Start (0)",
      type: SPECIAL_TYPE,
      x: 258.3976135253906,
      y: 331.9783248901367,
    },
    {
      id: "a1",
      title: "Node A (1)",
      type: SPECIAL_TYPE,
      x: 258.3976135253906,
      y: 331.9783248901367,
    },
    {
      id: "a2",
      subtype: SPECIAL_CHILD_SUBTYPE,
      title: "Node B (2)",
      type: CUSTOM_EMPTY_TYPE,
      x: 593.9393920898438,
      y: 260.6060791015625,
    },
    {
      id: "a3",
      title: "Node C (3)",
      type: CUSTOM_EMPTY_TYPE,
      x: 237.5757598876953,
      y: 61.81818389892578,
    },
    {
      id: "a4",
      title: "Node D (4)",
      type: CUSTOM_EMPTY_TYPE,
      x: 600.5757598876953,
      y: 600.81818389892578,
    },
    {
      id: "a5",
      title: "Node E (5)",
      type: POLY_TYPE,
      x: 50.5757598876953,
      y: 500.81818389892578,
    },
    {
      id: "a6",
      title: "Node E (6)",
      type: SKINNY_TYPE,
      x: 300,
      y: 600,
    },
    {
      id: "a7",
      title: "Node F (7)",
      type: POLY_TYPE,
      x: 0,
      y: 300,
    },
  ],
};

const Graph = () => {
  const graph = useSelector(selectGraph);

  const dispatch = useDispatch();
  const updateGraph = (graph: IGraph) => dispatch(graphActions.setGraph(graph));

  React.useEffect(() => {
    updateGraph(sampleGraph);
  }, []);

  const graphView = React.useRef();

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  const onUpdateNode = (viewNode: any) => {
    dispatch(graphActions.updateNode({ node: viewNode }));
    updateGraph(cloneDeep(graph));
  };

  // Node 'mouseUp' handler
  const onSelectNode = (viewNode: any, event: any) => {
    const { id = "" } = event?.target ?? {};
    if (id.includes("text")) {
      document?.getElementById?.(event.target.id)?.click();
    }

    // Deselect events will send Null viewNode
    dispatch(graphActions.setSelected({ selected: viewNode }));
  };

  // Edge 'mouseUp' handler
  const onSelectEdge = (viewEdge: IEdge) => {
    dispatch(graphActions.setSelected({ selected: viewEdge }));
  };

  // Updates the graph with a new node
  const onCreateNode = (x: number, y: number) => {
    const type = Math.random() < 0.25 ? SPECIAL_TYPE : CUSTOM_EMPTY_TYPE;

    const viewNode = {
      id: Date.now().toString(),
      title: "",
      type,
      x,
      y,
    };
    dispatch(graphActions.createNode({ node: viewNode }));
  };

  // Deletes a node from the graph
  const onDeleteNode = (viewNode: any, nodeId: any, nodeArr: any[]) => {
    dispatch(
      graphActions.deleteNode({
        node: viewNode,
        nodeArr,
      })
    );
    dispatch(graphActions.setSelected({ selected: undefined }));
  };

  // Creates a new node between two edges
  const onCreateEdge = (sourceViewNode: any, targetViewNode: any) => {
    // This is just an example - any sort of logic
    // could be used here to determine edge type
    const type =
      sourceViewNode.type === SPECIAL_TYPE
        ? SPECIAL_EDGE_TYPE
        : EMPTY_EDGE_TYPE;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type,
    };

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      dispatch(
        graphActions.addEdge({
          edge: viewEdge,
        })
      );
    }
  };

  // Called when an edge is reattached to a different target.
  const onSwapEdge = (
    sourceViewNode: any,
    targetViewNode: any,
    viewEdge: any
  ) => {
    dispatch(
      graphActions.swapEdge({
        sourceViewNode,
        targetViewNode,
        viewEdge,
      })
    );

    dispatch(graphActions.setSelected({ selected: viewEdge }));
  };

  // Called when an edge is deleted
  const onDeleteEdge = (viewEdge: any, edges: any) => {
    dispatch(graphActions.deleteEdge({ edges }));
    dispatch(graphActions.setSelected({ selected: undefined }));
  };

  return (
    <div id="graph" style={{ height: "100%" }}>
      <GraphView
        showGraphControls={true}
        layoutEngineType="VerticalTree"
        readOnly={false}
        gridSpacing={0}
        gridDotSize={1}
        ref={graphView as any}
        nodeKey={NODE_KEY}
        nodes={cloneDeep(graph.nodes)}
        edges={cloneDeep(graph.edges)}
        selected={graph.selected}
        nodeTypes={graphConfig.NodeTypes}
        nodeSubtypes={graphConfig.NodeSubtypes}
        edgeTypes={graphConfig.NodeTypes}
        onSelectNode={onSelectNode}
        onCreateNode={onCreateNode}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        onSelectEdge={onSelectEdge}
        onCreateEdge={onCreateEdge}
        onSwapEdge={onSwapEdge}
        onDeleteEdge={onDeleteEdge}
      />
    </div>
  );
};

export default Graph;
