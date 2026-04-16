import axios from 'axios';
import { URL } from 'src/constants/urls';
import * as actions from './Todos.actions';
import { v4 as uuid } from 'uuid';
import { setAlert } from 'src/components/Alert/Alert.thunks';
import { AlertTypes } from 'src/constants/alerts';
import axiosInstance from '../../redux/interceptor';

interface ReqUserActivity {
  empnum: number;
  DataFlag: string;
  Type: number;
  Show: '';
}

const dispatchError = (dispatch, error) => {
  const payload = {
    msg: error.response?.statusText,
    status: error.response?.status,
  };
  dispatch(actions.todosError(payload));
  dispatch(
    setAlert({
      msg: error.response?.statusText,
      type: AlertTypes.ERROR,
    }),
  );
};

export const getTodos = () => async dispatch => {
  try {
    const userJson = localStorage.getItem('user') || '{}';
    const user = JSON.parse(userJson);

    const reqUserActivity: ReqUserActivity = {
      empnum: user.empNum,
      DataFlag: 'GANGOTRI',
      Type: 1,
      Show: '',
    };
    const res = await axiosInstance.post(
      `/master/GetDashboard`,
      reqUserActivity,
    );

    const todos = res.data.Dashboard;
    dispatch(actions.getTodosSuccess(todos));
  } catch (error) {
    dispatchError(dispatch, error);
  }
};

export const clearProduct = () => dispatch => {
  dispatch(actions.clearProductSuccess());
};
