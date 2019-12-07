var loseReducer = (state = null, action) => {
  switch (action.type) {
    case 'LOSE':
      return action.lose;

    default:
      return state;
  }
}

export default loseReducer;