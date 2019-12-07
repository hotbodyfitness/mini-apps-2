var clickReducer = (state = null, action) => {
  var rev = state && state.revealed ? [...state.revealed]: [];
  switch (action.type) {
    case 'CLICK':
      return action.square === false ? { revealed: [] } : (
        Array.isArray(action.square) ?
          Object.assign({}, state, {
            revealed: [...new Set([...rev, ...action.square])].sort((a, b) => {
              if (Number(a) < Number(b)) {
                return -1;
              } else {
                return 1;
              }
            })
          })

          : Object.assign({}, state, {
            revealed: state.revealed ? [...state.revealed, action.square].sort((a, b) => {
              if (Number(a) < Number(b)) {
                return -1;
              } else {
                return 1;
              }
            }) : [action.square]
          })
      )

    default:
      return state
  }
}

export default clickReducer;