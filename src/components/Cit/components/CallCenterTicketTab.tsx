import React from 'react';
import { CountryField } from 'src/components/Common/CountryField';
import { DistrictField } from 'src/components/Common/DistrictField';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { FloatingTimePicker } from 'src/components/Common/FloatingTimePicker';
import { PincodeField } from 'src/components/Common/PincodeField';
import { StateField } from 'src/components/Common/StateField';

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
  pincode: string;
  state: string;
  district: string;
  details: string;
}

interface CallCenterTicketTabProps {
  form: CallCenterTicketForm;
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

const countryOptions = [
  { value: 'India', label: 'India' },
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
  { value: 'UAE', label: 'UAE' },
];

const stateOptions = [
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Gujarat', label: 'Gujarat' },
];

const districtOptions = [
  { value: 'Udaipur', label: 'Udaipur' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Ahmedabad', label: 'Ahmedabad' },
];

export const CallCenterTicketTab = ({
  form,
  onChange,
}: CallCenterTicketTabProps) => {
  return (
    <div className="announce-master-panel">
      <div className="row g-5">
        <div className="col-md-3">
          <FloatingInputField
            id="ticketId"
            label="Ticket ID"
            value={form.ticketId}
            onChange={value => onChange('ticketId', value)}
            readOnly
            className="form-control form-control-solid ant-input-floating-control"
          />
        </div>

        <div className="col-md-3">
          <FloatingDatePicker
            id="ticketDate"
            label="Date"
            value={form.date}
            onChange={value => onChange('date', value)}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="ngCode"
            label="NG Code"
            value={form.ngCode}
            onChange={value => onChange('ngCode', value)}
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
            onChange={value => onChange('callCategoryName', value)}
          />
        </div>

        <div className="col-md-3">
          <FloatingSelectField
            id="selectType"
            label="Select Types"
            value={form.selectType}
            options={selectTypeOptions}
            onChange={value => onChange('selectType', value)}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="requestBy"
            label="Request By"
            value={form.requestBy}
            onChange={value => onChange('requestBy', value)}
          />
        </div>

        <div className="col-md-3">
          <CountryField
            value={form.country1}
            onChange={value => onChange('country1', value)}
            options={countryOptions}
            disabled={false}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="mobileNo1"
            label="Mobile No 1"
            value={form.mobileNo1}
            onChange={value => onChange('mobileNo1', value)}
            type="tel"
          />
        </div>

        <div className="col-md-3">
          <CountryField
            value={form.country2}
            onChange={value => onChange('country2', value)}
            options={[{ value: '', label: 'Select' }, ...countryOptions]}
            disabled={false}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="mobileNo2"
            label="Mobile No 2"
            value={form.mobileNo2}
            onChange={value => onChange('mobileNo2', value)}
            type="tel"
          />
        </div>

        <div className="col-md-3">
          <FloatingDatePicker
            id="callBackDate"
            label="Call Back Date"
            value={form.callBackDate}
            onChange={value => onChange('callBackDate', value)}
          />
        </div>

        <div className="col-md-3">
          <FloatingTimePicker
            id="callBackTime"
            label="Call Back Time"
            value={form.callBackTime}
            onChange={value => onChange('callBackTime', value)}
          />
        </div>

        <div className="col-md-2">
          <PincodeField
            value={form.pincode}
            onChange={value => onChange('pincode', value)}
          />
        </div>

        <div className="col-md-2">
          <StateField
            value={form.state}
            options={stateOptions}
            onChange={value => onChange('state', value)}
          />
        </div>

        <div className="col-md-2">
          <DistrictField
            value={form.district}
            options={districtOptions}
            onChange={value => onChange('district', value)}
          />
        </div>

        <div className="col-md-12">
          <div className="form-floating ant-input-floating">
            <textarea
              id="details"
              className="form-control ant-input-floating-control"
              placeholder=" "
              style={{ minHeight: '120px' }}
              value={form.details}
              onChange={event => onChange('details', event.target.value)}
            />
            <label htmlFor="details">Details</label>
          </div>
        </div>
      </div>
    </div>
  );
};
