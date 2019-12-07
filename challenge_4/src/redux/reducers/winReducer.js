var winReducer = (state = null, action) => {
  switch (action.type) {
    case 'WIN':
      return action.win;

    default:
      return state;
  }
}

export default winReducer;