import React from 'react';
import { TaskDetailTable } from './TaskDetailTable';
import { StaticTaskRow, TaskItem } from './types';

interface TaskTableProps {
  title: string;
  tasks: TaskItem[];
  loading: boolean;
  staticRows?: StaticTaskRow[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const TaskTable = ({
  title,
  tasks,
  loading,
  staticRows,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: TaskTableProps) => (
  <div className="card h-100 mb-5 mb-xl-8">
    <div className="card-header border-0 pt-5">
      <h3 className="card-title align-items-start flex-column">
        <span className="card-label fw-bolder fs-3 mb-1">{title}</span>
        <span className="text-muted mt-1 fw-bold fs-7">
          {staticRows ? staticRows.length : tasks[0]?.RecordCount || 0} records
        </span>
      </h3>
    </div>

    <div className="card-body py-3" style={{maxHeight:"620px", overflow:'auto'}}>
      {loading ? (
        <div className="text-muted fw-bold">Loading...</div>
      ) : staticRows ? (
        <StaticTaskTable rows={staticRows} />
      ) : (
        <TaskDetailTable
          tasks={tasks}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
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
