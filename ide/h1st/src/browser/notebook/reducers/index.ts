import { combineReducers } from "redux";
import notebook from "./notebook";
import kernel from "./kernel";

export default combineReducers({
  kernel,
  notebook,
});
