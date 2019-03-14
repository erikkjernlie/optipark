import { combineReducers } from "redux";

import database from "./database";
import global from "./global"

export default combineReducers({
  database,
  global
});
