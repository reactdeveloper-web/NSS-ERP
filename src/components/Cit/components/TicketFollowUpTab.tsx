import React, { useEffect } from 'react';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';

export interface TicketFollowUpItem {
  id: number;
  note: string;
  userId?: number;
  citId?: number;
  followupDate?: string;
  followupTime?: string;
  dataFlag?: string;
}

interface TicketFollowUpTabProps {
  items: TicketFollowUpItem[];
  disabled?: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onChange: (id: number, value: string) => void;
}

export const TicketFollowUpTab = ({
  items,
  disabled = false,
  onAdd,
  onRemove,
  onChange,
}: TicketFollowUpTabProps) => {
  useEffect(() => {
    if (disabled || items.length > 0) {
      return;
    }

    onAdd();
  }, [disabled, items.length, onAdd]);

  return (
    <>
      <div className="card">
        <div className="card-header p-0 mb-4" style={{ alignItems: 'center' }}>
          <h3 className="card-title flex-column m-0 p-0">Follow-up
            <div id="followHint" className="text-muted fs-7 mt-2 fw-normal">
        One follow-up field stays open by default. Click <b>Add Follow-up</b> to add more.
      </div>
          </h3>
           
          <button
            type="button"
            className="btn btn-sm btn-light-primary"
            onClick={onAdd}
            disabled={disabled}
          >
            + Add Follow-up
          </button>
        </div>
 
        <div className="card-body p-0">
          <div id="followContainer" className="p-0">
            {items.length ? (
              <div className="d-flex flex-column gap-4">
                {items.map((followUp, index) => (
                  <div key={followUp.id} className="announce-master-panel">
                    <div className="row g-4 align-items-center">
                      <div className="col-md-1">
                        <h5 className="mb-0">Follow-up {index + 1}</h5>
                      </div>
                      <div className="col-md-10">
                        <FloatingInputField
                          id={`followup-note-${followUp.id}`}
                          label="Note"
                          value={followUp.note}
                          disabled={disabled}
                          onChange={value => onChange(followUp.id, value)}
                        />
                      </div>
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-light-danger"
                          onClick={() => onRemove(followUp.id)}
                          disabled={disabled || items.length === 1}
                        >
                          Remove
                        </button>
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
