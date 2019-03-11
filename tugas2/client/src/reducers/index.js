import { combineReducers, createStore } from 'redux'
import { usersReducer } from './users'

const allReducers = combineReducers({
  users: usersReducer
})

export const store = createStore(allReducers)
