import React, { useMemo, useState } from 'react';
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
}: TaskTableProps) => {
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredTasks = useMemo(() => {
    if (!isSearchActive) {
      return tasks;
    }

    return tasks.filter(task =>
      [
        task.RowNumber,
        task.pg_id,
        task.tid,
        task.name_eng,
        task.from_doe,
        task.to_doe,
        task.task,
        task.tdate,
        task.completed === 'Y' ? 'Yes' : 'No',
      ]
        .map(value => String(value ?? ''))
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, normalizedSearch, tasks]);

  return (
    <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
      <div className="card-header pt-3 pb-3">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder fs-3 mb-1">{title}</span>
          <span className="text-muted mt-1 fw-bold fs-7">
            {staticRows
              ? staticRows.length
              : isSearchActive
                ? filteredTasks.length
                : tasks[0]?.RecordCount || 0}{' '}
            records
          </span>
        </h3>
        {!staticRows && (
          <div className="card-toolbar  m-0">
            <input
              type="text"
              className="form-control form-control-sm form-control-solid w-250px"
              placeholder="Advance Search"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>
        )}
      </div>

      <div className="card-body py-3 dashboard-listing-body">
        {loading ? (
          <div className="text-muted fw-bold">Loading...</div>
        ) : staticRows ? (
          <StaticTaskTable rows={staticRows} />
        ) : (
          <TaskDetailTable
            tasks={filteredTasks}
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalCount={isSearchActive ? filteredTasks.length : totalCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            isSearchActive={isSearchActive}
          />
        )}
      </div>
    </div>
  );
};

const StaticTaskTable = ({ rows }: { rows: StaticTaskRow[] }) => (
  <div className="dashboard-listing-content">
    <div className="table-responsive dashboard-listing-table">
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
  </div>
);
