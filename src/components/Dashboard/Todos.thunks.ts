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

// export const getTodos = (payload: ReqUserActivity) => async dispatch => {
//   const userJson = localStorage.getItem('user') || '{}';
//   const user = JSON.parse(userJson);
//   //console.log('userJson',userJson);

//   const reqUserActivity: ReqUserActivity = {
//   empnum: user.empNum,
//   DataFlag: "GANGOTRI",
//   Type: 1,
//   Show : ""
//   };

//  //console.log('reqUserActivity',reqUserActivity)

//   try {
//     //console.log('call getTodos');
//     const res = await axiosInstance.post(`/master/GetDashboard`,
//       reqUserActivity
//     );
//       if (res) {
//         console.log('res',res);
//         const todos = res.data.Dashboard;
//         console.log('todos',todos);
//         dispatch(actions.getTodosSuccess(todos));
//       }

//     } catch (error) {
//       dispatchError(dispatch, error);
//     }

// };

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
    //const res = await axios.get(`${URL.baseAPIUrl}/api/products`);
    const todos = res.data.Dashboard;
    console.log('todo-thunk', todos);
    dispatch(actions.getTodosSuccess(todos));
    //console.log('aa',aa);
  } catch (error) {
    dispatchError(dispatch, error);
  }
};

export const clearProduct = () => dispatch => {
  dispatch(actions.clearProductSuccess());
};
