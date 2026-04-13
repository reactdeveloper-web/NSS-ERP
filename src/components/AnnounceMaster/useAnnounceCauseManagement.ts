import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react';
import {
  AddedAnnounceCause,
  AnnounceDetailsForm,
  AnnounceValidationErrors,
  EventOption,
} from './types';
import { createEmptyCauseFields } from './AnnounceMasterContent.helpers';

type UseAnnounceCauseManagementArgs = {
  addedCauses: AddedAnnounceCause[];
  announceDetailsForm: AnnounceDetailsForm;
  autoAmount: string;
  causeHeadOptions: EventOption[];
  causeIdPendingDelete: number | null;
  currencyId: string;
  editingCauseId: number | null;
  isViewMode: boolean;
  purposeOptions: EventOption[];
  amountRequestIdRef: MutableRefObject<number>;
  purposeOptionsRequestIdRef: MutableRefObject<number>;
  setAddedCauses: Dispatch<SetStateAction<AddedAnnounceCause[]>>;
  setAnnounceDetailsForm: Dispatch<SetStateAction<AnnounceDetailsForm>>;
  setAutoAmount: Dispatch<SetStateAction<string>>;
  setCauseIdPendingDelete: Dispatch<SetStateAction<number | null>>;
  setCurrencyId: Dispatch<SetStateAction<string>>;
  setEditingCauseId: Dispatch<SetStateAction<number | null>>;
  setIsAmountEditable: Dispatch<SetStateAction<boolean>>;
  setPersistedCurrencyId: Dispatch<SetStateAction<string>>;
  setPurposeOptions: Dispatch<SetStateAction<EventOption[]>>;
  setValidationErrors: Dispatch<SetStateAction<AnnounceValidationErrors>>;
};

export const useAnnounceCauseManagement = ({
  addedCauses,
  announceDetailsForm,
  autoAmount,
  causeHeadOptions,
  causeIdPendingDelete,
  currencyId,
  editingCauseId,
  isViewMode,
  purposeOptions,
  amountRequestIdRef,
  purposeOptionsRequestIdRef,
  setAddedCauses,
  setAnnounceDetailsForm,
  setAutoAmount,
  setCauseIdPendingDelete,
  setCurrencyId,
  setEditingCauseId,
  setIsAmountEditable,
  setPersistedCurrencyId,
  setPurposeOptions,
  setValidationErrors,
}: UseAnnounceCauseManagementArgs) => {
  const resetCauseDraft = useCallback(() => {
    purposeOptionsRequestIdRef.current += 1;
    amountRequestIdRef.current += 1;
    setCurrencyId('');
    setPurposeOptions([]);
    setAutoAmount('');
    setIsAmountEditable(false);
    setAnnounceDetailsForm(current => ({
      ...current,
      ...createEmptyCauseFields(),
    }));
  }, [
    amountRequestIdRef,
    purposeOptionsRequestIdRef,
    setAnnounceDetailsForm,
    setAutoAmount,
    setCurrencyId,
    setIsAmountEditable,
    setPurposeOptions,
  ]);

  const clearAnnounceAmountError = useCallback(() => {
    setValidationErrors(current => {
      const nextErrors = { ...current };
      delete nextErrors.announceAmount;
      return nextErrors;
    });
  }, [setValidationErrors]);

  const handleAddCause = useCallback(() => {
    if (isViewMode) {
      return;
    }

    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === announceDetailsForm.causeHead,
    );
    const selectedPurpose = purposeOptions.find(
      option => option.value === announceDetailsForm.purpose,
    );
    const yojnaId =
      selectedPurpose?.yojnaId?.trim() || announceDetailsForm.purpose.trim();
    const causeAmount =
      autoAmount.trim() || selectedPurpose?.amountValue?.trim() || '';

    if (
      !announceDetailsForm.causeHead.trim() ||
      !announceDetailsForm.purpose.trim() ||
      !yojnaId ||
      !causeAmount ||
      (announceDetailsForm.causeHead === '150' &&
        !announceDetailsForm.causeHeadDate.trim())
    ) {
      return;
    }

    const nextCause: AddedAnnounceCause = {
      id: editingCauseId ?? Date.now(),
      causeHead: announceDetailsForm.causeHead,
      causeHeadLabel:
        selectedCauseHead?.label || announceDetailsForm.causeHead.trim(),
      causeHeadPurposeId:
        selectedCauseHead?.purposeId?.trim() ||
        announceDetailsForm.causeHead.trim(),
      purpose: announceDetailsForm.purpose,
      purposeLabel:
        selectedPurpose?.label || announceDetailsForm.purpose.trim(),
      yojnaId,
      quantity: Math.max(1, Number(announceDetailsForm.quantity) || 1),
      amount: causeAmount,
      causeHeadDate: announceDetailsForm.causeHeadDate,
      namePlateName: announceDetailsForm.namePlateName.trim(),
      donorInstruction: announceDetailsForm.donorInstruction.trim(),
    };

    setAddedCauses(current =>
      editingCauseId === null
        ? [...current, nextCause]
        : current.map(item => (item.id === editingCauseId ? nextCause : item)),
    );
    clearAnnounceAmountError();
    setEditingCauseId(null);

    if (currencyId.trim()) {
      setPersistedCurrencyId(currencyId.trim());
    }

    resetCauseDraft();
  }, [
    announceDetailsForm,
    autoAmount,
    causeHeadOptions,
    clearAnnounceAmountError,
    currencyId,
    editingCauseId,
    isViewMode,
    purposeOptions,
    resetCauseDraft,
    setAddedCauses,
    setEditingCauseId,
    setPersistedCurrencyId,
  ]);

  const handleEditCause = useCallback(
    (causeId: number) => {
      if (isViewMode) {
        return;
      }

      const cause = addedCauses.find(item => item.id === causeId);

      if (!cause) {
        return;
      }

      setEditingCauseId(causeId);
      setAutoAmount(cause.amount);
      setAnnounceDetailsForm(current => ({
        ...current,
        causeHead: cause.causeHead,
        causeHeadDate: cause.causeHeadDate,
        namePlateName: cause.namePlateName,
        donorInstruction: cause.donorInstruction,
        purpose: cause.purpose,
        quantity: cause.quantity,
      }));
    },
    [
      addedCauses,
      isViewMode,
      setAnnounceDetailsForm,
      setAutoAmount,
      setEditingCauseId,
    ],
  );

  const handleDeleteCause = useCallback(
    (causeId: number) => {
      if (isViewMode) {
        return;
      }

      setCauseIdPendingDelete(causeId);
    },
    [isViewMode, setCauseIdPendingDelete],
  );

  const handleCloseDeleteCauseModal = useCallback(() => {
    setCauseIdPendingDelete(null);
  }, [setCauseIdPendingDelete]);

  const handleConfirmDeleteCause = useCallback(() => {
    if (isViewMode || causeIdPendingDelete === null) {
      return;
    }

    setAddedCauses(current =>
      current.filter(item => item.id !== causeIdPendingDelete),
    );

    if (editingCauseId === causeIdPendingDelete) {
      setEditingCauseId(null);
      resetCauseDraft();
    }

    setCauseIdPendingDelete(null);
  }, [
    causeIdPendingDelete,
    editingCauseId,
    isViewMode,
    resetCauseDraft,
    setAddedCauses,
    setCauseIdPendingDelete,
    setEditingCauseId,
  ]);

  return {
    handleAddCause,
    handleCloseDeleteCauseModal,
    handleConfirmDeleteCause,
    handleDeleteCause,
    handleEditCause,
  };
};
