import { combineReducers } from 'redux';
import { authReducer } from 'src/components/Auth/Auth.reducers';
import { alertReducer } from 'src/components/Alert/Alert.reducers';
import { todosReducer } from 'src/components/Dashboard/Todos.reducers';

export const RootReducer = combineReducers({
  auth: authReducer,
  todos: todosReducer,
  alerts: alertReducer,
});
