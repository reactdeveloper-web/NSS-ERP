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
      const res = await axiosInstance.post(`/login/UserLogin`,
        payload
      );
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
      dispatch(
        setAlert({
          msg: 'You are logged in!',
          type: AlertTypes.SUCCESS,
        }),
      );
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

    const res = await axiosInstance.post(
      `/login/ForgotPasswordRequest`,
      addPayload
    );

    // ⭐ normal success response
    const apiResult = res?.data?.result?.[0];

    if (apiResult?.status === "success" || apiResult?.code === "1") {
      dispatch(
        setAlert({
          msg: apiResult?.msg || "Reset link sent to your email 📩",
          type: AlertTypes.SUCCESS,
        })
      );
      dispatch(actions.forgotSuccess());
      return true;
    }

    dispatch(
      setAlert({
        msg: apiResult?.msg || "User ID not found",
        type: AlertTypes.ERROR,
      })
    );
    dispatch(actions.forgotFailed());
    return false;

  } catch (error: any) {

    // ⭐⭐ BACKEND 500 BUT MAIL SENT CASE ⭐⭐
    const apiResult = error?.response?.data?.result?.[0];

    if (apiResult?.status === "success" || apiResult?.code === "1") {
      dispatch(
        setAlert({
          msg: apiResult?.msg || "Reset link sent to your email 📩",
          type: AlertTypes.SUCCESS,
        })
      );
      dispatch(actions.forgotSuccess());
      return true;
    }

    // ❌ real error
    dispatch(
      setAlert({
        msg: apiResult?.msg || "User ID not found",
        type: AlertTypes.ERROR,
      })
    );
    dispatch(actions.forgotFailed());
    return false;
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
  dispatch(actions.logoutSuccess());
  dispatch(
    setAlert({
      msg: 'You are logged out!',
      type: AlertTypes.WARNING,
    }),
  );
};

// ================= TYPES =================
export interface ReqSetupPassword {
  EmpNum: string;
  Token: string;
  NewPassword: string;
  Data_Flag: string;
}

// ================= THUNK =================
export const setupNewPassword =
  (payload: ReqSetupPassword) => async (dispatch: any) => {
    try {
      console.log("SETUP PASSWORD FINAL PAYLOAD 🚀", payload);

      const res = await axiosInstance.post(
        "/login/ResetPasswordConfirm",
        payload
      );

      console.log("SETUP PASSWORD RESPONSE ✅", res.data);

      // 🔥 NEW SUCCESS CONDITION (as per real API)
      if (res?.data?.status?.toLowerCase() === "success") {
        dispatch(
          setAlert({
            msg: res.data.msg || "Password changed successfully ✅",
            type: AlertTypes.SUCCESS,
          })
        );

        dispatch(actions.setupPasswordSuccess());
        return true;
      }

      // ❌ If API returns failure status
      dispatch(
        setAlert({
          msg: res?.data?.msg || "Unable to reset password ❌",
          type: AlertTypes.ERROR,
        })
      );

      return false;
    } catch (error: any) {
      console.log("SETUP PASSWORD ERROR ❌", error?.response?.data || error);

      dispatch(
        setAlert({
          msg:
            error?.response?.data?.msg ||
            "Server error while resetting password",
          type: AlertTypes.ERROR,
        })
      );

      return false;
    }
  };