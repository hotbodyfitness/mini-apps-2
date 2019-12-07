import bombsAct from './bombsAct.js';
import numbersAct from './numbersAct.js';
import clickAct from './clickAct.js'
import winAct from './winAct.js'
import loseAct from './loseAct.js'
import createBombs from '../functions/createBombs.js';
import createNumbers from '../functions/createNumbers.js';

function resetAct () {
  var bombs = createBombs();
  var numbers = createNumbers(bombs);

  return (dispatch, getState) => {
    dispatch(bombsAct(bombs));
    dispatch(numbersAct(numbers));
    dispatch(clickAct(false));
    dispatch(winAct(false));
    dispatch(loseAct(false));
  }
}

export default resetAct;