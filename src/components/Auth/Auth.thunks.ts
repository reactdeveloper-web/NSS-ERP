/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import { URL } from 'src/constants/urls';
import * as actions from './Auth.actions';
import { v4 as uuid } from 'uuid';
import { setAlert } from 'src/components/Alert/Alert.thunks';
import { AlertTypes } from 'src/constants/alerts';
import { ContentTypes } from 'src/constants/content';
import axiosInstance from '../../redux/interceptor';

interface ReqUserActivity {
  empnum: number;
  DataFlag: string;
  Type: number;
  Show : ""
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
  
}

export const forgot = (payload: ReqForgot) => async dispatch => {
   try {
      //const res = await axios.post(`${URL.baseAPIUrl}/login/UserLogin`,
      //const { Emp_Num, Data_Flag } = payload;
       const Emp_Num = payload.userid;
       const Data_Flag = ContentTypes.DataFlag
       const addPayload = { ...payload, Emp_Num, Data_Flag };

      console.log('forgot',addPayload);
      
      const res = await axios.post(`/login/ForgotPasswordRequest`,
        addPayload
      );
    const result = res.data.result;
    if (result) {
      dispatch(
      setAlert({
        msg: 'Password reset link sent successfully to your email.',
        type: AlertTypes.SUCCESS,
      }),
    );
    return dispatch(actions.forgotSuccess());
    }
    //console.log('result',result);
    return dispatch(actions.loginFailed());
    //dispatch(login());
  } catch (error) {
    dispatch(
      setAlert({
        msg: 'Invalid User Id',
        type: AlertTypes.ERROR,
      }),
    );
    //return dispatch(actions.loginFailed());
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
