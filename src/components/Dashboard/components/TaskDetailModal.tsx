import React, { useEffect, useState } from 'react';
import { TaskItem } from './types';

interface TaskDetailModalProps {
  task: TaskItem | null;
  onClose: () => void;
}

interface TaskFile {
  filepath?: string;
  FilePath?: string;
  filePath?: string;
  ImagePath?: string;
  imagePath?: string;
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

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

const getTaskFilePath = (file: TaskFile) =>
  file.filepath ||
  file.FilePath ||
  file.filePath ||
  file.ImagePath ||
  file.imagePath ||
  '';

export const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reason, setReason] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [forwardedTo, setForwardedTo] = useState('ALL');

  useEffect(() => {
    if (!task) {
      return;
    }

    setCompleted(task?.completed === 'Y');
    setReason(task?.not_comp_reason || task?.taskremakrs || '');
    setVideoUrl(task?.video_url || '');
    setForwardedTo('ALL');
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [task]);

  if (!task) {
    return null;
  }

  const taskFiles = parseTaskFiles(task.taskfiles);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(onClose, 300);
  };

  return (
    <>
      <div
        className={`dashboard-slide-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={handleClose}
      />
      <aside
        className={`dashboard-slide-modal ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Task detail"
      >
        <form className="h-100 d-flex flex-column" onSubmit={handleSubmit}>
          <div className="dashboard-slide-header">
            <div>
              <h4 className="mb-1">Task Detail</h4>
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
              onClick={handleClose}
            >
              <i className="fa fa-times" aria-hidden="true" />
            </button>
          </div>

          <div className="dashboard-slide-body">
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

            <div className="row g-4 mb-5">
              <div className="col-sm-6">
                <label className="form-label fs-8 text-muted mb-1">
                  Responsible Person
                </label>
                <div className="fw-bold text-dark">
                  {formatValue(task.responsible_person)}
                </div>
                <div className="text-muted fs-8">
                  Emp No: {formatValue(task.emp_num)}
                </div>
              </div>
              <div className="col-sm-6">
                <label className="form-label fs-8 text-muted mb-1">
                  Confirm By
                </label>
                <div className="fw-bold text-dark">
                  {formatValue(task.confirm_by_name)}
                </div>
              </div>
              <div className="col-sm-6">
                <label className="form-label fs-8 text-muted mb-1">
                  Completed
                </label>
                <label className="form-check form-check-sm form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={completed}
                    onChange={event => setCompleted(event.target.checked)}
                  />
                  <span className="form-check-label fw-bold">Yes</span>
                </label>
              </div>
              <div className="col-sm-6">
                <label className="form-label fs-8 text-muted mb-1">
                  Completed Date
                </label>
                <div className="fw-bold text-dark">
                  {formatValue(task.cdate || (completed ? task.tdate : ''))}
                </div>
              </div>
              <div className="col-sm-6">
                <label className="form-label fs-8 text-muted mb-1">
                  Due Task Date
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={task.due_task_date || ''}
                  readOnly
                />
              </div>
              <div className="col-sm-6">
                <label className="form-label fs-8 text-muted mb-1">
                  Revert Count
                </label>
                <div className="fw-bold text-dark">
                  {formatValue(task.revertcount || '0')}
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label fs-8 text-muted mb-1">
                Not Complete Reason
              </label>
              <textarea
                className="form-control form-control-sm"
                rows={4}
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="form-label fs-8 text-muted mb-1">
                Attachment
              </label>
              <input type="file" className="form-control form-control-sm mb-3" />
              {taskFiles.length ? (
                <div className="d-flex flex-column gap-1">
                  {taskFiles.map(file => {
                    const filePath = getTaskFilePath(file);

                    return (
                      <a
                        key={filePath}
                        href={filePath}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {getFileName(filePath)}
                      </a>
                    );
                  })}
                </div>
              ) : (
                <span className="text-muted fs-8">No file</span>
              )}
            </div>

            <div className="mb-5">
              <label className="form-label fs-8 text-muted mb-1">
                Video URL
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={videoUrl}
                onChange={event => setVideoUrl(event.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="form-label fs-8 text-muted mb-1">
                Forwarded
              </label>
              <select
                className="form-select form-select-sm"
                value={forwardedTo}
                onChange={event => setForwardedTo(event.target.value)}
              >
                <option value="ALL">ALL</option>
              </select>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered align-middle dashboard-bill-modal-table">
                <tbody>
                  <tr>
                    <th>Address</th>
                    <td>{formatValue(task.address_eng)}</td>
                  </tr>
                  <tr>
                    <th>Check Remark</th>
                    <td>{formatValue(task.check_remark)}</td>
                  </tr>
                  <tr>
                    <th>Attachment Need</th>
                    <td>{task.attachmentdneed ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <th>Data Flag</th>
                    <td>{formatValue(task.data_flag)}</td>
                  </tr>
                  <tr>
                    <th>Penalty</th>
                    <td>{formatValue(task.penalty)}</td>
                  </tr>
                  <tr>
                    <th>Revert Remark</th>
                    <td>{formatValue(task.revert_remark)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-slide-footer">
            <button type="button" className="btn btn-light" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
