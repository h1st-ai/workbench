type NodeType = "condition" | "action" | undefined;

export interface INode {
  id?: string;
  name?: string;
  type: NodeType | string;
  subtype?: string;
  x: number;
  y: number;
  title?: string;
}

export interface IEdge {
  handleText: string;
  source: string;
  target: string;
  type: string;
}

export interface IGraph {
  nodes: INode[];
  edges: IEdge[];
  selected?: INode | IEdge | undefined;
}
