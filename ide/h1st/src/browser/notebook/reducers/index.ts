import { combineReducers } from "redux";
import notebook from "./notebook";
import kernel from "./kernel";
import widget from "./widget";

export default combineReducers({
  kernel,
  notebook,
  widget,
});
