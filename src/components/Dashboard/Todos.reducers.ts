import * as types from './Todos.constants';
import produce from 'immer';

const todos = [] as Todos[];

const initialState = {
  loading: true,
  error: {},
  todo: todos,
  todos: todos,
};

export const todosReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload } = action;
    switch (type) {
      case types.GET_TODOS:
        draft.todo = payload;
        draft.loading = false;
        break;
      default:
        return state;
    }
  });
