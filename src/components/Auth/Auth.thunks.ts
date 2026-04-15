/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import { URL } from 'src/constants/urls';
import * as actions from './Auth.actions';
import { v4 as uuid } from 'uuid';
import { setAlert } from 'src/components/Alert/Alert.thunks';
import { AlertTypes } from 'src/constants/alerts';
import { ContentTypes } from 'src/constants/content';

import axiosInstance from 'src/redux/axiosInstance';

interface ReqUserActivity {
  empnum: number;
  DataFlag: string;
  Type: number;
  Show: '';
}

export const loadUser = (payload?: ReqUserActivity) => async dispatch => {
  const userJson = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userJson);
  const id = user.empNum || user.id;

  if (!id) {
    dispatch(actions.authError());
    return;
  }

  try {
    dispatch(actions.userLoaded(user));
    return user;
  } catch (error) {
    dispatch(actions.authError());
    dispatch(setAlert({ msg: error.message, type: AlertTypes.ERROR }));
    return;
  }
};

export const login = (payload: ReqLogin) => async dispatch => {
  try {
    const res = await axiosInstance.post('/login/UserLogin', payload);
    const allUsers = res.data;
    let user = allUsers.userData;
    //console.log('login',allUsers);
    if (
      allUsers.userData.status === 'Success' &&
      user &&
      user.empNum == payload.username
    ) {
      dispatch(actions.loginSuccess(user));
      // ✅ store tokens
      localStorage.setItem('accessToken', res.data.token);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('loginTimestamp', Date.now().toString());
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
    //return dispatch(actions.loginFailed());
  } catch (error) {
    dispatch(
      setAlert({
        msg: 'Invalid credentials',
        type: AlertTypes.ERROR,
      }),
    );
    return dispatch(actions.loginFailed());
  }
};

export const forgot = (payload: ReqForgot) => async dispatch => {
  try {
    const addPayload = {
      Emp_Num: payload.userid,
      Data_Flag: ContentTypes.DataFlag,
    };

    console.log('FINAL PAYLOAD', addPayload);

    const res = await axiosInstance.post(
      `/login/ForgotPasswordRequest`,
      addPayload,
    );

    console.log('API RESPONSE', res.data);

    if (res.data?.result === true) {
      dispatch(
        setAlert({
          msg: res.data.message || 'Password reset link sent to email.',
          type: AlertTypes.SUCCESS,
        }),
      );
      return dispatch(actions.forgotSuccess());
    } else {
      dispatch(
        setAlert({
          msg: res.data.message || 'User not found',
          type: AlertTypes.ERROR,
        }),
      );
      return dispatch(actions.loginFailed());
    }
  } catch (error) {
    console.log('FORGOT ERROR', error.response?.data || error);
    dispatch(
      setAlert({
        msg: 'Server error while sending reset mail',
        type: AlertTypes.ERROR,
      }),
    );
  }
};

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
  //Clear all storage explicitly
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('loginTimestamp');
  localStorage.removeItem('user');

  dispatch(actions.logoutSuccess());
  dispatch(
    setAlert({
      msg: 'You are logged out!',
      type: AlertTypes.WARNING,
    }),
  );
};

// ================= TYPES =================
export interface ReqLogin {
  username?: string | number;
  password?: string;
  [key: string]: any;
}

export interface ReqForgot {
  userid?: string | number;
  [key: string]: any;
}

export interface ReqSetupPassword {
  EmpNum: string;
  Token: string;
  NewPassword: string;
  Data_Flag: string;
}

// ================= THUNK =================
export const setupNewPassword = (payload: ReqSetupPassword) => async (
  dispatch: any,
) => {
  try {
    console.log('SETUP PASSWORD FINAL PAYLOAD 🚀', payload);

    const res = await axiosInstance.post(
      '/login/ResetPasswordConfirm',
      payload,
    );

    console.log('SETUP PASSWORD RESPONSE ✅', res.data);

    if (res?.data?.result === true) {
      dispatch(
        setAlert({
          msg: res.data.message || 'Password changed successfully ✅',
          type: AlertTypes.SUCCESS,
        }),
      );

      dispatch(actions.setupPasswordSuccess());
      return true;
    }

    dispatch(
      setAlert({
        msg: res?.data?.message || 'Unable to reset password ❌',
        type: AlertTypes.ERROR,
      }),
    );

    return false;
  } catch (error: any) {
    console.log('SETUP PASSWORD ERROR ❌', error?.response?.data || error);

    dispatch(
      setAlert({
        msg:
          error?.response?.data?.message ||
          'Server error while resetting password',
        type: AlertTypes.ERROR,
      }),
    );

    return false;
  }
};
