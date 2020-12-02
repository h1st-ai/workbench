import * as React from "react";
import { cloneDeep } from "lodash";
import {
  GraphView, // required
} from "react-digraph";
// import Modal from "./Modal";
import {
  default as nodeConfig,
  EMPTY_EDGE_TYPE,
  CUSTOM_EMPTY_TYPE,
  NODE_KEY,
  POLY_TYPE,
  SPECIAL_CHILD_SUBTYPE,
  SPECIAL_EDGE_TYPE,
  SPECIAL_TYPE,
  SKINNY_TYPE,
} from "./elements";

const sampleGraph = {
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
      type: null,
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
  const [selected, setSelected] = React.useState();
  const [graph, setGraph] = React.useState(sampleGraph);
  // const [layoutEngineType, setLayoutEngineType] = React.useState();

  const graphView = React.useRef();

  // const renderNode = (
  //   nodeRef: any,
  //   data: any,
  //   id: any,
  //   selected: any,
  //   hovered: any
  // ) => {
  //   return (
  //     <g x="0" y="0" className={`shape`}>
  //       {!selected ? null : (
  //         <foreignObject
  //           style={{ pointerEvents: "all" }}
  //           width="100"
  //           height="50"
  //           xmlnsXlink="http://www.w3.org/1999/xlink"
  //         >
  //           {/* <Modal
  //             id={`${id}-text`}
  //             onClick={() => {
  //               console.log("onClick text");
  //             }}
  //           /> */}
  //         </foreignObject>
  //       )}
  //       <use
  //         className={`node ${hovered ? "hovered" : ""} ${
  //           selected ? "selected" : ""
  //         }`}
  //         x="-77"
  //         y="-77"
  //         width="154"
  //         height="154"
  //         xlinkHref={`#${data.type}`}
  //       >
  //         <svg viewBox="-27 0 154 154" id={data.type} width="154" height="154">
  //           <rect
  //             transform="translate(50) rotate(45)"
  //             width="109"
  //             height="109"
  //           />
  //         </svg>
  //       </use>
  //     </g>
  //   );
  // };

  const getNodeIndex = (searchNode: any) => {
    return graph.nodes.findIndex((node) => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  };

  // Helper to find the index of a given edge
  const getEdgeIndex = (searchEdge: any) => {
    return graph.edges.findIndex((edge) => {
      return (
        edge.source === searchEdge.source && edge.target === searchEdge.target
      );
    });
  };

  // Given a nodeKey, return the corresponding node
  // const getViewNode = (nodeKey: any) => {
  //   const searchNode: { [key: string]: string } = {};

  //   searchNode[NODE_KEY] = nodeKey;
  //   const i = getNodeIndex(searchNode);

  //   return sampleGraph.nodes[i];
  // };

  const addStartNode = (e: any) => {
    const graph = sampleGraph;

    // using a new array like this creates a new memory reference
    // this will force a re-render
    graph.nodes = [
      {
        id: (Date.now() as unknown) as string,
        title: "Node A",
        type: SPECIAL_TYPE,
        x: e ? e.screenX : 0, //Figure out the correct coordinates to drop
        y: e ? e.screenY : 0,
      },
      ...sampleGraph.nodes,
    ];
    setGraph(cloneDeep(graph));
  };

  // const deleteStartNode = () => {
  //   graph.nodes.splice(0, 1);
  //   // using a new array like this creates a new memory reference
  //   // this will force a re-render
  //   graph.nodes = [...graph.nodes];
  //   setGraph(cloneDeep(graph));
  // };

  // const handleChange = (event: any) => {
  //   // this.setState(
  //   //   {
  //   //     totalNodes: parseInt(event.target.value || "0", 10),
  //   //   },
  //   //   this.makeItLarge
  //   // );
  // };

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  const onUpdateNode = (viewNode: any) => {
    const i = getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    setGraph(cloneDeep(graph));
  };

  // Node 'mouseUp' handler
  const onSelectNode = (viewNode: any, event: any) => {
    const { id = "" } = event?.target ?? {};
    if (id.includes("text")) {
      document?.getElementById?.(event.target.id)?.click();
    }

    // Deselect events will send Null viewNode
    setSelected(viewNode);
  };

  // Edge 'mouseUp' handler
  const onSelectEdge = (viewEdge: any) => {
    setSelected(viewEdge);
  };

  // Updates the graph with a new node
  const onCreateNode = (x: any, y: any) => {
    // This is just an example - any sort of logic
    // could be used here to determine node type
    // There is also support for subtypes. (see 'sample' above)
    // The subtype geometry will underlay the 'type' geometry for a node
    const type = Math.random() < 0.25 ? SPECIAL_TYPE : CUSTOM_EMPTY_TYPE;

    const viewNode = {
      id: Date.now().toString(),
      title: "",
      type,
      x,
      y,
    };

    graph.nodes = [...graph.nodes, viewNode];
    setGraph(cloneDeep(graph));
  };

  // Deletes a node from the graph
  const onDeleteNode = (viewNode: any, nodeId: any, nodeArr: any[]) => {
    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => {
      return (
        edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY]
      );
    });

    graph.nodes = nodeArr;
    graph.edges = newEdges;

    setGraph(cloneDeep(graph));
    setSelected(undefined);
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
      graph.edges = [...graph.edges, viewEdge] as any;
      setGraph(graph);
      setSelected(viewEdge as any);
    }
  };

  // Called when an edge is reattached to a different target.
  const onSwapEdge = (
    sourceViewNode: any,
    targetViewNode: any,
    viewEdge: any
  ) => {
    const i = getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference if you want the graph to re-render a swapped edge
    graph.edges = [...graph.edges];

    setGraph(graph);
    setSelected(edge);
  };

  // Called when an edge is deleted
  const onDeleteEdge = (viewEdge: any, edges: any) => {
    graph.edges = edges;
    setGraph({ ...graph });
    setSelected(undefined);
  };

  // onUndo = () => {
  //   // Not implemented
  //   console.warn("Undo is not currently implemented in the example.");
  //   // Normally any add, remove, or update would record the action in an array.
  //   // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
  //   // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
  //   // into the edges array at position i.
  // };

  // onCopySelected = () => {
  //   if (this.state.selected.source) {
  //     console.warn("Cannot copy selected edges, try selecting a node instead.");

  //     return;
  //   }

  //   const x = this.state.selected.x + 10;
  //   const y = this.state.selected.y + 10;

  //   this.setState({
  //     copiedNode: { ...this.state.selected, x, y },
  //   });
  // };

  // onPasteSelected = () => {
  //   if (!this.state.copiedNode) {
  //     console.warn(
  //       "No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C"
  //     );
  //   }

  //   const graph = this.state.graph;
  //   const newNode = { ...this.state.copiedNode, id: Date.now() };

  //   graph.nodes = [...graph.nodes, newNode];
  //   this.forceUpdate();
  // };

  // const handleChangeLayoutEngineType = (event: any) => {
  //   setLayoutEngineType(event.target.value);
  // };

  // const onSelectPanNode = (event: any) => {
  //   if (graphView && graphView.current) {
  //     // TO-DO: Set type
  //     // graphView?.current?.panToNode(event.target.value, true);
  //   }
  // };

  return (
    <div id="graph" style={{ height: "50rem" }}>
      <button onClick={addStartNode}>Create Node</button>
      <GraphView
        showGraphControls={true}
        // gridSize={"100rem"}
        gridDotSize={1}
        renderNodeText={() => {}}
        ref={graphView as any}
        nodeKey={NODE_KEY}
        nodes={graph.nodes}
        edges={graph.edges}
        selected={selected}
        nodeTypes={nodeConfig.NodeTypes}
        nodeSubtypes={nodeConfig.NodeSubtypes}
        edgeTypes={nodeConfig.NodeTypes}
        onSelectNode={onSelectNode}
        onCreateNode={onCreateNode}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        onSelectEdge={onSelectEdge}
        onCreateEdge={onCreateEdge}
        onSwapEdge={onSwapEdge}
        onDeleteEdge={onDeleteEdge}
        readOnly={false}
        //renderNode={this.renderNode}
      />
    </div>
  );
};

// class Graphi extends Component {
//   constructor(props) {
//     super(props);
//     this.customNodeRef = React.createRef();
//     this.state = {
//       graph: sample,
//       selected: {},
//     };
//   }

//   // onSelectEdge = (node, event) => {
//   //   //console.log("test select edge");
//   // };

//   // onUpdateNode = () => true;

//   // onDeleteNode = (...args) => {
//   //   this.setState({});
//   // };

//   /* Define custom graph editing methods here */

//   render() {
//     const nodes = this.state.graph.nodes;
//     const edges = this.state.graph.edges;
//     const selected = this.state.selected;

//     return (

//     );
//   }
// }

export default Graph;
