
const login = (state={}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...{
        id: action.id,
        text: action.text,
        completed: !state.completed
        }
      }
    default:
      return state
  }
}
  
  export default login
  