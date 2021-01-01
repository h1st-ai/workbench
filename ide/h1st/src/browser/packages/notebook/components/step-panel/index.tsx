import * as React from "react";
import Icon from "../../components/icon";

const steps = [
  { label: "load_data()", execute: () => console.log("load_data") },
  { label: "explore_data()", execute: () => console.log("explore_data") },
  { label: "prep_data()", execute: () => console.log("prep_data") },
  { label: "train()", execute: () => console.log("train") },
  { label: "predict()", execute: () => console.log("predict") },
];

export default function NotebookStepPanel() {
  const buttons = steps.map((s) => (
    <StepButton label={s.label} onClick={s.execute} />
  ));
  return <div className="h1st-ntb-steps">{buttons}</div>;
}

function StepButton({ label, onClick, disabled = false }: any) {
  return (
    <button className="h1st-btn--step" disabled={disabled} onClick={onClick}>
      <Icon width={24} height={24} icon="play-circle" />
      {label}
    </button>
  );
}
