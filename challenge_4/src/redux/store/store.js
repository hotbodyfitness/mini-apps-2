import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer.js';

import createBombs from '../functions/createBombs.js';
import createNumbers from '../functions/createNumbers.js';

var bombs = createBombs();
var numbers = createNumbers(bombs);

const initialState = {
  revealed: [],
  win: false,
  lose: false,
  bombs,
  numbers
};

export default createStore(rootReducer, initialState, applyMiddleware(thunk)); // STORE