import React from 'react';
import { ReceiveIdAnnouncesTab } from './ReceiveIdAnnouncesTab';
import { ReceiveIdAttachmentsTab } from './ReceiveIdAttachmentsTab';
import { ReceiveIdCommunicationAddressTab } from './ReceiveIdCommunicationAddressTab';
import { ReceiveIdContactDetailsTab } from './ReceiveIdContactDetailsTab';
import { ReceiveIdFormFooter } from './ReceiveIdFormFooter';
import { ReceiveIdFormHeader } from './ReceiveIdFormHeader';
import { ReceiveIdFormTabNav } from './ReceiveIdFormTabNav';
import { ReceiveIdIdentityDetailsTab } from './ReceiveIdIdentityDetailsTab';
import { ReceiveIdInstructionTab } from './ReceiveIdInstructionTab';
import { ReceiveIdPaymentDetailsTab } from './ReceiveIdPaymentDetailsTab';
import { ReceiveIdPersonalDetailsTab } from './ReceiveIdPersonalDetailsTab';
import { ReceiveIdPurposeTab } from './ReceiveIdPurposeTab';
import { ReceiveIdReceiptDetailsTab } from './ReceiveIdReceiptDetailsTab';
import { ReceiveIdRemarksTab } from './ReceiveIdRemarksTab';

interface ReceiveIdFormProps {
  onExit: () => void;
}

export const ReceiveIdForm: React.FC<ReceiveIdFormProps> = ({ onExit }) => {
  return (
    <div className={'row g-6'}>
      <div className={'col-12'}>
        <div className={'card card-flush'}>
          <ReceiveIdFormHeader />

          <div className={'card-body pt-6'}>
            <ReceiveIdFormTabNav />

            <div className={'tab-content'} id="detailsTabContent">
              <ReceiveIdPersonalDetailsTab />
              <ReceiveIdCommunicationAddressTab />
              <ReceiveIdContactDetailsTab />
              <ReceiveIdIdentityDetailsTab />
              <ReceiveIdPaymentDetailsTab />
              <ReceiveIdReceiptDetailsTab />
              <ReceiveIdPurposeTab />
              <ReceiveIdInstructionTab />
              <ReceiveIdRemarksTab />
              <ReceiveIdAttachmentsTab />
              <ReceiveIdAnnouncesTab />
            </div>

            <ReceiveIdFormFooter onExit={onExit} />
          </div>
        </div>
      </div>
    </div>
  );
};
