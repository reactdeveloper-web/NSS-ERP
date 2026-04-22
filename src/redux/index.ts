import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { RootReducer } from './rootReducers';
const composeEnhancers =
  typeof window === 'object' &&
  import.meta.env.DEV &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));
export const store = createStore(RootReducer, enhancer);
