import React from 'react';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingTimePicker } from 'src/components/Common/FloatingTimePicker';

export interface TicketFollowUpItem {
  id: number;
  date: string;
  time: string;
  note: string;
}

interface TicketFollowUpTabProps {
  items: TicketFollowUpItem[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onChange: (
    id: number,
    field: 'date' | 'time' | 'note',
    value: string,
  ) => void;
}

export const TicketFollowUpTab = ({
  items,
  onAdd,
  onRemove,
  onChange,
}: TicketFollowUpTabProps) => {
  return (
    <>
      <div id="followHint" className="text-muted">
        Follow-up fields will appear after clicking <b>Add Follow-up</b>
      </div>

      <div className="card mb-8 mt-5">
        <div className="card-header" style={{ alignItems: 'center' }}>
          <h3 className="card-title">Follow-up</h3>
          <button
            type="button"
            className="btn btn-sm btn-light-primary"
            onClick={onAdd}
          >
            + Add Follow-up
          </button>
        </div>

        <div className="card-body p-0">
          <div id="followContainer" className="p-5">
            {items.length ? (
              <div className="d-flex flex-column gap-4">
                {items.map((followUp, index) => (
                  <div key={followUp.id} className="announce-master-panel">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h5 className="mb-0">Follow-up {index + 1}</h5>
                      <button
                        type="button"
                        className="btn btn-sm btn-light-danger"
                        onClick={() => onRemove(followUp.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-3">
                        <FloatingDatePicker
                          id={`followup-date-${followUp.id}`}
                          label="Date"
                          value={followUp.date}
                          onChange={value =>
                            onChange(followUp.id, 'date', value)
                          }
                        />
                      </div>

                      <div className="col-md-3">
                        <FloatingTimePicker
                          id={`followup-time-${followUp.id}`}
                          label="Time"
                          value={followUp.time}
                          onChange={value =>
                            onChange(followUp.id, 'time', value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <FloatingInputField
                          id={`followup-note-${followUp.id}`}
                          label="Note"
                          value={followUp.note}
                          onChange={value =>
                            onChange(followUp.id, 'note', value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
