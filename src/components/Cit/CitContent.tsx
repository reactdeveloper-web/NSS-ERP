import React, { useState } from 'react';
import {
  CallCenterTicketForm,
  CallCenterTicketTab,
} from './components/CallCenterTicketTab';
import {
  TicketFollowUpItem,
  TicketFollowUpTab,
} from './components/TicketFollowUpTab';

type CitTabKey = 'cit' | 'followup';

const getToday = () => new Date().toISOString().split('T')[0];

const createInitialTicketForm = (): CallCenterTicketForm => ({
  ticketId: 'AUTO/VIEW',
  date: getToday(),
  ngCode: '',
  callCategoryName: '',
  selectType: '',
  requestBy: '',
  country1: 'India',
  mobileNo1: '',
  country2: '',
  mobileNo2: '',
  callBackDate: '',
  callBackTime: '',
  pincode: '',
  state: '',
  district: '',
  details: '',
});

export const CitContent = () => {
  const [activeTab, setActiveTab] = useState<CitTabKey>('cit');
  const [completed, setCompleted] = useState(false);
  const [ticketForm, setTicketForm] = useState<CallCenterTicketForm>(
    createInitialTicketForm,
  );
  const [followUps, setFollowUps] = useState<TicketFollowUpItem[]>([]);

  const handleTicketFormChange = <K extends keyof CallCenterTicketForm>(
    field: K,
    value: CallCenterTicketForm[K],
  ) => {
    setTicketForm(current => ({ ...current, [field]: value }));
  };

  const handleAddFollowUp = () => {
    setFollowUps(current => [
      ...current,
      { id: Date.now(), date: '', time: '', note: '' },
    ]);
  };

  const handleFollowUpChange = (
    id: number,
    field: 'date' | 'time' | 'note',
    value: string,
  ) => {
    setFollowUps(current =>
      current.map(item =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleRemoveFollowUp = (id: number) => {
    setFollowUps(current => current.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setTicketForm(createInitialTicketForm());
    setFollowUps([]);
    setCompleted(false);
    setActiveTab('cit');
  };

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-6">
          <div className="card mb-8">
            <div className="card-header">
              <div className="card-title">
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  <h3 className="fw-bold mb-0">Ticket Details</h3>
                  <span className="text-muted fs-6">CIT Form</span>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="tabs-mobile-scroll">
                <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mb-6">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'cit' ? 'active' : ''
                      }`}
                      type="button"
                      onClick={() => setActiveTab('cit')}
                    >
                      1. Call Center Ticket
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'followup' ? 'active' : ''
                      }`}
                      type="button"
                      onClick={() => setActiveTab('followup')}
                    >
                      2. Follow Up
                    </button>
                  </li>
                </ul>
              </div>

              <div className="tab-content">
                <div
                  className={`tab-pane fade ${
                    activeTab === 'cit' ? 'show active' : ''
                  }`}
                >
                  <CallCenterTicketTab
                    form={ticketForm}
                    onChange={handleTicketFormChange}
                  />
                </div>

                <div
                  className={`tab-pane fade ${
                    activeTab === 'followup' ? 'show active' : ''
                  }`}
                >
                  <TicketFollowUpTab
                    items={followUps}
                    onAdd={handleAddFollowUp}
                    onRemove={handleRemoveFollowUp}
                    onChange={handleFollowUpChange}
                  />
                </div>
              </div>

              <div className="separator separator-dashed my-6"></div>

              <div className="d-flex justify-content-between pt-1 px-0 flex-wrap gap-4">
                <label className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={completed}
                    onChange={event => setCompleted(event.target.checked)}
                  />
                  <span className="form-check-label fw-semibold">
                    Completed
                  </span>
                </label>

                <div className="d-flex gap-3">
                  <button className="btn btn-primary" type="button">
                    Save
                  </button>
                  <button
                    className="btn btn-light-danger"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
