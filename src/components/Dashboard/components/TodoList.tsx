import React from 'react';
import { DashboardItem } from './types';

const colors = ['success', 'warning', 'primary', 'info', 'danger'];

interface TodoListProps {
  items: DashboardItem[];
  activeId?: number;
  loading: boolean;
  onSelect: (item: DashboardItem) => void;
}

export const TodoList = ({
  items,
  activeId,
  loading,
  onSelect,
}: TodoListProps) => (
  <div className="card card-xl-stretch mb-xl-8">
    <div className="card-header border-0">
      <h3 className="card-title fw-bolder text-dark">Todo</h3>
    </div>

    <div className="card-body pt-2">
      {loading && <div className="text-muted fw-bold">Loading...</div>}

      {!loading && !items.length && (
        <div className="text-muted fw-bold">No dashboard records found.</div>
      )}

      {items.map((item, index) => {
        const color = colors[index % colors.length];

        return (
          <div className="d-flex align-items-center mb-8" key={item.PanelId}>
            <span className={`bullet bullet-vertical h-40px bg-${color}`} />

            <div className="flex-grow-1 mx-5">
              <a
                href="#"
                onClick={event => {
                  event.preventDefault();
                  onSelect(item);
                }}
                className={`text-gray-800 text-hover-primary fw-bolder fs-6 ${
                  activeId === item.PanelId ? 'text-primary' : ''
                }`}
              >
                {item.Panel}
              </a>
              <span className="text-muted fw-bold d-block">
                {item.Description}
              </span>
            </div>

            <span className={`badge badge-light-${color} fs-8 fw-bolder`}>
              {item.RecordCount}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);
