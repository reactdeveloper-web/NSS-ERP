import React from 'react';
import { CountryField } from 'src/components/Common/CountryField';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { FloatingTextareaField } from 'src/components/Common/FloatingTextareaField';
import { FloatingTimePicker } from 'src/components/Common/FloatingTimePicker';

export interface CallCenterTicketForm {
  ticketId: string;
  date: string;
  ngCode: string;
  callCategoryName: string;
  selectType: string;
  requestBy: string;
  country1: string;
  mobileNo1: string;
  country2: string;
  mobileNo2: string;
  callBackDate: string;
  callBackTime: string;
  details: string;
}

export interface CallCenterTicketValidationErrors {
  callCategoryName?: string;
  selectType?: string;
  requestBy?: string;
  callBackDate?: string;
  details?: string;
}

interface CallCenterTicketTabProps {
  form: CallCenterTicketForm;
  disabled?: boolean;
  errors?: CallCenterTicketValidationErrors;
  onChange: <K extends keyof CallCenterTicketForm>(
    field: K,
    value: CallCenterTicketForm[K],
  ) => void;
}

const callCategoryOptions = [
  { value: '', label: 'Select' },
  { value: 'Receipt Related', label: 'Receipt Related' },
  { value: 'Donation Related', label: 'Donation Related' },
  { value: 'Announce Related', label: 'Announce Related' },
  { value: 'Visit Related', label: 'Visit Related' },
  { value: 'General Query', label: 'General Query' },
];

const selectTypeOptions = [
  { value: '', label: 'Select' },
  { value: 'Send Photos', label: 'Send Photos' },
  { value: 'Send Receipt', label: 'Send Receipt' },
  { value: 'Update Donor Details', label: 'Update Donor Details' },
];

export const CallCenterTicketTab = ({
  form,
  disabled = false,
  errors = {},
  onChange,
}: CallCenterTicketTabProps) => {
  return (
    <div className="announce-master-panel">
      <div className="row g-5">
        <div className="col-md-3">
          <FloatingInputField
            id="ticketId"
            label="Information Code"
            value={form.ticketId}
            onChange={value => onChange('ticketId', value)}
            readOnly
            disabled={disabled}
            className="form-control form-control-solid ant-input-floating-control"
          />
        </div>

        <div className="col-md-3">
          <FloatingDatePicker
            id="ticketDate"
            label="Date"
            value={form.date}
            onChange={value => onChange('date', value)}
            readOnly
            disabled={disabled}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="ngCode"
            label="NG Code"
            value={form.ngCode}
            onChange={value => onChange('ngCode', value)}
            disabled={disabled}
          />
        </div>

        <div className="col-md-3">
          <FloatingSelectField
            id="callCategoryName"
            label={
              <>
                Call Category Name <span className="text-danger">*</span>
              </>
            }
            value={form.callCategoryName}
            options={callCategoryOptions}
            disabled={disabled}
            onChange={value => onChange('callCategoryName', value)}
            error={errors.callCategoryName}
          />
        </div>

        <div className="col-md-3">
          <FloatingSelectField
            id="selectType"
            label={
              <>
                Select Types <span className="text-danger">*</span>
              </>
            }
            value={form.selectType}
            options={selectTypeOptions}
            disabled={disabled}
            onChange={value => onChange('selectType', value)}
            error={errors.selectType}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="requestBy"
            label={
              <>
                Request By <span className="text-danger">*</span>
              </>
            }
            value={form.requestBy}
            onChange={value => onChange('requestBy', value)}
            disabled={disabled}
            error={errors.requestBy}
          />
        </div>

        <div className="col-md-3">
          <CountryField
            id="country1"
            value={form.country1}
            onChange={value => onChange('country1', value)}
            apiDataFlag="FOREIGN_GANGOTRI"
            disabled={disabled}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="mobileNo1"
            label="Mobile No 1"
            value={form.mobileNo1}
            onChange={value => onChange('mobileNo1', value)}
            type="tel"
            disabled={disabled}
          />
        </div>

        <div className="col-md-3">
          <CountryField
            id="country2"
            value={form.country2}
            onChange={value => onChange('country2', value)}
            apiDataFlag="FOREIGN_GANGOTRI"
            includeEmptyOption
            disabled={disabled}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="mobileNo2"
            label="Mobile No 2"
            value={form.mobileNo2}
            onChange={value => onChange('mobileNo2', value)}
            type="tel"
            disabled={disabled}
          />
        </div>

        <div className="col-md-3">
          <FloatingDatePicker
            id="callBackDate"
            label={
              <>
                Call Back Date <span className="text-danger">*</span>
              </>
            }
            value={form.callBackDate}
            onChange={value => onChange('callBackDate', value)}
            disabled={disabled}
            error={errors.callBackDate}
          />
        </div>

        <div className="col-md-3">
          <FloatingTimePicker
            id="callBackTime"
            label="Call Back Time"
            value={form.callBackTime}
            onChange={value => onChange('callBackTime', value)}
            disabled={disabled}
          />
        </div>

        <div className="col-md-12">
          <FloatingTextareaField
            id="details"
            label={
              <>
                Details <span className="text-danger">*</span>
              </>
            }
            value={form.details}
            disabled={disabled}
            readOnly={disabled}
            onChange={value => onChange('details', value)}
            error={errors.details}
          />
        </div>
      </div>
    </div>
  );
};
