import React from 'react';
import { CountryField } from 'src/components/Common/CountryField';
import { DistrictField } from 'src/components/Common/DistrictField';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { PincodeField } from 'src/components/Common/PincodeField';
import { StateField } from 'src/components/Common/StateField';
import { EventOption } from 'src/components/AnnounceMaster/types';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

interface ReceiveIdCommunicationAddressTabProps extends ReceiveIdFormTabProps {
  stateOptions?: EventOption[];
  districtOptions?: EventOption[];
  isPincodeLocationLocked?: boolean;
}

export const ReceiveIdCommunicationAddressTab: React.FC<
  ReceiveIdCommunicationAddressTabProps
> = ({
  values,
  updateField,
  isReadOnly,
  stateOptions = [],
  districtOptions = [],
  isPincodeLocationLocked = false,
}) => {
  const stateSelectOptions =
    values.state &&
    !stateOptions.some(state => state.value === values.state)
      ? [{ value: values.state, label: values.state }, ...stateOptions]
      : stateOptions;
  const districtSelectOptions =
    values.district &&
    !districtOptions.some(district => district.value === values.district)
      ? [{ value: values.district, label: values.district }, ...districtOptions]
      : districtOptions;

  return (
    <div className={'tab-pane fade'} id="tab_address" role="tabpanel">
      <div className={'row g-5'}>
        <div className={'col-md-3'}>
          <FloatingInputField
            id="addr1"
            label="Address 1"
            value={values.address1}
            onChange={value => updateField('address1', value)}
            placeholder="Flat, House No. Building, Apartment"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingInputField
            id="addr2"
            label="Address 2"
            value={values.address2}
            onChange={value => updateField('address2', value)}
            placeholder="Area, Street, Sector, Village"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingInputField
            id="addr3"
            label="Address 3"
            value={values.address3}
            onChange={value => updateField('address3', value)}
            placeholder="Landmark"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <PincodeField
            value={values.pincode}
            onChange={value => updateField('pincode', value)}
            disabled={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <CountryField
            value={values.country}
            onChange={value => updateField('country', value)}
            disabled={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <StateField
            value={values.state}
            options={stateSelectOptions}
            disabled={isPincodeLocationLocked || isReadOnly}
            onChange={value => updateField('state', value)}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingInputField
            id="city"
            label="City"
            value={values.city}
            onChange={value => updateField('city', value)}
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-3'}>
          <DistrictField
            value={values.district}
            options={districtSelectOptions}
            disabled={isPincodeLocationLocked || isReadOnly}
            onChange={value => updateField('district', value)}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingInputField
            id="careOf"
            label="C/O"
            value={values.careOf}
            onChange={value => updateField('careOf', value)}
            placeholder="Enter C/O"
            readOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};
