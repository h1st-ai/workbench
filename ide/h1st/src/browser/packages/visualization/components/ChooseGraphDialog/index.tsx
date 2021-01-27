import * as React from "react";
import styled from "@emotion/styled";

const ChooseGraphDialog = styled.div`
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  .choose-graph-form {
    background-color: white;
    border-radius: 5px;
    .header {
      background-color: #2241b0;
      border-radius: 5px 5px 0px 0px;
      color: white;
      font-weight: bold;
      padding: 12px;
      font-size: 18px;
    }
    .content {
      padding: 12px 36px;
      font-size: 16px;
      .instruction {
        margin: 12px 0px;
        font-weight: bold;
      }

      .graph-item {
        cursor: pointer;
        margin: 12px 0px;
      }
    }
    .control {
      padding: 12px;
      justify-content: center;
      display: flex;

      .select-button {
        border-style: none;
        text-align: center;
        padding: 0px 10px;
        height: 40px;
        min-width: 100px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 600;
        background-color: #2241b0;
        color: #dce4ff;
      }
    }
  }
`;

const ChooseGraphModal = ({
  graphs = [],
  handleSelectGraph,
}: {
  graphs: string[];
  handleSelectGraph: (graph: string) => void;
}) => {
  const [selected, setSelected] = React.useState(graphs[0]);

  const handleSelected = (e: any) => {
    setSelected(e.target.value);
  };
  return (
    <ChooseGraphDialog>
      <div className="choose-graph-form">
        <div className="header">Graph visualization</div>
        <div className="content">
          <div className="instruction">Please select a graph to visualize:</div>
          {graphs.map((graph) => (
            <div className="graph-item" key={graph}>
              <input
                id={`graph-${graph}`}
                name="graph"
                value={graph}
                type="radio"
                onChange={handleSelected}
                checked={selected === graph}
              />
              <label htmlFor={`graph-${graph}`}>{graph}</label>
            </div>
          ))}
        </div>
        <div className="control">
          <button
            className="select-button"
            type="button"
            onClick={() => handleSelectGraph(selected)}
          >
            Select
          </button>
        </div>
      </div>
    </ChooseGraphDialog>
  );
};

export { ChooseGraphModal };
