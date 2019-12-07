var bombsReducer = (state = null, action) => {
  switch (action.type) {
    case 'BOMBS':
      return action.bombs;

    default:
      return state;
  }
};

export default bombsReducer;