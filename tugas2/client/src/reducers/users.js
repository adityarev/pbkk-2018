const initialState = {
  isFetching: false,
  users: []
}

export const usersReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'LOG_REGISTER':
      return {
        ...state,
        users: state.users.concat(action.payload.user)
      }
    case 'FETCHING_USERS_DATA':
      return {
        ...state,
        isFetching: true
      }
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        users: action.payload.users
      }
    case 'FETCH_USERS_FAILED':
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}
