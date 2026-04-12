import React from 'react';
import {
  AnnounceValidationErrors,
  PersonalInfoForm,
  SalutationOption,
} from '../types';
import { CountryField } from '../../Common/CountryField';
import { DistrictField } from '../../Common/DistrictField';
import { FloatingInputField } from '../../Common/FloatingInputField';
import { FloatingSelectField } from '../../Common/FloatingSelectField';
import { PincodeField } from '../../Common/PincodeField';
import { StateField } from '../../Common/StateField';

interface PersonalInfoTabProps {
  form: PersonalInfoForm;
  salutations: SalutationOption[];
  stateOptions: { value: string; label: string }[];
  districtOptions: { value: string; label: string }[];
  isPincodeLocationLocked: boolean;
  isViewMode?: boolean;
  errors: AnnounceValidationErrors;
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
  isViewMode = false,
  errors,
  onChange,
}: PersonalInfoTabProps) => {
  const fallbackStateOptions = [
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Gujarat', label: 'Gujarat' },
  ];

  const salutationOptions =
    form.salutation &&
    !salutations.some(salutation => salutation.value === form.salutation)
      ? [{ value: form.salutation, label: form.salutation }, ...salutations]
      : salutations;
  const resolvedStateOptions =
    stateOptions.length > 0 ? stateOptions : fallbackStateOptions;
  const stateSelectOptions =
    form.state &&
    !resolvedStateOptions.some(state => state.value === form.state)
      ? [{ value: form.state, label: form.state }, ...resolvedStateOptions]
      : resolvedStateOptions;
  const districtSelectOptions =
    form.district &&
    !districtOptions.some(district => district.value === form.district)
      ? [{ value: form.district, label: form.district }, ...districtOptions]
      : districtOptions;

  return (
    <div className="announce-master-panel">
      <div className="announce-master-helper-text">
        Donor ID empty: please fill personal details.
      </div>

      <div className="row g-4">
        <div className="col-lg-3 col-md-6">
          <div className="row g-4">
            <div className="col-lg-4">
              <FloatingSelectField
                id="salutation"
                label="Salutation"
                value={form.salutation}
                options={salutationOptions}
                disabled={form.salutationLocked || isViewMode}
                onChange={value => onChange('salutation', value)}
                error={errors.salutation}
              />
            </div>
            <div className="col-lg-8">
              <FloatingInputField
                id="announcerName"
                label={
                  <>
                    Announcer Name <span className="text-danger">*</span>
                  </>
                }
                value={form.announcerName}
                onChange={value => onChange('announcerName', value)}
                disabled={isViewMode}
                error={errors.announcerName}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <FloatingInputField
            id="mobileNo"
            type="tel"
            label={
              <>
                Mobile No. <span className="text-danger">*</span>
              </>
            }
            value={form.mobileNo}
            onChange={value => onChange('mobileNo', value)}
            disabled={isViewMode}
            error={errors.mobileNo}
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <FloatingInputField
            id="whatsappNo"
            type="tel"
            label="WhatsApp No."
            value={form.whatsappNo}
            onChange={value => onChange('whatsappNo', value)}
            disabled={isViewMode}
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <label className="announce-master-checkbox form-check m-0 p-0">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.announceInOtherName}
              disabled={isViewMode}
              onChange={event =>
                onChange('announceInOtherName', event.target.checked)
              }
            />
            <span>Announce in someone else&apos;s name</span>
          </label>
        </div>
        {form.announceInOtherName ? (
          <>
            <div className="col-lg-3 col-md-6">
              <div className="row g-4">
                <div className="col-lg-4">
                  <FloatingSelectField
                    id="salutationOther"
                    label="Salutation"
                    value={form.otherSalutation}
                    options={salutationOptions}
                    disabled={isViewMode}
                    onChange={value => onChange('otherSalutation', value)}
                  />
                </div>
                <div className="col-lg-8">
                  <FloatingInputField
                    id="announcedForName"
                    label={
                      <>
                        Announcer In The Name Of{' '}
                        <span className="text-danger">*</span>
                      </>
                    }
                    value={form.announcedForName}
                    onChange={value => onChange('announcedForName', value)}
                    disabled={isViewMode}
                    error={errors.announcedForName}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <FloatingInputField
                id="relationName"
                label="Relation"
                value={form.relationName}
                onChange={value => onChange('relationName', value)}
                disabled={isViewMode}
              />
            </div>
          </>
        ) : null}

        <div className="col-lg-3 col-md-6">
          <PincodeField
            value={form.pincode}
            onChange={value => onChange('pincode', value)}
            disabled={isViewMode}
            error={errors.pincode}
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <CountryField
            value={form.country}
            onChange={value => onChange('country', value)}
            disabled={isViewMode}
            error={errors.country}
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <StateField
            value={form.state}
            options={stateSelectOptions}
            disabled={form.stateLocked || isPincodeLocationLocked || isViewMode}
            onChange={value => onChange('state', value)}
            error={errors.state}
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <DistrictField
            value={form.district}
            options={districtSelectOptions}
            disabled={isPincodeLocationLocked || isViewMode}
            onChange={value => onChange('district', value)}
            error={errors.district}
          />
        </div>
      </div>
    </div>
  );
};
