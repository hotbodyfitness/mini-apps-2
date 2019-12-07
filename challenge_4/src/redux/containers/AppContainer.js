import { connect } from 'react-redux';
import App from '../../App.js';
import clickSquare from '../actions/clickAct.js';
import resetAct from '../actions/resetAct.js';
import winAct from '../actions/winAct.js';
import loseAct from '../actions/loseAct.js';

var mapStateToProps = (state) => (
  {
    win: state.win,
    lose: state.lose,
    revealed: state.revealed,
    bombs: state.bombs,
    numbers: state.numbers
  }
)

var mapDispatchToProps = (dispatch) => (
  {
    click: (e) => dispatch(clickSquare(e.target.id.slice(1))),
    revealSurrounding: (surroundingVals) => dispatch(clickSquare(surroundingVals)),
    reset: () => dispatch(resetAct()),
    logWin: () => dispatch(winAct(true)),
    logLose: (id) => dispatch(loseAct(id))
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(App);
