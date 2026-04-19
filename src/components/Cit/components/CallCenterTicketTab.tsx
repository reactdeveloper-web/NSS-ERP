import React from 'react';
import { CountryField } from 'src/components/Common/CountryField';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import {
  FloatingSelectField,
  FloatingSelectOption,
} from 'src/components/Common/FloatingSelectField';
import { FloatingTextareaField } from 'src/components/Common/FloatingTextareaField';
import { FloatingTimePicker } from 'src/components/Common/FloatingTimePicker';

export interface CallCenterTicketForm {
  ticketId: string;
  date: string;
  ngCode: string;
  callCategoryId: string;
  callCategoryName: string;
  selectTypeId: string[];
  selectType: string;
  selectSadhakId: string;
  selectSadhakName: string;
  requestBy: string;
  country1: string;
  mobileNo1: string;
  country2: string;
  mobileNo2: string;
  callBackDate: string;
  callBackTime: string;
  details: string;
  completionReply: string;
}

export interface CallCenterTicketValidationErrors {
  callCategoryName?: string;
  selectType?: string;
  selectSadhakName?: string;
  requestBy?: string;
  country1?: string;
  callBackDate?: string;
  details?: string;
  completionReply?: string;
}

interface CallCenterTicketTabProps {
  form: CallCenterTicketForm;
  callCategoryOptions: FloatingSelectOption[];
  countryOptions: FloatingSelectOption[];
  selectTypeOptions: FloatingSelectOption[];
  selectSadhakOptions: FloatingSelectOption[];
  disabled?: boolean;
  requestByReadOnly?: boolean;
  errors?: CallCenterTicketValidationErrors;
  onChange: <K extends keyof CallCenterTicketForm>(
    field: K,
    value: CallCenterTicketForm[K],
  ) => void;
  onCallCategoryChange: (value: string) => void;
  onSelectTypeChange: (value: string[]) => void;
  onSelectSadhakChange: (value: string) => void;
}

export const CallCenterTicketTab = ({
  form,
  callCategoryOptions,
  countryOptions,
  selectTypeOptions,
  selectSadhakOptions,
  disabled = false,
  requestByReadOnly = false,
  errors = {},
  onChange,
  onCallCategoryChange,
  onSelectTypeChange,
  onSelectSadhakChange,
}: CallCenterTicketTabProps) => {
  const isSadhakCategory = form.callCategoryId === '27';
  const hasSelectableTypes = selectTypeOptions.some(
    option => option.value !== '' && option.label !== 'Select',
  );

  return (
    <div className="announce-master-panel">
      <div className="row g-5">
        {/* <div className="col-md-3">
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
        </div> */}

        <div className="col-md-3">
          <FloatingSelectField
            id="callCategoryName"
            label={
              <>
                Call Category Name <span className="text-danger">*</span>
              </>
            }
            value={form.callCategoryId}
            options={callCategoryOptions}
            disabled={disabled}
            onChange={onCallCategoryChange}
            error={errors.callCategoryName}
          />
        </div>

        {isSadhakCategory ? (
          <div className="col-md-3">
            <FloatingSelectField
              id="selectSadhak"
              label={
                <>
                  Select Sadhak <span className="text-danger">*</span>
                </>
              }
              value={form.selectSadhakId}
              options={selectSadhakOptions}
              disabled={disabled || !form.callCategoryId}
              onChange={onSelectSadhakChange}
              error={errors.selectSadhakName}
            />
          </div>
        ) : (
          <div className="col-md-3">
            <FloatingSelectField
              id="selectType"
              label={
                <>
                  Select Types <span className="text-danger">*</span>
                </>
              }
              value={form.selectTypeId}
              options={selectTypeOptions}
              mode="multiple"
              disabled={disabled || !form.callCategoryId || !hasSelectableTypes}
              onChange={value => onSelectTypeChange(value as string[])}
              error={errors.selectType}
            />
          </div>
        )}

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
            disabled={disabled || requestByReadOnly}
            readOnly={requestByReadOnly}
            error={errors.requestBy}
          />
        </div>

        <div className="col-md-3">
          <CountryField
            id="country1"
            value={form.country1}
            onChange={value => onChange('country1', value)}
            options={countryOptions}
            disabled={disabled}
            error={errors.country1}
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
            options={countryOptions}
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
