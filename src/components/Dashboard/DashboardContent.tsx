import React, { useCallback, useEffect, useState } from 'react';
import { getDashboard, getEmployeeAll } from 'src/api/masterApi';
import { PageToolbar } from 'src/components/Common/PageToolbar';
import axiosInstance from 'src/redux/interceptor';
import { TaskTable } from './components/TaskTable';
import { TodoList } from './components/TodoList';
import { DashboardItem, StaticTaskRow, TaskItem } from './components/types';

const staticTodoItems: DashboardItem[] = [
  createStaticItem(-1, 'My RRS Status', 'Due in 2 Days', 1),
  createStaticItem(-2, 'Events', 'Due in 3 Days', 12),
  createStaticItem(-3, 'Tickets', 'Due in 5 Days', 8),
  createStaticItem(-4, 'Daily Report', 'Due in 2 Days', 1),
  createStaticItem(-5, 'Leave or Tour Records', 'Due in 12 Days', 2),
  createStaticItem(-6, 'Event Task Pending', 'Due in 1 week', 10),
];

const staticRows: StaticTaskRow[] = [
  {
    id: '01',
    title: 'Pen',
    subTitle: 'Description',
    department: 'Intertico',
    status: 'Completed',
  },
  {
    id: '02',
    title: 'Headphone',
    subTitle: 'Description',
    department: 'Agoda',
    status: 'Cancelled',
  },
  {
    id: '03',
    title: 'Diary',
    subTitle: 'Description',
    department: 'RoadGee',
    status: 'Pending',
  },
];

function createStaticItem(
  PanelId: number,
  Panel: string,
  Description: string,
  RecordCount: number,
): DashboardItem {
  return {
    PanelId,
    Panel,
    Description,
    RecordCount,
    iconpath: '',
    service_status: 'A',
    source: 'static',
  };
}

const getStoredUser = () => JSON.parse(localStorage.getItem('user') || '{}');
const getEmpNum = () => {
  const user = getStoredUser();
  return user.empNum || user.empnum || 267;
};

const getDataFlag = () => {
  const user = getStoredUser();
  return (
    user.DataFlag ||
    user.Dataflag ||
    user.Data_Flag ||
    user.dataFlag ||
    user.dataflag ||
    'GANGOTRI'
  );
};

const getEmployeeName = () => {
  const user = getStoredUser();
  return user.empName || user.emp_name || user.username || 'User';
};

const getDepartmentName = () => {
  const user = getStoredUser();
  return user.deptName || user.dept_name || user.department || 'Department';
};

const getHodCode = () => {
  const user = getStoredUser();
  return (
    user.hod ||
    user.HOD ||
    user.hodEmpNum ||
    user.HODEmpNum ||
    user.hodNum ||
    user.HOD_EMP_NUM ||
    user.hod_emp_num ||
    ''
  );
};

const getTaskFilterType = (item: DashboardItem) =>
  item.Panel === 'Meeting Points Confirmation' ? '16' : String(item.PanelId);

const normalizeCode = (value: unknown) =>
  String(value ?? '')
    .replace(/\.0$/, '')
    .trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

const getEmployeeRecords = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
};

const findEmployeeNameByCode = (payload: unknown, hodCode: unknown) => {
  const normalizedHodCode = normalizeCode(hodCode);

  const match = getEmployeeRecords(payload).find(record =>
    [
      record.emp_num,
      record.Emp_Num,
      record.empNum,
      record.EmpNum,
      record.emp_code,
      record.Emp_Code,
      record.empCode,
    ].some(value => normalizeCode(value) === normalizedHodCode),
  );

  return (
    match?.emp_name ||
    match?.Emp_Name ||
    match?.empName ||
    match?.EmpName ||
    match?.name_eng ||
    match?.Name_Eng ||
    ''
  );
};

export const DashboardContent: React.FC = () => {
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [activeItem, setActiveItem] = useState<DashboardItem | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [showStaticTable, setShowStaticTable] = useState(false);
  const [taskPageNumber, setTaskPageNumber] = useState(1);
  const [taskPageSize, setTaskPageSize] = useState(10);
  const [taskTotalCount, setTaskTotalCount] = useState(0);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');
  const [hodName, setHodName] = useState('');
  const hodCode = getHodCode();
  const toolbarDescription = `${getEmployeeName()} (${getEmpNum()}) ${getDepartmentName()} - HOD : ${
    hodName || hodCode || '-'
  }`;

  const fetchTasks = useCallback(async (
    item: DashboardItem,
    pageNumber = 1,
    pageSize = 10,
  ) => {
    setActiveItem(item);
    setTaskPageNumber(pageNumber);
    setTaskPageSize(pageSize);

    if (item.source === 'static') {
      setTasks([]);
      setTaskTotalCount(staticRows.length);
      setShowStaticTable(true);
      setLoadingTasks(false);
      setError('');
      return;
    }

    setShowStaticTable(false);
    setLoadingTasks(true);
    setError('');

    try {
      const response = await axiosInstance.post('/Task/GetTasks', {
        taskid: '0',
        filterempnum: '',
        filterfdate: '',
        filtertdate: '',
        filtertype: getTaskFilterType(item),
        empnum: String(getEmpNum()),
        dataflag: getDataFlag(),
        Type: '2',
        PageIndex: String(pageNumber),
        PageSize: String(pageSize),
      });

      const taskRows = response.data?.taskdetail || [];
      setTasks(taskRows);
      setTaskTotalCount(taskRows[0]?.RecordCount || 0);
    } catch (apiError) {
      setTasks([]);
      setTaskTotalCount(0);
      setError('Unable to load task listing.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const handleTaskPageChange = (pageNumber: number) => {
    if (!activeItem) {
      return;
    }

    fetchTasks(activeItem, pageNumber, taskPageSize);
  };

  const handleTaskPageSizeChange = (pageSize: number) => {
    if (!activeItem) {
      return;
    }

    fetchTasks(activeItem, 1, pageSize);
  };

  const fetchDashboard = useCallback(async () => {
    setLoadingTodos(true);
    setError('');

    try {
      const response = await getDashboard({
        empnum: getEmpNum(),
        DataFlag: getDataFlag(),
        Type: 1,
        Show: 'Testing',
      });

      const dashboardItems = response.data?.Dashboard || [];
      const allDashboardItems = [...staticTodoItems, ...dashboardItems];
      setItems(allDashboardItems);

      if (allDashboardItems.length) {
        fetchTasks(allDashboardItems[0]);
      }
    } catch (apiError) {
      setError('Unable to load dashboard todo list.');
    } finally {
      setLoadingTodos(false);
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const loadHodName = async () => {
      if (!hodCode) {
        return;
      }

      try {
        const response = await getEmployeeAll({
          emp_num: 0,
          dm_id: 0,
          emp_code: 0,
        });
        const nextHodName = findEmployeeNameByCode(response.data, hodCode);
        setHodName(nextHodName ? String(nextHodName) : '');
      } catch (apiError) {
        setHodName('');
      }
    };

    loadHodName();
  }, [hodCode]);

  return (
    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
      <PageToolbar title="Dashboard" description={toolbarDescription} />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-3">
              <TodoList
                items={items}
                activeId={activeItem?.PanelId}
                loading={loadingTodos}
                onSelect={item => fetchTasks(item, 1, taskPageSize)}
              />
            </div>

            <div className="col-md-9">
              <TaskTable
                title={activeItem?.Panel || 'Task Listing'}
                tasks={tasks}
                loading={loadingTasks}
                staticRows={showStaticTable ? staticRows : undefined}
                pageNumber={taskPageNumber}
                pageSize={taskPageSize}
                totalCount={taskTotalCount}
                onPageChange={handleTaskPageChange}
                onPageSizeChange={handleTaskPageSizeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
