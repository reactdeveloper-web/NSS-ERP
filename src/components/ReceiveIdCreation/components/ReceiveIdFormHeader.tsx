import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Select } from 'antd';

const donorSearchOptions = [
  { value: 'receiveId', label: 'Receive ID' },
  { value: 'donorId', label: 'Donor ID' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'email', label: 'Email' },
  { value: 'aadhaar', label: 'Aadhar' },
  { value: 'pan', label: 'Pan Number' },
];

interface ReceiveIdFormHeaderProps {
  onSearch?: (searchType: string, searchValue: string) => void;
  isSearching?: boolean;
  searchError?: string;
}

export const ReceiveIdFormHeader: React.FC<ReceiveIdFormHeaderProps> = ({
  onSearch,
  isSearching = false,
  searchError = '',
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const receiveId = searchParams.get('RID') || '';
  const operation = searchParams.get('Operation')?.toUpperCase() || '';
  const shouldShowReceiveId =
    Boolean(receiveId) && ['EDIT', 'VIEW'].includes(operation);
  const isReadOnly = operation === 'VIEW';
  const [searchType, setSearchType] = useState('receiveId');
  const [donorSearchValue, setDonorSearchValue] = useState('');

  const handleSearch = () => {
    const nextSearchValue = donorSearchValue.trim();

    if (!nextSearchValue) {
      return;
    }

    onSearch?.(searchType, nextSearchValue);
  };

  return (
    <div className={'card-header border-bottom mb-4'}>
      <div className={'card-title w-100 justify-content-between'}>
        <div className={'d-flex align-items-center gap-4 flex-wrap'}>
          <h3 className={'fw-bold mb-0'}>Donor / Receipt Details</h3>
          {shouldShowReceiveId ? (
            <span className={'badge badge-light-primary fs-6 fw-semibold px-4 py-2'}>
              <i className={'fas fa-receipt text-primary me-2'}></i>
              Receive ID : {receiveId}
            </span>
          ) : null}
          <span className={'badge badge-light-info fs-6 fw-semibold px-4 py-2'}>
            <i className={'fas fa-calendar-alt text-info me-2'}></i>
            28/04/2026
          </span>
        </div>
        <div className="announce-master-header-tools">
          <Select
            className="announce-master-header-select"
            value={searchType || undefined}
            disabled={isReadOnly}
            onChange={nextValue =>
              setSearchType((nextValue as string) || 'receiveId')
            }
            options={donorSearchOptions}
          />
          <div className="announce-master-search-wrap">
            <input
              id="donorId"
              type="text"
              className="form-control announce-master-search-input"
              placeholder={
                donorSearchOptions.find(option => option.value === searchType)
                  ?.label ?? 'Donor ID'
              }
              value={donorSearchValue}
              disabled={isReadOnly}
              onChange={event => setDonorSearchValue(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              type="button"
              className="announce-master-search-icon border-0 bg-transparent"
              onClick={handleSearch}
              disabled={isReadOnly || isSearching}
              aria-label="Search receive ID"
            >
              {isSearching ? (
                <span
                  className="spinner-border spinner-border-sm text-muted"
                  role="status"
                  aria-label="Searching receive ID"
                />
              ) : (
                <i className="fa fa-search" aria-hidden="true" />
              )}
            </button>
            {searchError ? (
              <div className="announce-master-field-error mt-1">
                {searchError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
