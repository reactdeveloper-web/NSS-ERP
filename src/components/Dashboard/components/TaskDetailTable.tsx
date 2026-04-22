import React, { useState } from 'react';
import { TaskItem } from './types';
import { TaskDetailModal } from './TaskDetailModal';

interface TaskDetailTableProps {
  tasks: TaskItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const TaskDetailTable = ({
  tasks,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: TaskDetailTableProps) => {
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startRecord = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRecord =
    totalCount === 0 ? 0 : Math.min(pageNumber * pageSize, totalCount);
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const safeStartPage = Math.max(1, pageNumber - 2);
      const safeEndPage = Math.min(totalPages, safeStartPage + 4);
      const adjustedStartPage = Math.max(1, safeEndPage - 4);

      return adjustedStartPage + index;
    },
  );

  return (
    <>
      <div className="table-responsive stickyTable">
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4 dashboard-task-detail-table">
          <thead>
            <tr className="fw-bolder text-muted">
              <th  align='center'>Sr.No.</th>
              <th  align='center'>Program&nbsp;ID</th>
              <th  align='center'>Task&nbsp;ID</th>
              <th>Program Name / Date</th>
              <th>Task Names</th>
              <th align='center'>Task Date</th>
              <th align='center'>Completed</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map(task => (
              <tr
                key={`${task.tid}-${task.RowNumber}`}
                className="cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <td align='center'>{task.RowNumber}</td>
                <td align='center'>{task.pg_id}</td>
                <td align='center'>{task.tid}</td>
                <td>
                  <div className="fw-bold text-dark">{task.name_eng}</div>
                  <span className="text-muted fs-7">
                    {task.from_doe} To {task.to_doe}
                  </span>
                </td>
                <td>{task.task}</td>
                <td align='center'>{task.tdate}</td>
                <td  align='center'>
                  <span
                    className={`badge fs-8 fw-bolder ${
                      task.completed === 'Y'
                        ? 'badge-light-success'
                        : 'badge-light-warning'
                    }`}
                  >
                    {task.completed === 'Y' ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}

            {!tasks.length && (
              <tr>
                <td colSpan={7} className="text-center text-muted fw-bold">
                  No task records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-stack flex-wrap pt-5">
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted fs-7">Show</span>
          <select
            className="form-select form-select-sm form-select-solid w-100px"
            value={pageSize}
            onChange={event => {
              onPageSizeChange(Number(event.target.value));
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-muted fs-7">per page</span>
        </div>

        <div className="d-flex align-items-center gap-4">
          <span className="text-muted fs-7">
            Showing {startRecord} to {endRecord} of {totalCount}
          </span>
          <ul className="pagination pagination-circle pagination-outline mb-0">
            <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
              >
                &laquo;
              </button>
            </li>
            {pageNumbers.map(page => (
              <li
                key={page}
                className={`page-item ${page === pageNumber ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                pageNumber >= totalPages ? 'disabled' : ''
              }`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() =>
                  onPageChange(Math.min(totalPages, pageNumber + 1))
                }
              >
                &raquo;
              </button>
            </li>
          </ul>
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
};
