import React from 'react';
import { Select } from 'antd';
import { PersonalInfoForm, SalutationOption } from '../types';

interface PersonalInfoTabProps {
  form: PersonalInfoForm;
  salutations: SalutationOption[];
  stateOptions: { value: string; label: string }[];
  districtOptions: { value: string; label: string }[];
  isPincodeLocationLocked: boolean;
  onChange: <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => void;
}

export const PersonalInfoTab = ({
  form,
  salutations,
  stateOptions,
  districtOptions,
  isPincodeLocationLocked,
  onChange,
}: PersonalInfoTabProps) => {
  const fallbackStateOptions = [
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Gujarat', label: 'Gujarat' },
  ];

  const renderFloatingSelect = (
    id: keyof Pick<
      PersonalInfoForm,
      'salutation' | 'country' | 'state' | 'district'
    >,
    label: string,
    value: string,
    options: { value: string; label: string }[],
    disabled = false,
  ) => (
    <div
      className={`form-floating ant-select-floating ${
        value ? 'has-value' : ''
      } ${disabled ? 'is-disabled' : ''}`}
    >
      <Select
        id={id}
        placeholder=""
        showSearch
        allowClear={!disabled}
        disabled={disabled}
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

  const salutationOptions =
    form.salutation &&
    !salutations.some(salutation => salutation.value === form.salutation)
      ? [{ value: form.salutation, label: form.salutation }, ...salutations]
      : salutations;
  const resolvedStateOptions =
    stateOptions.length > 0 ? stateOptions : fallbackStateOptions;
  const stateSelectOptions =
    form.state && !resolvedStateOptions.some(state => state.value === form.state)
      ? [{ value: form.state, label: form.state }, ...resolvedStateOptions]
      : resolvedStateOptions;
  const districtSelectOptions =
    form.district &&
    !districtOptions.some(district => district.value === form.district)
      ? [{ value: form.district, label: form.district }, ...districtOptions]
      : districtOptions;

  return (
    <div>
      <div className="text-muted fs-7 mb-4">
        Donor ID empty: please fill personal details.
      </div>

      <div className="row g-5">
        <div className="col-md-2">
          <div className="form-floating ant-input-floating">
            <input
              id="mobileNo"
              type="tel"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.mobileNo}
              onChange={event => onChange('mobileNo', event.target.value)}
            />
            <label htmlFor="mobileNo">
              Mobile No. <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating ant-input-floating">
            <input
              id="whatsappNo"
              type="tel"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.whatsappNo}
              onChange={event => onChange('whatsappNo', event.target.value)}
            />
            <label htmlFor="whatsappNo">WhatsApp No.</label>
          </div>
        </div>
        <div className="col-md-2">
          {renderFloatingSelect(
            'salutation',
            'Salutation',
            form.salutation,
            salutationOptions,
            form.salutationLocked,
          )}
        </div>

        <div className="col-md-3">
          <div className="form-floating ant-input-floating">
            <input
              id="announcerName"
              type="text"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.announcerName}
              onChange={event => onChange('announcerName', event.target.value)}
            />
            <label htmlFor="announcerName">
              Announcer Name <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-3">
          <label className="form-check form-check-custom form-check-solid pt-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.announceInOtherName}
              onChange={event =>
                onChange('announceInOtherName', event.target.checked)
              }
            />
            <span className="form-check-label fw-semibold">
              Announce in someone else&apos;s name
            </span>
          </label>
        </div>

        {form.announceInOtherName ? (
          <div className="col-md-4">
            <div className="row g-5">
              <div className="col-md-6">
                <div className="form-floating ant-input-floating">
                  <input
                    id="announcedForName"
                    type="text"
                    className="form-control ant-input-floating-control"
                    placeholder=" "
                    value={form.announcedForName}
                    onChange={event =>
                      onChange('announcedForName', event.target.value)
                    }
                  />
                  <label htmlFor="announcedForName">
                    Announcer In The Name Of{' '}
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating ant-input-floating">
                  <input
                    id="relationName"
                    type="text"
                    className="form-control ant-input-floating-control"
                    placeholder=" "
                    value={form.relationName}
                    onChange={event =>
                      onChange('relationName', event.target.value)
                    }
                  />
                  <label htmlFor="relationName">Relation</label>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="col-md-2">
          <div className="form-floating ant-input-floating">
            <input
              id="pincode"
              type="text"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.pincode}
              onChange={event => onChange('pincode', event.target.value)}
            />
            <label htmlFor="pincode">Pincode</label>
          </div>
        </div>

        <div className="col-md-2">
          {renderFloatingSelect(
            'country',
            'Country',
            form.country,
            [{ value: 'India', label: 'India' }],
            true,
          )}
        </div>

        <div className="col-md-2">
          {renderFloatingSelect(
            'state',
            'State',
            form.state,
            stateSelectOptions,
            form.stateLocked || isPincodeLocationLocked,
          )}
        </div>

        <div className="col-md-2">
          {renderFloatingSelect(
            'district',
            'District',
            form.district,
            districtSelectOptions,
            isPincodeLocationLocked,
          )}
        </div>
      </div>
    </div>
  );
};
