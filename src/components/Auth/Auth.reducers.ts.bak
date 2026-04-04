import * as types from './Auth.constants';
import produce from 'immer';

const savedUserJson = localStorage.getItem('user');
const savedUser = savedUserJson ? JSON.parse(savedUserJson) : null;

let userType: IUser = {
  id: '',
  empNum: 0,
  username: '',
  email: undefined,
  password: '',
  accessToken: '',
};
const initialState = {
  loading: false,
  isAuthenticated: !!savedUser,
  token: savedUser?.accessToken || null,
  user: savedUser || userType,
};

export const authReducer = (state = initialState, action: ActionRedux) =>
  produce(state, draft => {
    switch (action.type) {
      case types.USER_LOADED:
        draft.isAuthenticated = true;
        draft.loading = false;
        draft.token = action.payload.id;
        draft.user = action.payload;
        break;
      case types.LOGIN_SUCCESS:
      case types.REGISTER_SUCCESS:
        localStorage.setItem('user', JSON.stringify(action.payload));
        draft.isAuthenticated = true;
        draft.loading = false;
        draft.user = action.payload;
        break;
      case types.LOGIN_FAILED:
      case types.AUTH_ERROR:
      case types.REGISTER_FAILED:
        localStorage.removeItem('user');
        draft.token = null;
        draft.isAuthenticated = false;
        draft.loading = false;
        break;
      case types.LOGOUT:
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        draft.token = null;
        draft.isAuthenticated = false;
        draft.loading = false;
        break;

      default:
        return state;
    }
  });
