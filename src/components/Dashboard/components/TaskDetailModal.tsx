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
              <h4 className="mb-1 dashboard-panel-title fs-3">Task Detail</h4>
              <div className="text-primary mt-1 fs-6">
                Sr No: {task.RowNumber} | Program ID: {task.pg_id} | Task ID:{' '}
                {task.tid}
              </div>
              <div className="text-muted mt-1 fw-bold fs-6">{task.name_eng}</div>
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

          <div className="dashboard-slide-body dashboard-bill-panel-body">
            <section className="card p-4 mb-3 border">
              <div className="dashboard-bill-label">Task</div>
              <div className="dashboard-bill-text fw-bolder mb-2">{task.task}</div>
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
            </section>

            <section className="card p-4 mb-3 border">
              <div className="row g-4">
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Responsible Person</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(task.responsible_person)}
                </div>
                <div className="text-muted fs-8">
                  Emp No: {formatValue(task.emp_num)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Confirm By</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(task.confirm_by_name)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Completed</div>
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
                <div className="dashboard-bill-label">Completed Date</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(task.cdate || (completed ? task.tdate : ''))}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Due Task Date</div>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={task.due_task_date || ''}
                  readOnly
                />
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Revert Count</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(task.revertcount || '0')}
                </div>
              </div>
            </div>
            </section>

            <section className="card p-4 mb-3 border">
              <h5 className="dashboard-bill-section-title">Not Complete Reason</h5>
              <textarea
                className="form-control form-control-sm"
                rows={4}
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
            </section>

            <section className="card p-4 mb-3 border">
              <h5 className="dashboard-bill-section-title">Attachment</h5>
              <input type="file" className="form-control form-control-sm mb-3" />
              {taskFiles.length ? (
                <div className="dashboard-bill-link-list">
                  {taskFiles.map(file => {
                    const filePath = getTaskFilePath(file);

                    return (
                      <a
                        key={filePath}
                        href={filePath}
                        target="_blank"
                        rel="noreferrer"
                        className="dashboard-bill-link-item"
                      >
                        <div className="dashboard-bill-link-icon">
                          <i className="fa fa-paperclip" aria-hidden="true" />
                        </div>
                        <div className="dashboard-bill-link-content">
                          <p>{getFileName(filePath)}</p>
                          <span>{formatValue(filePath)}</span>
                        </div>
                        <i className="fa fa-external-link" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <span className="text-muted fs-8">No file</span>
              )}
            </section>

            <section className="card p-4 mb-3 border">
              <h5 className="dashboard-bill-section-title">Video URL</h5>
              <input
                type="text"
                className="form-control form-control-sm"
                value={videoUrl}
                onChange={event => setVideoUrl(event.target.value)}
              />
            </section>

            <section className="card p-4 mb-3 border">
              <h5 className="dashboard-bill-section-title">Forwarded</h5>
              <select
                className="form-select form-select-sm"
                value={forwardedTo}
                onChange={event => setForwardedTo(event.target.value)}
              >
                <option value="ALL">ALL</option>
              </select>
            </section>

            <section className="card p-4 mb-3 border table-responsive">
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
            </section>
          </div>

          <div className="dashboard-slide-footer dashboard-bill-action-footer">
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
