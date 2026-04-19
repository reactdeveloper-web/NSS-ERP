import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ContentTypes } from 'src/constants/content';
import axiosInstance from 'src/redux/interceptor';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  extractCitCallCategoryOptions,
  extractCitEmployeeOptions,
  extractCitCallSubCategoryOptions,
  readCitCache,
} from '../cit.helpers';
import {
  extractArrayPayload,
  getFirstValue,
  normalizeApiDate,
  parseStoredUser,
} from 'src/components/AnnounceMaster/AnnounceMasterContent.helpers';

export interface CitListingItem {
  informationCode: string;
  entryDate: string;
  callBackDate: string;
  targetDate: string;
  ngCode: string;
  categoryId: string;
  empId: string;
  callCategoryName: string;
  callSubCategoryIds: string;
  callSubCategoryName: string;
  informationTrait: string;
  requestBy: string;
  employeeName: string;
  mobileNo1: string;
  completed: boolean;
}

interface CitListingFilters {
  informationCode: string;
  ngCode: string;
  mobileNo1: string;
  status: string;
  fromDate: string;
  toDate: string;
}

interface CitListingProps {
  deletingId: string | null;
  onAdd: () => void;
  onEdit: (informationCode: string) => void;
  onView: (informationCode: string) => void;
  onDelete: (informationCode: string) => void;
}

type MasterOption = {
  value: string;
  label: string;
};

const CIT_FETCH_PAGE_INDEX = 1;
const CIT_FETCH_PAGE_SIZE = 500;

const createInitialFilters = (): CitListingFilters => ({
  informationCode: '',
  ngCode: '',
  mobileNo1: '',
  status: '3',
  fromDate: '',
  toDate: '',
});

const statusOptions = [
  { value: '2', label: 'All' },
  { value: '0', label: 'Pending' },
  { value: '1', label: 'Complete' },
];

const normalizeDate = (value: string) => normalizeApiDate(value) || value.trim();

const mapCitListingItem = (record: Record<string, unknown>): CitListingItem => ({
  informationCode: getFirstValue(record, [
    'iCall_Information_Traits_ID',
    'ICall_Information_Traits_ID',
  ]),
  entryDate: getFirstValue(record, [
    'call_Date_Time',
    'Call_Date_Time',
    'call_Date',
    'Call_Date',
  ]),
  callBackDate: getFirstValue(record, [
    'Call_Back_Date_Time',
    'call_Back_Date_Time',
    'Call_Back_Date',
    'call_Back_Date',
  ]),
  targetDate:
    normalizeApiDate(getFirstValue(record, ['Target_Date'])) ||
    getFirstValue(record, ['Target_Date']),
  ngCode: getFirstValue(record, ['NgCode', 'ngCode', 'NGCode']),
  categoryId: getFirstValue(record, ['iCall_Category_ID']),
  empId: getFirstValue(record, ['Emp_Id', 'emp_Id', 'call_User_Id', 'Call_User_Id']),
  callCategoryName:
    getFirstValue(record, [
      'sCategory',
      'category',
      'Category',
      'CATEGORY',
      'DM_NAME',
    ]) ||
    `Category ${getFirstValue(record, ['iCall_Category_ID'])}`,
  callSubCategoryName: getFirstValue(record, [
    'Call_SubCat_Name',
    'call_SubCat_Name',
  ]),
  callSubCategoryIds: getFirstValue(record, [
    'Call_SubCat_ID',
    'call_SubCat_ID',
  ]),
  informationTrait: getFirstValue(record, [
    'sInformation_Trait',
    'Call_SubCat_Name',
    'call_SubCat_Name',
  ]),
  requestBy: getFirstValue(record, ['NAME', 'name', 'request_by', 'RequestBy']),
  employeeName: getFirstValue(record, ['ENAME', 'EMP_NAME', 'emp_name']),
  mobileNo1: getFirstValue(record, ['Mno1', 'mno1']),
  completed: getFirstValue(record, ['Complete', 'complete']).trim().toLowerCase() === 'yes',
});

const mapCachedCitListingItem = (record: ReturnType<typeof readCitCache>[number]): CitListingItem => ({
  informationCode: record.informationCode,
  entryDate: record.ticketForm.date,
  callBackDate: record.ticketForm.callBackDate,
  targetDate: record.ticketForm.callBackDate,
  ngCode: record.ticketForm.ngCode,
  categoryId: record.ticketForm.callCategoryId,
  empId: record.ticketForm.selectSadhakId,
  callCategoryName: record.ticketForm.callCategoryName,
  callSubCategoryIds: record.ticketForm.selectTypeId.join(','),
  callSubCategoryName: record.ticketForm.selectType,
  informationTrait: record.ticketForm.details || record.ticketForm.selectType,
  requestBy: record.ticketForm.requestBy,
  employeeName: record.ticketForm.selectSadhakName,
  mobileNo1: record.ticketForm.mobileNo1,
  completed: record.completed,
});

const formatDisplayDate = (value: string) => {
  const normalizedValue = normalizeDate(value);

  if (!normalizedValue || !normalizedValue.includes('-')) {
    return normalizedValue || '-';
  }

  return normalizedValue.split('-').reverse().join('/');
};

const normalizeListingDate = (value: string) => normalizeApiDate(value) || normalizeDate(value);

const formatDateTimeCell = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return <span>-</span>;
  }

  const [datePart, timePart] = trimmedValue.split(/\s(.+)/);

  if (!timePart) {
    return <span>{trimmedValue}</span>;
  }

  return (
    <>
      <div>{datePart}</div>
      <div>{timePart}</div>
    </>
  );
};

const formatDateOnlyCell = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '-';
  }

  const dateToken = trimmedValue.split(/\s+/)[0];
  const normalizedToken = dateToken.replace(/\./g, '/').replace(/-/g, '/');
  const yyyyMmDdMatch = normalizedToken.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);

  if (yyyyMmDdMatch) {
    const [, year, month, day] = yyyyMmDdMatch;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  const slashDateMatch = normalizedToken.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (slashDateMatch) {
    const [, firstPart, secondPart, year] = slashDateMatch;
    const firstNumber = Number(firstPart);
    const secondNumber = Number(secondPart);

    if (firstNumber > 12 && secondNumber <= 12) {
      return `${firstPart.padStart(2, '0')}/${secondPart.padStart(2, '0')}/${year}`;
    }

    if (secondNumber > 12 && firstNumber <= 12) {
      return `${secondPart.padStart(2, '0')}/${firstPart.padStart(2, '0')}/${year}`;
    }

    return `${firstPart.padStart(2, '0')}/${secondPart.padStart(2, '0')}/${year}`;
  }

  const normalizedValue = normalizeApiDate(trimmedValue);

  if (normalizedValue && normalizedValue.includes('-')) {
    return normalizedValue.split('-').reverse().join('/');
  }

  return dateToken;
};

const formatTypeCell = (
  item: CitListingItem,
  resolvedCategoryName: string,
  resolvedSubCategoryNames: string,
  resolvedSadhakName: string,
) => (
  <>
    <div className="mt-1">
      <span className="fw-bold"> {resolvedCategoryName || `Category ${item.categoryId || '-'}`}</span>
    </div>
    <div>
      {item.categoryId === '27'
        ? resolvedSadhakName || '-'
        : resolvedSubCategoryNames || '-'}
    </div>
  </>
);

const getListingSortValue = (item: CitListingItem) => {
  const numericInformationCode = Number(item.informationCode);

  if (Number.isFinite(numericInformationCode) && numericInformationCode > 0) {
    return numericInformationCode;
  }

  const normalizedEntryDate = normalizeApiDate(item.entryDate);

  if (normalizedEntryDate) {
    return new Date(`${normalizedEntryDate}T00:00:00`).getTime();
  }

  return 0;
};

export const CitListing = ({
  deletingId,
  onAdd,
  onEdit,
  onView,
  onDelete,
}: CitListingProps) => {
  const [apiItems, setApiItems] = useState<CitListingItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<MasterOption[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<MasterOption[]>([]);
  const [subCategoryOptionsByCategory, setSubCategoryOptionsByCategory] = useState<
    Record<string, MasterOption[]>
  >({});
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<CitListingFilters>(
    createInitialFilters(),
  );
  const [appliedFilters, setAppliedFilters] = useState<CitListingFilters>(
    createInitialFilters(),
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [cachedItems, setCachedItems] = useState<CitListingItem[]>([]);

  useEffect(() => {
    setCachedItems(readCitCache().map(mapCachedCitListingItem));
  }, []);

  useEffect(() => {
    const loadCallCategories = async () => {
      const currentUser = parseStoredUser() as Partial<IUser> & {
        DataFlag?: string;
        dataFlag?: string;
        Data_Flag?: string;
      };
      const dataFlag =
        currentUser.DataFlag ||
        currentUser.dataFlag ||
        currentUser.Data_Flag ||
        ContentTypes.DataFlag;
      const requestConfigs = [
        () =>
          axiosInstance.post(masterApiPaths.getCallCategoryList, null, {
            headers: masterApiHeaders(),
          }),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            { Data_Flag: dataFlag },
            { headers: masterApiHeaders() },
          ),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            { data_Flag: dataFlag },
            { headers: masterApiHeaders() },
          ),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            { DataFlag: dataFlag },
            { headers: masterApiHeaders() },
          ),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            {},
            { headers: masterApiHeaders() },
          ),
      ];

      for (const makeRequest of requestConfigs) {
        try {
          const response = await makeRequest();
          const nextOptions = extractCitCallCategoryOptions(response.data)
            .filter(option => option.value && option.label !== 'Select')
            .map(option => ({
              value: option.value,
              label: option.label,
            }));

          if (nextOptions.length) {
            setCategoryOptions(nextOptions);
            return;
          }
        } catch {
          // Try next request shape.
        }
      }

      setCategoryOptions([]);
    };

    void loadCallCategories();
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await axiosInstance.get(masterApiPaths.getEmployeeAll, {
          params: {
            emp_num: 0,
            dm_id: 0,
            emp_code: 0,
          },
          headers: masterApiHeaders(),
        });
        const nextOptions = extractCitEmployeeOptions(response.data)
          .filter(option => option.value && option.label !== 'Select')
          .map(option => ({
            value: option.value,
            label: option.label,
          }));

        setEmployeeOptions(nextOptions);
      } catch {
        setEmployeeOptions([]);
      }
    };

    void loadEmployees();
  }, []);

  const fetchCitListing = useCallback(async () => {
    const currentUser = parseStoredUser() as Partial<IUser> & {
      DataFlag?: string;
      dataFlag?: string;
      Data_Flag?: string;
    };

    const payload = {
      iCall_Information_Traits_ID: appliedFilters.informationCode.trim() || '0',
      iCall_Category_ID: '0',
      ngCode: appliedFilters.ngCode.trim() || '0',
      mno1: appliedFilters.mobileNo1.trim(),
      fromDate: appliedFilters.fromDate || '',
      toDate: appliedFilters.toDate || '',
      user_ID: '0',
      complete: Number(appliedFilters.status || 3),
      pageIndex: CIT_FETCH_PAGE_INDEX,
      pageSize: CIT_FETCH_PAGE_SIZE,
      data_Flag:
        currentUser.DataFlag ||
        currentUser.dataFlag ||
        currentUser.Data_Flag ||
        ContentTypes.DataFlag,
    };

    setApiLoading(true);
    setApiError('');

    try {
      const response = await axiosInstance.post(masterApiPaths.getCitList, payload, {
        headers: masterApiHeaders(),
      });
      const records = extractArrayPayload(response.data);
      setApiItems(records.map(mapCitListingItem));
    } catch (apiFetchError: any) {
      setApiItems([]);
      setApiError(
        apiFetchError?.response?.data?.message ||
          apiFetchError?.message ||
          'CIT listing load nahi hui.',
      );
    } finally {
      setApiLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    void fetchCitListing();
  }, [fetchCitListing]);

  const updateDraftFilter = <K extends keyof CitListingFilters>(
    field: K,
    value: CitListingFilters[K],
  ) => {
    setDraftFilters(current => ({
      ...current,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setPageNumber(1);
  };

  const handleResetFilters = () => {
    const initialFilters = createInitialFilters();
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSearchText('');
    setPageNumber(1);
  };

  const mergedItems = useMemo(() => {
    const cacheMap = new Map(cachedItems.map(item => [item.informationCode, item]));
    const mergedApiItems = apiItems.map(item => {
      const cachedItem = cacheMap.get(item.informationCode);

      if (!cachedItem) {
        return item;
      }

      return {
        ...cachedItem,
        ...item,
        callCategoryName: item.callCategoryName || cachedItem.callCategoryName,
        empId: item.empId || cachedItem.empId,
        callSubCategoryIds:
          item.callSubCategoryIds || cachedItem.callSubCategoryIds,
        callSubCategoryName:
          item.callSubCategoryName || cachedItem.callSubCategoryName,
        informationTrait: item.informationTrait || cachedItem.informationTrait,
        requestBy: item.requestBy || cachedItem.requestBy,
        employeeName: item.employeeName || cachedItem.employeeName,
        mobileNo1: item.mobileNo1 || cachedItem.mobileNo1,
        callBackDate: cachedItem.callBackDate || item.callBackDate,
        targetDate: cachedItem.targetDate || item.targetDate,
      };
    });

    const sourceItems = mergedApiItems.length ? mergedApiItems : cachedItems;

    return [...sourceItems].sort(
      (leftItem, rightItem) =>
        getListingSortValue(rightItem) - getListingSortValue(leftItem),
    );
  }, [apiItems, cachedItems]);

  useEffect(() => {
    const categoryIds = Array.from(
      new Set(
        mergedItems
          .map(item => item.categoryId.trim())
          .filter(Boolean)
          .filter(categoryId => !subCategoryOptionsByCategory[categoryId]),
      ),
    );

    if (!categoryIds.length) {
      return;
    }

    let isMounted = true;

    const loadSubCategories = async () => {
      const currentUser = parseStoredUser() as Partial<IUser> & {
        DataFlag?: string;
        dataFlag?: string;
        Data_Flag?: string;
      };
      const dataFlag =
        currentUser.DataFlag ||
        currentUser.dataFlag ||
        currentUser.Data_Flag ||
        ContentTypes.DataFlag;

      const results = await Promise.all(
        categoryIds.map(async categoryId => {
          try {
            const response = await axiosInstance.post(
              masterApiPaths.getCallSubCategoryList,
              {
                CatId: Number(categoryId),
                DataFlag: dataFlag,
              },
              {
                headers: masterApiHeaders(),
              },
            );

            return {
              categoryId,
              options: extractCitCallSubCategoryOptions(response.data)
                .filter(option => option.value && option.label !== 'Select')
                .map(option => ({
                  value: option.value,
                  label: option.label,
                })),
            };
          } catch {
            return {
              categoryId,
              options: [] as MasterOption[],
            };
          }
        }),
      );

      if (!isMounted) {
        return;
      }

      setSubCategoryOptionsByCategory(current => {
        const nextState = { ...current };

        results.forEach(result => {
          nextState[result.categoryId] = result.options;
        });

        return nextState;
      });
    };

    void loadSubCategories();

    return () => {
      isMounted = false;
    };
  }, [mergedItems, subCategoryOptionsByCategory]);

  const categoryLabelMap = useMemo(
    () =>
      categoryOptions.reduce<Record<string, string>>((accumulator, option) => {
        accumulator[option.value] = option.label;
        return accumulator;
      }, {}),
    [categoryOptions],
  );

  const employeeLabelMap = useMemo(
    () =>
      employeeOptions.reduce<Record<string, string>>((accumulator, option) => {
        accumulator[option.value] = option.label;
        return accumulator;
      }, {}),
    [employeeOptions],
  );

  const resolveSubCategoryNames = useCallback(
    (item: CitListingItem) => {
      const categoryOptionsForRow = subCategoryOptionsByCategory[item.categoryId] || [];
      const subCategoryIds = item.callSubCategoryIds
        .split(',')
        .map(value => value.trim())
        .filter(Boolean)
        .filter(value => /^\d+$/.test(value));

      if (!subCategoryIds.length) {
        return item.callSubCategoryName || '';
      }

      const subCategoryLabels = subCategoryIds
        .map(subCategoryId =>
          categoryOptionsForRow.find(option => option.value === subCategoryId)?.label || '',
        )
        .filter(Boolean);

      return subCategoryLabels.length
        ? subCategoryLabels.join(', ')
        : item.callSubCategoryName || '';
    },
    [subCategoryOptionsByCategory],
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    const normalizedInfoCode = appliedFilters.informationCode.trim();
    const normalizedNgCode = appliedFilters.ngCode.trim().toLowerCase();
    const normalizedMobileNo1 = appliedFilters.mobileNo1.trim().toLowerCase();
    const normalizedStatus = appliedFilters.status.trim();
    const normalizedFromDate = normalizeDate(appliedFilters.fromDate);
    const normalizedToDate = normalizeDate(appliedFilters.toDate);

    return mergedItems.filter(item => {
      const resolvedCategoryName =
        categoryLabelMap[item.categoryId] || item.callCategoryName;
      const resolvedSubCategoryNames = resolveSubCategoryNames(item);
      const resolvedSadhakName =
        employeeLabelMap[item.empId] || item.employeeName;
      const matchesSearch =
        !normalizedSearch ||
        [
          item.informationCode,
          item.entryDate,
          item.targetDate,
          item.ngCode,
          item.categoryId,
          resolvedCategoryName,
          item.callCategoryName,
          item.callSubCategoryIds,
          resolvedSubCategoryNames,
          item.callSubCategoryName,
          item.empId,
          resolvedSadhakName,
          item.informationTrait,
          item.requestBy,
          item.employeeName,
          item.mobileNo1,
          item.callBackDate,
          item.completed ? 'completed' : 'pending',
        ].some(field => field.toLowerCase().includes(normalizedSearch));
      const matchesInfoCode =
        !normalizedInfoCode ||
        item.informationCode.includes(normalizedInfoCode);
      const matchesNgCode =
        !normalizedNgCode ||
        item.ngCode.toLowerCase().includes(normalizedNgCode);
      const matchesMobileNo1 =
        !normalizedMobileNo1 ||
        item.mobileNo1.toLowerCase().includes(normalizedMobileNo1);
      const matchesStatus =
        normalizedStatus === '3' ||
        (normalizedStatus === '1' && item.completed) ||
        (normalizedStatus === '0' && !item.completed);
      const matchesFromDate =
        !normalizedFromDate ||
        (!!normalizeListingDate(item.entryDate) &&
          normalizeListingDate(item.entryDate) >= normalizedFromDate);
      const matchesToDate =
        !normalizedToDate ||
        (!!normalizeListingDate(item.entryDate) &&
          normalizeListingDate(item.entryDate) <= normalizedToDate);

      return (
        matchesSearch &&
        matchesInfoCode &&
        matchesNgCode &&
        matchesMobileNo1 &&
        matchesStatus &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [
    appliedFilters,
    categoryLabelMap,
    employeeLabelMap,
    mergedItems,
    resolveSubCategoryNames,
    searchText,
  ]);

  const totalCount = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedItems = filteredItems.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const safeStartPage = Math.max(1, pageNumber - 2);
      const safeEndPage = Math.min(totalPages, safeStartPage + 4);
      const adjustedStartPage = Math.max(1, safeEndPage - 4);

      return adjustedStartPage + index;
    },
  );
  const startRecord = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRecord =
    totalCount === 0 ? 0 : Math.min(pageNumber * pageSize, totalCount);

  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  return (
    <div className="card announce-master-card">
      <div className="card-header announce-master-card-header">
        <div className="card-title p-0">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">
              Call Information Trait Details
            </span>
          </h3>
        </div>

        <div className="card-toolbar p-0">
          <div className="d-flex align-items-center flex-wrap gap-3 justify-content-end">
            <div className="position-relative">
              <span className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle-y ms-3">
                <i className="fas fa-search fs-3" aria-hidden="true"></i>
              </span>
              <input
                type="text"
                className="form-control w-250px ps-10"
                placeholder="Search records..."
                value={searchText}
                onChange={event => setSearchText(event.target.value)}
              />
            </div>

            <button
              className="btn btn-sm btn-flex btn-light btn-active-primary fw-bolder p-6"
              type="button"
              onClick={() => setIsFilterOpen(current => !current)}
            >
              <i className="fas fa-filter fs-4" />
            </button>

            <button
              className="btn btn-sm btn-primary btn-active-primary p-3 fs-6"
              type="button"
              onClick={onAdd}
            >
              <span className="svg-icon svg-icon-3 me-0">
                <i className="fa fa-plus fs-7" aria-hidden="true"></i>
              </span>
              Add
            </button>
          </div>
        </div>
      </div>

      <div
        className={`announce-listing-filter-wrap ${
          isFilterOpen ? 'is-open' : ''
        }`}
      >
        <div className="announce-listing-filter-inner">
          <div className="card card-bordered bg-light">
            <div className="card-body p-6">
              <div className="row g-3">
                <div className="col-md-3">
                  <FloatingInputField
                    id="filterInformationCode"
                    label="Ticket ID"
                    value={draftFilters.informationCode}
                    onChange={value =>
                      updateDraftFilter('informationCode', value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterNgCode"
                    label="NG Code"
                    value={draftFilters.ngCode}
                    onChange={value => updateDraftFilter('ngCode', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterMobileNo1"
                    label="Mobile No"
                    value={draftFilters.mobileNo1}
                    onChange={value => updateDraftFilter('mobileNo1', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingSelectField
                    id="filterStatus"
                    label="Status"
                    value={draftFilters.status}
                    options={statusOptions}
                    onChange={value => updateDraftFilter('status', value as string)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingDatePicker
                    id="filterFromDate"
                    label="From Date"
                    value={draftFilters.fromDate}
                    onChange={value => updateDraftFilter('fromDate', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingDatePicker
                    id="filterToDate"
                    label="To Date"
                    value={draftFilters.toDate}
                    onChange={value => updateDraftFilter('toDate', value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-6">
                <button
                  className="btn btn-light me-3"
                  type="button"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleApplyFilters}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-3">
        {apiError ? <div className="alert alert-warning m-3">{apiError}</div> : null}

        <div className="table-responsive" style={{ maxHeight: '600px' }}>
          <table
            id="citListingTable"
            className="table table-row-bordered align-middle gs-0 gy-2 mb-0"
          >
            <thead>
              <tr className="fw-bolder text-uppercase text-nowrap">
                <th
                  className="min-w-100px text-center"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                ></th>
                <th
                  className="text-center"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Ticket ID
                </th>
                <th
                  className="text-center"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Entry Date
                </th>
                <th
                  className="text-center"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Call Back Date
                </th>
                <th
                  className="text-center"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Target Date
                </th>
                <th
                  className="text-start"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Category Name / Types
                </th>
                <th
                  className="text-start"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Request By
                </th>
                <th
                  className="text-start"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Details
                </th>
                <th
                  className="text-center"
                  style={{ background: '#27b3a7', color: '#ffffff' }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {apiLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-muted">
                    Loading call information traits...
                  </td>
                </tr>
              ) : paginatedItems.length ? (
                paginatedItems.map(item => {
                  const resolvedCategoryName =
                    categoryLabelMap[item.categoryId] || item.callCategoryName;
                  const resolvedSubCategoryNames = resolveSubCategoryNames(item);
                  const resolvedSadhakName =
                    employeeLabelMap[item.empId] || item.employeeName;

                  return (
                    <tr key={item.informationCode}>
                      <td>
                        <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-light"
                          onClick={() => onEdit(item.informationCode)}
                          title="Edit"
                        >
                          <i
                            className="fa fa-edit text-info"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-light"
                          onClick={() => onView(item.informationCode)}
                          title="View"
                        >
                          <i
                            className="fa fa-eye text-success"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-light"
                          onClick={() => onDelete(item.informationCode)}
                          disabled={deletingId === item.informationCode}
                          title="Delete"
                        >
                          <i
                            className="fa fa-trash text-danger"
                            aria-hidden="true"
                          ></i>
                        </button>
                        </div>
                      </td>
                      <td className="text-center">
                      {item.informationCode || '-'}
                    </td>
                    <td className="text-center">
                      {formatDateOnlyCell(item.entryDate)}
                    </td>
                    <td className="text-center">
                      {formatDateOnlyCell(item.callBackDate)}
                    </td>
                      <td className="text-center">
                        {formatDisplayDate(item.targetDate)}
                      </td>
                      <td className="text-start">
                        {formatTypeCell(
                          item,
                          resolvedCategoryName,
                          resolvedSubCategoryNames,
                          resolvedSadhakName,
                        )}
                      </td>
                      <td className="text-start">{item.requestBy || '-'}</td>
                      <td className="text-start">
                        {item.informationTrait || '-'}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            item.completed
                              ? 'badge-light-success'
                              : 'badge-light-warning'
                          }`}
                        >
                          {item.completed ? 'Complete' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-muted">
                    No call information trait records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-stack flex-wrap pt-5">
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted fs-7">Show</span>
            <select
              className="form-select form-select-sm form-select-solid w-100px"
              value={pageSize}
              onChange={event => {
                setPageSize(Number(event.target.value));
                setPageNumber(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-muted fs-7">per page</span>
          </div>

          <div className="d-flex align-items-center gap-4">
            <span className="text-muted fs-7">
              Showing {startRecord} to {endRecord} of {totalCount}
            </span>
            <ul className="pagination pagination-circle pagination-outline mb-0">
              <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    setPageNumber(current => Math.max(1, current - 1))
                  }
                >
                  &laquo;
                </button>
              </li>
              {pageNumbers.map(page => (
                <li
                  key={page}
                  className={`page-item ${page === pageNumber ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setPageNumber(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  pageNumber >= totalPages ? 'disabled' : ''
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    setPageNumber(current => Math.min(totalPages, current + 1))
                  }
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
