/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import { URL } from 'src/constants/urls';
import * as actions from './Auth.actions';
import { v4 as uuid } from 'uuid';
import { setAlert } from 'src/components/Alert/Alert.thunks';
import { AlertTypes } from 'src/constants/alerts';
import axiosInstance from '../../redux/interceptor';

interface ReqUserActivity {
  empnum: number;
  DataFlag: string;
  Type: number;
  Show : ""
}

export const loadUser = (payload: ReqUserActivity) => async dispatch => {
  const userJson = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userJson);
  const id = user.empNum;
  //console.log('payload',payload);
   //console.log('userid',id);
  if (!id) {
    dispatch(actions.authError());
    dispatch(setAlert({ msg: 'Cant not load user!', type: AlertTypes.ERROR }));
    return;
  }
  try {
    dispatch(actions.authError());
    dispatch(setAlert({ msg: 'Get user error!', type: AlertTypes.ERROR }));
    return;
  } catch (error) {
    dispatch(actions.authError());
    dispatch(setAlert({ msg: error.message, type: AlertTypes.ERROR }));
    return;
  }
};

export const login = (payload: ReqLogin) => async dispatch => {
   try {
      const res = await axios.post(`/erp/login/UserLogin`,
        payload
      );
    const allUsers = res.data;
    let user = allUsers.userData;
    //console.log('login',allUsers);
    if (allUsers.userData.status === 'Success' && user && user.empNum == payload.username) {
      dispatch(actions.loginSuccess(user));
      // ✅ store tokens
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      dispatch(
        setAlert({
          msg: 'You are logged in!',
          type: AlertTypes.SUCCESS,
        }),
      );
      //dispatch(loadUser(reqUserActivity));
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
