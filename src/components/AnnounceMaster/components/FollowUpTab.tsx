import React from 'react';
import { Select } from 'antd';
import { FollowUpForm, FollowUpItem } from '../types';

interface FollowUpTabProps {
  form: FollowUpForm;
  items: FollowUpItem[];
  onChange: <K extends keyof FollowUpForm>(
    field: K,
    value: FollowUpForm[K],
  ) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}

export const FollowUpTab = ({
  form,
  items,
  onChange,
  onAdd,
  onRemove,
}: FollowUpTabProps) => {
  const renderFloatingSelect = (
    id: keyof Pick<FollowUpForm, 'assignTo' | 'status'>,
    label: string,
    value: string,
    options: { value: string; label: string }[],
  ) => (
    <div
      className={`form-floating ant-select-floating ${
        value ? 'has-value' : ''
      }`}
    >
      <Select
        id={id}
        placeholder=""
        showSearch
        allowClear
        value={value || undefined}
        onChange={nextValue => onChange(id, (nextValue as string) || '')}
        optionFilterProp="label"
        filterOption={(input, option) =>
          String(option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        options={options.map(option => ({
          value: option.value,
          label: option.label,
        }))}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );

  return (
    <div className="card border">
      <div className="card-header min-h-50px">
        <div className="card-title d-flex flex-column">
          <h5 className="fw-bold mb-1">Follow-up</h5>
          <span className="text-muted fs-8">
            Add follow-up tasks / reminders
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-5">
          <div className="col-md-3">
            <div className="form-floating ant-input-floating">
              <input
                id="followupDate"
                type="date"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.date}
                onChange={event => onChange('date', event.target.value)}
              />
              <label htmlFor="followupDate">Follow-up Date</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-floating ant-input-floating">
              <input
                id="followupTime"
                type="time"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.time}
                onChange={event => onChange('time', event.target.value)}
              />
              <label htmlFor="followupTime">Follow-up Time</label>
            </div>
          </div>

          <div className="col-md-3">
            {renderFloatingSelect('assignTo', 'Assign To', form.assignTo, [
              {
                value: 'Contact Center Executive',
                label: 'Contact Center Executive',
              },
              { value: 'Area Manager', label: 'Area Manager' },
              {
                value: 'HOD - Contact Center',
                label: 'HOD - Contact Center',
              },
            ])}
          </div>

          <div className="col-md-3">
            {renderFloatingSelect('status', 'Status', form.status, [
              { value: 'Open', label: 'Open' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Closed', label: 'Closed' },
            ])}
          </div>

          <div className="col-md-9">
            <div className="form-floating ant-input-floating">
              <input
                id="followupNote"
                type="text"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.note}
                onChange={event => onChange('note', event.target.value)}
              />
              <label htmlFor="followupNote">Follow-up Note</label>
            </div>
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              type="button"
              onClick={onAdd}
            >
              Add Follow-up
            </button>
          </div>
        </div>

        <div className="table-responsive mt-6">
          <table className="table table-rounded table-striped border gy-4 gs-4">
            <thead>
              <tr className="fw-bold fs-6 text-gray-800">
                <th>Date</th>
                <th>Time</th>
                <th>Assign To</th>
                <th>Status</th>
                <th>Note</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map(item => (
                  <tr key={item.id}>
                    <td>{item.date || '-'}</td>
                    <td>{item.time || '-'}</td>
                    <td>{item.assignTo || '-'}</td>
                    <td>{item.status}</td>
                    <td>{item.note || '-'}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-light-danger"
                        type="button"
                        onClick={() => onRemove(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-muted">
                    No follow-ups added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
