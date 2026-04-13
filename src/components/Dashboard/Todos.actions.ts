import * as types from './Todos.constants';

export const todosError = (payload: TodosError) => ({
  type: types.TODOS_ERROR,
  payload,
});

export const getTodosSuccess = (payload: Todos[]) => ({
  type: types.GET_TODOS,
  payload,
});

export const clearProductSuccess = () => ({
  type: types.CLEAR_TODOS,
});
