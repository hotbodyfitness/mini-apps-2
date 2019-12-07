var numbersReducer = (state = null, action) => {
  switch (action.type) {
    case 'NUMBERS':
      return action.numbers;

    default:
      return state;
  }
};

export default numbersReducer;