/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import { URL } from 'src/constants/urls';
import * as actions from './Auth.actions';
import { v4 as uuid } from 'uuid';
import { setAlert } from 'src/components/Alert/Alert.thunks';
import { AlertTypes } from 'src/constants/alerts';
import axiosInstance from '../../redux/interceptor';

export const loadUser = () => async dispatch => {
  const userJson = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userJson) as IUser;
  const id = user.id;
  if (!id) {
    dispatch(actions.authError());
    dispatch(setAlert({ msg: 'Cant not load user!', type: AlertTypes.ERROR }));
    return;
  }
  try {
    const res = await axios.get(`${URL.baseAPIUrl}/api/users/${id}`);
    if (res) {
      return dispatch(actions.userLoaded(res.data));
    }
    dispatch(actions.authError());
    dispatch(setAlert({ msg: 'Get user error!', type: AlertTypes.ERROR }));
    return;
  } catch (error) {
    dispatch(actions.authError());
    dispatch(setAlert({ msg: error.message, type: AlertTypes.ERROR }));
    return;
  }
};

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (data: { Username: string; Password: string }) => {
//     const response = await axiosInstance.post(
//       '/login/UserLogin',
//       data
//     );

//     return response.data;
//   }
// );

export const login = (payload: ReqLogin) => async dispatch => {
  //const { username, password } = payload;
   try {
      const res = await axiosInstance.post(`${URL.baseAPIUrl}/erpapi/login/UserLogin`,
        payload
        // {
        //   headers: {
        //     APIKey: 'NSSAPI4SANSTHANUAT',   // ✅ custom header
        //     'Content-Type': 'application/json',
        //   },
        // }
      );
    const allUsers = res.data;
     let user = allUsers.UserLogin.filter(x => x.status === 'Success')[0];
    if (user && user.empNum == payload.username) {
      dispatch(actions.loginSuccess(user));
      dispatch(
        setAlert({
          msg: 'You are logged in!',
          type: AlertTypes.SUCCESS,
        }),
      );
      //dispatch(loadUser());
      return;
    }
    dispatch(
      setAlert({
        msg: 'Invalid credentials',
        type: AlertTypes.ERROR,
      }),
    );
    return dispatch(actions.loginFailed());
  } catch (error) {
    dispatch(
      setAlert({
        msg: 'Invalid credentials',
        type: AlertTypes.ERROR,
      }),
    );
    return dispatch(actions.loginFailed());
  }
  
}


export const register = (payload: ReqLogin) => async dispatch => {
  try {
    const id = uuid();
    const accessToken = id;

    const newUser = { ...payload, id, accessToken };
    await axios.post(`${URL.baseAPIUrl}/api/users`, newUser);
    dispatch(actions.registerSuccess(newUser));
    dispatch(
      setAlert({
        msg: 'Register successfully!',
        type: AlertTypes.SUCCESS,
      }),
    );
    dispatch(loadUser());
  } catch (error) {
    return dispatch(actions.registerFailed());
  }
};
export const logout = () => async dispatch => {
  dispatch(actions.logoutSuccess());
  dispatch(
    setAlert({
      msg: 'You are logged out!',
      type: AlertTypes.WARNING,
    }),
  );
};
