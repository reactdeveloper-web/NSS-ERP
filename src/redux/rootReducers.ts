import { combineReducers } from 'redux';
import { authReducer } from 'src/components/Auth/Auth.reducers';
import { alertReducer } from 'src/components/Alert/Alert.reducers';

export const RootReducer = combineReducers({
  auth: authReducer,
  alerts: alertReducer,
});
