import React from 'react';
import { StaticTaskRow, TaskItem } from './types';

interface TaskTableProps {
  title: string;
  tasks: TaskItem[];
  loading: boolean;
  staticRows?: StaticTaskRow[];
}

export const TaskTable = ({
  title,
  tasks,
  loading,
  staticRows,
}: TaskTableProps) => (
  <div className="card card-xl-stretch mb-5 mb-xl-8">
    <div className="card-header border-0 pt-5">
      <h3 className="card-title align-items-start flex-column">
        <span className="card-label fw-bolder fs-3 mb-1">{title}</span>
        <span className="text-muted mt-1 fw-bold fs-7">
          {staticRows ? staticRows.length : tasks[0]?.RecordCount || 0} records
        </span>
      </h3>
    </div>

    <div className="card-body py-3">
      {loading ? (
        <div className="text-muted fw-bold">Loading...</div>
      ) : staticRows ? (
        <StaticTaskTable rows={staticRows} />
      ) : (
        <ApiTaskTable tasks={tasks} />
      )}
    </div>
  </div>
);

const ApiTaskTable = ({ tasks }: { tasks: TaskItem[] }) => (
  <div className="table-responsive">
    <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
      <thead>
        <tr className="fw-bolder text-muted">
          <th>Sr No./Task Id/Program Id</th>
          <th>Program Date/Name</th>
          <th>Task Names</th>
          <th>Days</th>
          <th>Task Date</th>
          <th>Responsible Person</th>
          <th>Completed</th>
          <th>Confirm By</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map(task => (
          <tr key={`${task.tid}-${task.RowNumber}`}>
            <td>
              {task.RowNumber}/{task.tid}/{task.pg_id}
            </td>
            <td>
              <div className="fw-bold text-dark">{task.name_eng}</div>
              <span className="text-muted fs-7">
                {task.from_doe} To {task.to_doe}
              </span>
            </td>
            <td>{task.task}</td>
            <td>{task.days}</td>
            <td>{task.tdate}</td>
            <td>{task.responsible_person}</td>
            <td>{task.completed}</td>
            <td>{task.confirm_by_name || '-'}</td>
          </tr>
        ))}

        {!tasks.length && (
          <tr>
            <td colSpan={8} className="text-center text-muted fw-bold">
              No task records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const StaticTaskTable = ({ rows }: { rows: StaticTaskRow[] }) => (
  <div className="table-responsive">
    <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
      <thead>
        <tr className="fw-bolder text-muted">
          <th>ID</th>
          <th>Items</th>
          <th>Department</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>
              <div className="fw-bold text-dark">{row.title}</div>
              <span className="text-muted fs-7">{row.subTitle}</span>
            </td>
            <td>{row.department}</td>
            <td>
              <span className="badge badge-light-primary fs-8 fw-bolder">
                {row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
