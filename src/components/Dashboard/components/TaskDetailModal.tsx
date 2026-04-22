import React, { useEffect, useState } from 'react';
import { TaskItem } from './types';

interface TaskDetailModalProps {
  task: TaskItem | null;
  onClose: () => void;
}

interface TaskFile {
  filepath?: string;
}

const parseTaskFiles = (taskfiles?: string | null): TaskFile[] => {
  if (!taskfiles) {
    return [];
  }

  try {
    const parsedFiles = JSON.parse(taskfiles);
    return Array.isArray(parsedFiles) ? parsedFiles : [];
  } catch (error) {
    return [];
  }
};

const getFileName = (filePath = '') => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return normalizedPath.split('/').pop() || 'View file';
};

export const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  const [completed, setCompleted] = useState(false);
  const [reason, setReason] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [forwardedTo, setForwardedTo] = useState('ALL');

  useEffect(() => {
    setCompleted(task?.completed === 'Y');
    setReason(task?.not_comp_reason || task?.taskremakrs || '');
    setVideoUrl(task?.video_url || '');
    setForwardedTo('ALL');
  }, [task]);

  if (!task) {
    return null;
  }

  const taskFiles = parseTaskFiles(task.taskfiles);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div
          className="modal-dialog modal-dialog-centered dashboard-task-modal"
          role="document"
        >
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header p-4">
              <div>
                <h4 className="modal-title mb-1">Task Detail</h4>
                <div className="text-muted fs-7">
                  Sr No: {task.RowNumber} | Program ID: {task.pg_id} | Task ID:{' '}
                  {task.tid}
                </div>
                <div className="fw-bold text-dark">{task.name_eng}</div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-icon btn-active-color-primary"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">
              <div className="mb-5">
                <div className="fw-bolder text-dark mb-1">{task.task}</div>
                <div className="text-muted fs-7">
                  Task Date: {task.tdate || '-'} | Due Task Date:{' '}
                  {task.due_task_date || '-'}
                </div>
                <div className="text-muted fs-7">
                  Program Date: {task.from_doe || '-'} To {task.to_doe || '-'}
                </div>
                <div className="text-muted fs-7">
                  Reason Detail: {task.reasondtl || '-'}
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle dashboard-task-form-table">
                  <thead>
                    <tr>
                      <th>Responsible Person</th>
                      <th>Completed</th>
                      <th>Not Complete Reason</th>
                      <th>Attachment</th>
                      <th>Add Video URL</th>
                      <th>Forwarded</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        <div className="fw-bold text-dark">
                          {task.responsible_person || '-'}
                        </div>
                        <div className="text-muted fs-8">
                          Confirm By: {task.confirm_by_name || '-'}
                        </div>
                        <div className="text-muted fs-8">
                          Emp No: {task.emp_num || '-'}
                        </div>
                      </td>

                      <td>
                        <label className="form-check form-check-sm form-check-custom form-check-solid mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={completed}
                            onChange={event =>
                              setCompleted(event.target.checked)
                            }
                          />
                          <span className="form-check-label fw-bold">Y</span>
                        </label>
                        <div className="fs-7 text-dark mb-3">
                          {task.cdate || (completed ? task.tdate : '') || '-'}
                        </div>
                        <label className="form-label fs-8 text-muted mb-1">
                          Due Task Date
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm mb-3"
                          value={task.due_task_date || ''}
                          readOnly
                        />
                        <div className="fs-7 text-dark">
                          Revert Count-{task.revertcount || '0'}
                        </div>
                      </td>

                      <td>
                        <textarea
                          className="form-control form-control-sm mb-2"
                          rows={3}
                          value={reason}
                          onChange={event => setReason(event.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn btn-link btn-sm p-0"
                        >
                          Save
                        </button>
                      </td>

                      <td>
                        <input
                          type="file"
                          className="form-control form-control-sm mb-2"
                        />
                        <button
                          type="submit"
                          className="btn btn-light-primary btn-sm mb-2"
                        >
                          Upload
                        </button>
                        {taskFiles.length ? (
                          <div className="d-flex flex-column gap-1">
                            {taskFiles.map(file => (
                              <a
                                key={file.filepath}
                                href={file.filepath}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {getFileName(file.filepath)}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted fs-8">No file</span>
                        )}
                      </td>

                      <td>
                        <label className="form-label fs-8 text-muted mb-1">
                          Video URL
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          value={videoUrl}
                          onChange={event => setVideoUrl(event.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn btn-link btn-sm p-0"
                        >
                          Save
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-light-primary btn-sm mb-2"
                        >
                          Forward To
                        </button>
                        <select
                          className="form-select form-select-sm"
                          value={forwardedTo}
                          onChange={event => setForwardedTo(event.target.value)}
                        >
                          <option value="ALL">ALL</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save Detail
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
};
