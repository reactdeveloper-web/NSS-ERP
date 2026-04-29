import React from 'react';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

const contactTypeOptions = [
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Office', label: 'Office' },
  { value: 'Home', label: 'Home' },
];

export const ReceiveIdContactDetailsTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_contact" role="tabpanel">
      <div className={'row g-5'}>
        <div className={'col-md-3'}>
          <div className={'row g-3'}>
            <div className={'col-5'}>
              <FloatingSelectField
                id="mobileType1"
                label="Type"
                value={values.mobileType1}
                options={contactTypeOptions}
                disabled={isReadOnly}
                onChange={value => updateField('mobileType1', value as string)}
              />
            </div>
            <div className={'col-7'}>
              <FloatingInputField
                id="mobile1"
                type="tel"
                label={
                  <>
                    Primary Mobile <span className={'text-danger'}>*</span>
                  </>
                }
                value={values.mobile1}
                onChange={value => updateField('mobile1', value)}
                placeholder="Enter number"
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

        <div className={'col-md-3'}>
          <div className={'form-check form-check-custom form-check-solid mt-10'}>
            <input className={'form-check-input'} type="checkbox" id="sameWhatsapp" defaultChecked disabled={isReadOnly} />
            <label className={'form-check-label fw-semibold'} htmlFor="sameWhatsapp">
              Primary mobile is WhatsApp
            </label>
          </div>
        </div>
        <div className={'col-md-3'}>
          <FloatingInputField
            id="whatsapp"
            type="tel"
            label={
              <>
                Whatsapp <span className={'text-danger'}>*</span>
              </>
            }
            value={values.whatsapp}
            onChange={value => updateField('whatsapp', value)}
            placeholder="Enter number"
            readOnly={isReadOnly}
          />
        </div>
        <div className={'col-md-3'}>
          <FloatingInputField
            id="email1"
            type="email"
            label="Primary Email"
            value={values.email1}
            onChange={value => updateField('email1', value)}
            placeholder="Email ID"
            readOnly={isReadOnly}
          />
        </div>
      </div>

      <div className={'row g-5 mt-5'}>
        <div className={'col-md-3'}>
          <div className={'row g-3'}>
            <div className={'col-5'}>
              <FloatingSelectField
                id="mobileType2"
                label="Type"
                value={values.mobileType2}
                options={contactTypeOptions}
                disabled={isReadOnly}
                onChange={value => updateField('mobileType2', value as string)}
              />
            </div>
            <div className={'col-7'}>
              <FloatingInputField
                id="mobile2"
                type="tel"
                label="Mobile 2"
                value={values.mobile2}
                onChange={value => updateField('mobile2', value)}
                placeholder="Enter number"
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

        <div className={'col-md-3'}>
          <div className={'form-check form-check-custom form-check-solid mt-10'}>
            <input className={'form-check-input'} type="checkbox" id="sameWhatsapp1" defaultChecked disabled={isReadOnly} />
            <label className={'form-check-label fw-semibold'} htmlFor="sameWhatsapp1">
              Primary mobile is WhatsApp
            </label>
          </div>
        </div>

        <div className={'col-md-3 offset-md-3'}>
          <FloatingInputField
            id="email2"
            type="email"
            label="Email 2"
            value={values.email2}
            onChange={value => updateField('email2', value)}
            placeholder="Email ID"
            readOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};
