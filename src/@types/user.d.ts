interface ReqLogin {
  username: string;
  password: string;
  email?: string;
}

interface ReqForgot {
  empNum: number;
  DataFlag: string;
}

interface ResLoginApi extends Res {
  data: {
    id: string;
    username: string;
    email: string;
    password: string;
  };
}

interface IUser {
  id: string;
  empNum: number;
  empName?: string;
  emp_name?: string;
  deptName?: string;
  dept_name?: string;
  department?: string;
  status?: string;
  username: string;
  email?: string;
  password: string;
  accessToken?: string;
  DataFlag?: string;
  Dataflag?: string;
  Data_Flag?: string;
  dataFlag?: string;
  dataflag?: string;
  hod?: string | number;
  HOD?: string | number;
  hodEmpNum?: string | number;
  HODEmpNum?: string | number;
  hodNum?: string | number;
  HOD_EMP_NUM?: string | number;
  hod_emp_num?: string | number;
}

interface ReqUserActivity {
  empnum: string;
  DataFlag: string;
  Type: any;
  Show: '';
}

interface DispatchAuth {
  type: string;
  payload?: any;
}
