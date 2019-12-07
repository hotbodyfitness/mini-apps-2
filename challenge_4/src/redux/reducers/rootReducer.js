import { combineReducers } from 'redux';

// MUST HAVE A REDUCER NAME THAT MATCHES EVERY STATE KEY!!!
import revealed from './clickReducer.js'
import win from './winReducer.js'
import lose from './loseReducer.js'
import bombs from './bombsReducer.js'
import numbers from './numbersReducer.js'

var rootReducer = combineReducers({revealed, win, lose, bombs, numbers});

export default rootReducer;