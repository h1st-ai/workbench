import * as React from "react";
import { useSelector } from "react-redux";
import { IStore } from "../types";
import { EmptyComponent } from "./empty";

interface IExperimentListProps {}

export function ExperimentList(props: IExperimentListProps) {
  const { data } = useSelector((store: IStore) => store.tunes);

  if (data.length === 0) {
    return <EmptyComponent />;
  }

  return null;
}
