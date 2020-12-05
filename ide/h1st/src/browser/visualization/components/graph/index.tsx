import * as React from "react";
import { cloneDeep } from "lodash";
import {
  GraphView, // required
  LayoutEngineType,
} from "react-digraph";
import {
  default as graphConfig,
  EMPTY_EDGE_TYPE,
  CUSTOM_EMPTY_TYPE,
  NODE_KEY,
  SPECIAL_EDGE_TYPE,
  SPECIAL_TYPE,
} from "./elements";
import { useDispatch, useSelector } from "react-redux";
import { selectGraph, graphActions } from "../../reducers/graph";
import { IEdge, IGraph } from "../../types";
import { fetchGraph } from "../../services/dataProvider";

const Graph = () => {
  const graph = useSelector(selectGraph);
  const graphView = React.useRef();
  const [layoutEngine] = React.useState("VerticalTree");

  const dispatch = useDispatch();
  const updateGraph = (graph: IGraph) => dispatch(graphActions.setGraph(graph));

  const initGraph = async () => {
    const { nodes = [], edges = [] } = await fetchGraph();

    updateGraph({ nodes, edges });
  };
  React.useEffect(() => {
    initGraph();
  }, []);

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
        layoutEngineType={layoutEngine as LayoutEngineType}
        // layoutEngineType="VerticalTree"
        readOnly={false}
        // gridSpacing={10}
        // gridDotSize={0}
        ref={graphView as any}
        nodeKey={NODE_KEY}
        nodes={cloneDeep(graph.nodes)}
        edges={cloneDeep(graph.edges)}
        selected={cloneDeep(graph.selected)}
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
