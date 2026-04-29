import React, { useEffect, useMemo, useState } from 'react';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectOption } from 'src/components/Common/FloatingSelectField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { loadSalutationMasterOptions } from 'src/components/AnnounceMaster/AnnounceMasterContent.loaders';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

export const ReceiveIdPersonalDetailsTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  const [salutations, setSalutations] = useState<FloatingSelectOption[]>([]);

  useEffect(() => {
    let active = true;

    const loadSalutations = async () => {
      try {
        const options = await loadSalutationMasterOptions();

        if (active && options.length) {
          setSalutations(options);
        }
      } catch {
        if (active) {
          setSalutations([]);
        }
      }
    };

    void loadSalutations();

    return () => {
      active = false;
    };
  }, []);

  const salutationOptions = useMemo(
    () =>
      values.salutation &&
      !salutations.some(option => option.value === values.salutation)
        ? [{ value: values.salutation, label: values.salutation }, ...salutations]
        : salutations,
    [salutations, values.salutation],
  );

  const occasionOptions = [
    { value: '', label: 'Select Occasion' },
    { value: 'Birthday', label: 'Birthday' },
    { value: 'Anniversary', label: 'Anniversary' },
    { value: 'Punya Tithi', label: 'Punya Tithi' },
  ];

  return (
    <div className={'tab-pane fade active show'} id="tab_personal" role="tabpanel">
      <div className={'row g-5'}>
        <div className={'col-md-3'} id="DonorId">
          <FloatingInputField
            id="donorId"
            label={
              <>
                Donor ID <span className={'text-danger'}>*</span>
              </>
            }
            value={values.donorId}
            onChange={value => updateField('donorId', value)}
            placeholder="Enter Donor ID"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'} id="AnnounceId">
          <FloatingInputField
            id="AnnounceId"
            label={
              <>
                Announce ID <span className={'text-danger'}>*</span>
              </>
            }
            value={values.announceId}
            onChange={value => updateField('announceId', value)}
            placeholder="Enter Announce ID"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'} id="firstNameWrap">
          <div className={'row g-3'}>
            <div className={'col-4'}>
              <FloatingSelectField
                id="salutation"
                label="Title"
                value={values.salutation}
                options={salutationOptions}
                disabled={isReadOnly}
                onChange={value => updateField('salutation', value as string)}
              />
            </div>
            <div className={'col-8'}>
              <FloatingInputField
                id="firstName"
                label={
                  <>
                    First Name <span className={'text-danger'}>*</span>
                  </>
                }
                value={values.firstName}
                onChange={value => updateField('firstName', value)}
                placeholder="Enter first name"
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

        <div className={'col-md-3'} id="lastNameWrap">
          <FloatingInputField
            id="lastName"
            label="Last Name"
            value={values.lastName}
            onChange={value => updateField('lastName', value)}
            placeholder="Enter last name"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingDatePicker
            id="fuDate"
            label="Date of Birth"
            value={values.dateOfBirth}
            onChange={value => updateField('dateOfBirth', value)}
            placeholder="Select Date"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingSelectField
            id="occasionSelect"
            label="In Memory / Occasion"
            value={values.occasion}
            options={occasionOptions}
            disabled={isReadOnly}
            onChange={value => updateField('occasion', value as string)}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingInputField
            id="occasionRemark"
            label={
              <>
                Remark <span className="text-danger">*</span>
              </>
            }
            value={values.occasionDetail}
            onChange={value => updateField('occasionDetail', value)}
            disabled={isReadOnly}
          />
        </div>
        <div className={'col-md-3 mt-3 d-none'} id="occasionInputBox">
          <FloatingInputField
            id="occasionDetail"
            label="Enter Detail"
            value={values.occasionDetail}
            onChange={value => updateField('occasionDetail', value)}
            placeholder="Enter Details"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-8 d-none'} id="inMemoryWrap">
          <FloatingInputField
            id="inMemoryText"
            label="Occasion / In Memory Details"
            value={values.inMemoryText}
            onChange={value => updateField('inMemoryText', value)}
            placeholder="e.g., Birthday / Anniversary / Punya Tithi..."
            readOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};
