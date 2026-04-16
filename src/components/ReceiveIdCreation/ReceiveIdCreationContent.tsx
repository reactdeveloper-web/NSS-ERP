import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import { ReceiveIdCreationNav } from './ReceiveIdCreationNav';
import axiosInstance from 'src/redux/axiosInstance';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { ContentTypes } from 'src/constants/content';
import './ReceiveIdCreationContent.scss';

//Type
type Salutation = {
  SAL_CODE: number;
  SAL_NAME: string;
  DATA_FLAG: string;
  FY_ID: number;
};

type Occasion = {
  OccasionId: number;
  OccasionName: string;
}

export const ReceiveIdCreationContent: React.FC = () => {

  // Toggle ('LIST') and the 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');

  const [salutations, setSalutations] = useState<Salutation[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);



  //Fetch Salutations data from API
  useEffect(() => {
    const fetchSalutation = async () => {
      try {
        const response = await axiosInstance.get(`/${masterApiPaths.getSalutations}`, {
          params: {
            Data_Flag: ContentTypes.DataFlag
          }
        });
        const apiData = response.data?.Data || response.data || [];
        const finalArray = apiData.result || [];
        // console.log("=== PARSED DATA ARRAY: ===", finalArray);
        setSalutations(finalArray);
      } catch (error: any) {
        console.error('Failed to load salutations:', error);
      }
    };

    if (viewMode === 'FORM') {
      fetchSalutation();
    }
  }, [viewMode]);
  //Fetch Salutations data from API END

  //Fetch Occasion
  useEffect(() => {
    const fetchOccasions = async () => {
      try {

      } catch (error: any) {
        console.error('Failed to load occasions:', error);
      }
    }
  }, [])


  return (
    <>
      <ReceiveIdCreationNav />
      <div className={'post d-flex flex-column-fluid my-5'}>
        <div className={'container-fluid'}>

          {/* LISTING / TABLE VIEW */}

          {viewMode === 'LIST' && (

            <div className={'row gy-6 g-xl-3'}>
              <div className={'col-xl-12'}>
                <div className={'card card-xl-stretch mb-5 mb-xl-8'}>
                  {/* begin--Header */}
                  <div className={'card-header border-0 p-4 pt-2 pb-0'}>
                    <div className={'card-title p-0'}>
                      <h3 className={'card-title align-items-start flex-column'}>
                        <span className={'card-label fw-bolder fs-3 mb-1'}>
                          Recieve ID Details
                        </span>
                      </h3>
                    </div>
                    <div className={'card-toolbar p-0'}>
                      <div className={'position-relative'}>
                        <span
                          className={
                            'svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle-y ms-4'
                          }
                        >
                          <i className={'fa fa-search'} aria-hidden="true"></i>
                        </span>
                        <input
                          type="text"
                          id="tableSearch"
                          className={'form-control w-250px ps-12'}
                          placeholder="Search records..."
                        />
                      </div>
                      <button
                        id="toggleFilter"
                        className={
                          'btn btn-sm btn-flex btn-light btn-active-primary fw-bolder p-6 mx-5'
                        }
                      >
                        <i className={'fas fa-filter fs-4'}></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('FORM')}
                        className={'btn btn-sm btn-primary btn-active-primary p-3'}
                      >
                        <i className={'fa fa-plus'} aria-hidden="true"></i> Add
                      </button>
                    </div>
                  </div>
                  {/* end--Header */}
                  {/* begin--Filter */}
                  <div
                    id={'filterPanel'}
                    className={'px-5 pb-5'}
                    style={{ display: 'none' }}
                  >
                    <div className={'card card-bordered bg-light'}>
                      <div className={'card-body'}>
                        <div className={'row g-5'}>
                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Post ID</label>
                            <input type="text" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Donator Name</label>
                            <input type="text" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Amount</label>
                            <input type="text" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className="fw-bold mb-2">Received ID</label>
                            <input type="text" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Cheque No.</label>
                            <input type="text" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Pay Mode</label>
                            <select
                              className={'form-select select2-hidden-accessible'}
                              data-control="select2"
                              data-select2-id="select2-data-7-mxfo"
                              tabIndex={-1}
                              aria-hidden="true"
                            >
                              <option data-select2-id="select2-data-9-1kew">
                                Select Mode
                              </option>
                              <option>Cash</option>
                              <option>Cheque</option>
                              <option>Online</option>
                            </select>
                            <span
                              className={
                                'select2 select2-container select2-container--bootstrap5'
                              }
                              dir="ltr"
                              data-select2-id="select2-data-8-dtdf"
                              style={{ width: '100%' }}
                            >
                              <span className={'selection'}>
                                <span
                                  className={
                                    'select2-selection select2-selection--single form-select'
                                  }
                                  role="combobox"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  tabIndex={0}
                                  aria-disabled="false"
                                  aria-labelledby="select2-k8ik-container"
                                  aria-controls="select2-k8ik-container"
                                >
                                  <span
                                    className={'select2-selection__rendered'}
                                    id="select2-k8ik-container"
                                    role="textbox"
                                    aria-readonly="true"
                                    title="Select Mode"
                                  >
                                    Select Mode
                                  </span>
                                  <span
                                    className={'select2-selection__arrow'}
                                    role="presentation"
                                  >
                                    <b role="presentation"></b>
                                  </span>
                                </span>
                              </span>
                              <span
                                className={'dropdown-wrapper'}
                                aria-hidden="true"
                              ></span>
                            </span>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>City</label>
                            <select
                              className={'form-select select2-hidden-accessible'}
                              data-control="select2"
                              data-select2-id="select2-data-10-3is7"
                              tabIndex={-1}
                              aria-hidden="true"
                            >
                              <option data-select2-id="select2-data-12-mf42">
                                Select City
                              </option>
                            </select>
                            <span
                              className={
                                'select2 select2-container select2-container--bootstrap5'
                              }
                              dir="ltr"
                              data-select2-id="select2-data-11-pce8"
                              style={{ width: '100%' }}
                            >
                              <span className={'selection'}>
                                <span
                                  className={
                                    'select2-selection select2-selection--single form-select'
                                  }
                                  role="combobox"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  tabIndex={0}
                                  aria-disabled="false"
                                  aria-labelledby="select2-5lm0-container"
                                  aria-controls="select2-5lm0-container"
                                >
                                  <span
                                    className={'select2-selection__rendered'}
                                    id="select2-5lm0-container"
                                    role="textbox"
                                    aria-readonly="true"
                                    title="Select City"
                                  >
                                    Select City
                                  </span>
                                  <span
                                    className={'select2-selection__arrow'}
                                    role="presentation"
                                  >
                                    <b role="presentation"></b>
                                  </span>
                                </span>
                              </span>
                              <span
                                className={'dropdown-wrapper'}
                                aria-hidden="true"
                              ></span>
                            </span>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>State</label>
                            <select
                              className={'form-select select2-hidden-accessible'}
                              data-control="select2"
                              data-select2-id="select2-data-13-iozm"
                              tabIndex={-1}
                              aria-hidden="true"
                            >
                              <option data-select2-id="select2-data-15-gf2q">
                                Select State
                              </option>
                            </select>
                            <span
                              className={
                                'select2 select2-container select2-container--bootstrap5'
                              }
                              dir="ltr"
                              data-select2-id="select2-data-14-7i0l"
                              style={{ width: '100%' }}
                            >
                              <span className={'selection'}>
                                <span
                                  className={
                                    'select2-selection select2-selection--single form-select'
                                  }
                                  role="combobox"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  tabIndex={0}
                                  aria-disabled="false"
                                  aria-labelledby="select2-448a-container"
                                  aria-controls="select2-448a-container"
                                >
                                  <span
                                    className={'select2-selection__rendered'}
                                    id="select2-448a-container"
                                    role="textbox"
                                    aria-readonly="true"
                                    title="Select State"
                                  >
                                    Select State
                                  </span>
                                  <span
                                    className={'select2-selection__arrow'}
                                    role="presentation"
                                  >
                                    <b role="presentation"></b>
                                  </span>
                                </span>
                              </span>
                              <span
                                className={'dropdown-wrapper'}
                                aria-hidden="true"
                              ></span>
                            </span>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Material</label>
                            <input type="text" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Prov. No.</label>
                            <input type="text" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Date</label>
                            <input type="date" className={'form-control'} />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'fw-bold mb-2'}>Order Type</label>
                            <select className={'form-select'}>
                              <option>All</option>
                              <option>Online</option>
                              <option>Offline</option>
                            </select>
                          </div>
                        </div>

                        <div className={'d-flex justify-content-end mt-6'}>
                          <button className={'btn btn-light me-3'}>Reset</button>
                          <button className={'btn btn-primary'}>Search</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end--Filter */}
                  {/* begin--Table */}
                  <div className={'card-body p-3'}>
                    <div
                      className={'table-responsive'}
                      style={{ maxHeight: '550px' }}
                    >
                      <table
                        id={'receiveTable'}
                        className={
                          'table table-row-dashed table-row-gray-300 align-middle gs-0'
                        }
                      >
                        {/* Table head */}
                        <thead>
                          <tr
                            className={
                              'fw-bolder text-dark bg-light-primary text-nowrap'
                            }
                          >
                            <th className={'sortable'} data-sort="0">
                              Recieved ID
                            </th>
                            <th className={'sortable'} data-sort="1">
                              Post ID
                            </th>
                            <th className={'sortable'} data-sort="2">
                              Recieve By
                            </th>
                            <th className={'sortable'} data-sort="3">
                              Entry By
                            </th>
                            <th className={'sortable'} data-sort="4">
                              Date
                            </th>
                            <th className={'sortable'} data-sort="5">
                              Prov. No.
                            </th>
                            <th className={'sortable'} data-sort="6">
                              Donor Name
                            </th>
                            <th className={'sortable min-w-200px'} data-sort="7">
                              Address
                            </th>
                            <th className={'sortable'} data-sort="8">
                              Currency
                            </th>
                            <th className={'sortable'} data-sort="9">
                              Type
                            </th>
                            <th className={'sortable'} data-sort="10">
                              Payment Mode
                            </th>
                            <th className={'sortable'} data-sort="11">
                              Chq No.
                            </th>
                            <th className={'sortable'} data-sort="12">
                              Amount
                            </th>
                            <th className={'min-w-150px'}>Forwarded</th>
                            <th className={'min-w-150px'}>Call</th>
                            <th className={'min-w-150px'}>Attach Photo</th>
                            <th className={'min-w-100px text-end'}>Actions</th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody>
                          <tr style={{}}>
                            <td>31374</td>
                            <td>yuy</td>
                            <td>Welcome</td>
                            <td>Dilip Chouhan</td>
                            <td>22/03/2026</td>
                            <td>yuy</td>
                            <td>Tapash</td>
                            <td>Jailai guri, West Bengal</td>
                            <td>Indian Rs (INR)</td>
                            <td>Donation</td>
                            <td>Cash</td>
                            <td>154589</td>
                            <td>500</td>
                            <td>
                              <div className={'mb-2'}>C</div>
                              <button
                                type="submit"
                                id="kt_modal_update_customer_submit"
                                className={'btn btn-primary fw-normal fs-7 p-2'}
                              >
                                <span className={'indicator-label'}>
                                  WhatsApp Chat
                                </span>
                              </button>
                            </td>
                            <td>
                              <input
                                type="text"
                                className={'form-control p-1 mb-1'}
                                placeholder=""
                                name="name"
                                value=""
                              />
                              <button
                                type="submit"
                                id="kt_modal_update_customer_submit"
                                className={
                                  'btn btn-primary fw-normal fs-7 p-2 px-4'
                                }
                              >
                                <span className={'indicator-label'}>Call</span>
                              </button>
                            </td>
                            <td>
                              <input
                                type="file"
                                className={'form-control p-2 mb-1'}
                                placeholder=""
                                name="name"
                                value=""
                              />
                              <button
                                type="submit"
                                id="kt_modal_update_customer_submit"
                                className={
                                  'btn btn-primary fw-normal fs-7 p-2 px-4'
                                }
                              >
                                <span className={'indicator-label'}>Call</span>
                              </button>
                            </td>
                            <td>
                              <div
                                className={
                                  'd-flex justify-content-end flex-shrink-0'
                                }
                              >
                                <a
                                  href="#"
                                  className={
                                    'btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                  }
                                >
                                  {/*begin::Svg Icon | path: icons/duotune/general/gen019.svg*/}
                                  <span className={'svg-icon svg-icon-3'}>
                                    <i
                                      className={'fa fa-eye'}
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </a>
                                <a
                                  href="#"
                                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                >
                                  <span className={'svg-icon svg-icon-3'}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        opacity="0.3"
                                        d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z"
                                        fill="black"
                                      ></path>
                                      <path
                                        d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z"
                                        fill="black"
                                      ></path>
                                    </svg>
                                  </span>
                                </a>
                                <a
                                  href="#"
                                  className={
                                    'btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                                  }
                                >
                                  <span className={'svg-icon svg-icon-3'}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                                        fill="black"
                                      ></path>
                                      <path
                                        opacity="0.5"
                                        d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"
                                        fill="black"
                                      ></path>
                                      <path
                                        opacity="0.5"
                                        d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"
                                        fill="black"
                                      ></path>
                                    </svg>
                                  </span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* end--Table */}
                </div>
              </div>
            </div>

          )}

          {/* Form View */}

          {viewMode === 'FORM' && (
            <div className={'row g-6'}>
              <div className={'col-12'}>
                <div className={'card card-flush'}>
                  <div className={'card-header border-bottom mb-4'}>
                    <div className={'card-title w-100 justify-content-between'}>
                      <div className={'d-flex gap-5'}>
                        <h3 className={'fw-bold mb-0'}>Donor / Receipt Details</h3>
                        <span className={'badge badge-light-primary fs-6 fw-semibold px-4 py-2'}>
                          <i className={'fas fa-receipt text-primary me-2'}></i>
                          Receive ID : 296356
                        </span>
                        <span className={'badge badge-light-info fs-6 fw-semibold px-4 py-2'}>
                          <i className={'fas fa-calendar-alt text-info me-2'}></i>
                          28/04/2026
                        </span>
                      </div>
                      <div className={'d-flex gap-5'}>
                        <div className={'col-md-4'}>
                          <select id="eventName" className={'form-select'}>
                            <option value="">Select</option>
                            <option value="donor">Donor ID</option>
                            <option value="mobile">Mobile</option>
                            <option value="email">Email</option>
                            <option value="aadhar">Aadhar</option>
                            <option value="pan">Pan Number</option>
                          </select>
                        </div>
                        <div className={'col-md-8'}>
                          <div className={'d-flex gap-3'}>
                            <div className={'input-group'}>
                              <input type="text" id="donorId" className={'form-control'} placeholder="Donor ID" />

                              <span className={'input-group-text'}>
                                <i className={'bi bi-search'}></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={'card-body pt-6'}>
                    <div className={'tabs-mobile-scroll'}>
                      <ul className={'nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mb-8 flex-wrap'} id="detailsTabNav" role="tablist">
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link active'} data-step="0" data-bs-toggle="tab" data-bs-target="#tab_personal" type="button" data-bs-title="Enter donor personal information" data-bs-placement="top" data-bs-original-title="" title="">
                            1. Personal Details
                          </button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="1" data-bs-toggle="tab" data-bs-target="#tab_address" type="button" data-bs-title="Enter donor Communication Address" data-bs-placement="top" data-bs-original-title="" title="">2. Communication Address</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="2" data-bs-toggle="tab" data-bs-target="#tab_contact" type="button" data-bs-title="Enter donor Contact Details" data-bs-placement="top" data-bs-original-title="" title="">3. Contact Details</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="3" data-bs-toggle="tab" data-bs-target="#tab_identity" type="button" data-bs-title="Enter donor Identity Details" data-bs-placement="top" data-bs-original-title="" title="">4. Identity Details</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="4" data-bs-toggle="tab" data-bs-target="#tab_payment" type="button" data-bs-title="Enter donor Payment Details" data-bs-placement="top" data-bs-original-title="" title="">5. Payment Details</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="5" data-bs-toggle="tab" data-bs-target="#tab_receipt" type="button" data-bs-title="Enter donor Receipt Details" data-bs-placement="top" data-bs-original-title="" title="">6. Receipt Details</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="6" data-bs-toggle="tab" data-bs-target="#tab_purpose" type="button" data-bs-title="Enter donor Purpose" data-bs-placement="top" data-bs-original-title="" title="">7. Purpose</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="7" data-bs-toggle="tab" data-bs-target="#tab_instruction" type="button" data-bs-title="Enter donor Instruction information" data-bs-placement="top" data-bs-original-title="" title="">8. Donor Instruction</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="8" data-bs-toggle="tab" data-bs-target="#tab_remarks" type="button" data-bs-title="Fill Remark" data-bs-placement="top" data-bs-original-title="" title="">9. Remarks</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="9" data-bs-toggle="tab" data-bs-target="#tab_attachements" type="button" data-bs-title="Add Attachements" data-bs-placement="top" data-bs-original-title="" title="">10. Attachements</button>
                        </li>
                        <li className={'nav-item'} role="presentation">
                          <button className={'nav-link'} data-step="10" data-bs-toggle="tab" data-bs-target="#tab_announces" type="button" data-bs-title="Add Announces" data-bs-placement="top" data-bs-original-title="" title="">11. Announces</button>
                        </li>
                      </ul>
                    </div>

                    <div className={'tab-content'} id="detailsTabContent">

                      <div className={'tab-pane fade active show'} id="tab_personal" role="tabpanel">
                        <div className={'row g-5'}>
                          <div className={'col-md-3'} id="DonorId">
                            <label className={'form-label fw-semibold'}>Donor ID <span className={'text-danger'}>*</span></label>
                            <input type="text" id="donorId" className={'form-control'} placeholder="Enter Donor ID" />
                          </div>

                          <div className={'col-md-3'} id="AnnounceId">
                            <label className={'form-label fw-semibold'}>Announce ID <span className={'text-danger'}>*</span></label>
                            <input type="text" id="AnnounceId" className={'form-control'} placeholder="Enter Announce ID" />
                          </div>
                          {/* <FloatingInputField
                                          id="salutation"
                                          label="Salutation"
                                          value={form.salutation}
                                          options={salutationOptions}
                                          disabled={form.salutationLocked || isViewMode}
                                          onChange={value => onChange('salutation', value)}
                                          error={errors.salutation}
                                        /> */}

                          <div className={'col-md-3'} id="firstNameWrap">
                            <label className={'form-label fw-semibold'}>
                              First Name <span className={'text-danger'}>*</span>
                            </label>

                            <div className={'input-group'}>

                              {/* <select id="salutation" className={'form-select'} style={{ maxWidth: '110px' }}>
                                <option>Mr.</option>
                                <option>Mrs.</option>
                                <option>Ms.</option>
                                <option>Dr.</option>
                                <option>Shri</option>
                                <option>Smt.</option>
                                <option>Kumari</option>
                              </select> */}

                              <select
                                id="salutation"
                                className={'form-select'}
                                style={{ maxWidth: '110px' }}
                                defaultValue=""
                              >
                                <option value="" disabled>Select</option>
                                {salutations.map((salutation: Salutation, index: number) => (
                                  <option
                                    key={salutation.SAL_CODE || index}
                                    value={salutation.SAL_CODE}
                                  >
                                    {salutation.SAL_NAME}
                                  </option>
                                ))}
                              </select>

                              <input type="text" id="firstName" className={'form-control'} placeholder="Enter first name" />
                            </div>
                          </div>

                          <div className={'col-md-3'} id="lastNameWrap">
                            <label className={'form-label fw-semibold'}>Last Name</label>
                            <input type="text" id="lastName" className={'form-control'} placeholder="Enter last name" />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Date of Birth</label>
                            <input type="input" id="fuDate" className={'form-control smart-date'} placeholder="Select Date" />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>In Memory / Occasion</label>
                            <select id="occasionSelect" className={'form-select'}>
                              <option value="">Select Occasion</option>
                              <option>Birthday</option>
                              <option>Anniversary</option>
                              <option>Punya Tithi</option>
                            </select>

                          </div>
                          <div className={'col-md-3 mt-3 d-none'} id="occasionInputBox">
                            <label className={'form-label fw-semibold'}>Enter Detail</label>
                            <input type="text" className={'form-control'} placeholder="Enter Details" />
                          </div>

                          <div className={'col-md-8 d-none'} id="inMemoryWrap">
                            <label className={'form-label fw-semibold'}>Occasion / In Memory Details</label>
                            <input type="text" id="inMemoryText" className={'form-control'} placeholder="e.g., Birthday / Anniversary / Punya Tithi..." />
                          </div>
                        </div>
                      </div>

                      <div className={'tab-pane fade'} id="tab_address" role="tabpanel">
                        <div className={'row g-5'}>
                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Address 1</label>
                            <input type="text" id="addr1" className={'form-control'} placeholder="Flat, House No. Building, Apartment" />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Address 2</label>
                            <input type="text" id="addr2" className={'form-control'} placeholder="Area, Street, Sector, Village" />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Address 3</label>
                            <input type="text" id="addr3" className={'form-control'} placeholder="Landmark" />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Country</label>
                            <select id="country" className={'form-select'}>
                              <option selected={true}>India</option>
                              <option>USA</option>
                              <option>UK</option>
                              <option>UAE</option>
                            </select>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Pin Code</label>
                            <input type="text" id="pin" className={'form-control'} placeholder="Enter Pincode" />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>State</label>
                            <select id="state" className={'form-select'}>
                              <option value="">Select State</option>
                              <option>Rajasthan</option>
                              <option>Delhi</option>
                              <option>Maharashtra</option>
                              <option>Gujarat</option>
                            </select>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>City</label>
                            <select id="city" className={'form-select'}>
                              <option value="">Select City</option>
                              <option>Udaipur</option>
                              <option>Jaipur</option>
                              <option>Delhi</option>
                              <option>Ahmedabad</option>
                            </select>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>District</label>
                            <input type="text" id="district" className={'form-control'} placeholder="Enter District" />
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>C/O</label>
                            <input type="text" id="C/O" className={'form-control'} placeholder="Enter C/O" />
                          </div>

                        </div>
                      </div>

                      <div className={'tab-pane fade'} id="tab_contact" role="tabpanel">
                        <div className={'row g-5'}>
                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Primary Mobile <span className={'text-danger'}>*</span></label>
                            <div className={'d-flex gap-3'}>
                              <select id="mobileType1" className={'form-select w-125px'}>
                                <option>Mobile</option>
                                <option>Office</option>
                                <option>Home</option>
                              </select>
                              <input type="tel" id="mobile1" className={'form-control'} placeholder="Enter number" />
                            </div>
                          </div>

                          <div className={'col-md-3'}>
                            <div className={'form-check form-check-custom form-check-solid mt-10'}>
                              <input className={'form-check-input'} type="checkbox" id="sameWhatsapp" checked={true} />
                              <label className={'form-check-label fw-semibold'} htmlFor="sameWhatsapp">Primary mobile is WhatsApp</label>
                            </div>
                          </div>
                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Whatsapp <span className={'text-danger'}>*</span></label>
                            <input type="tel" id="mobile1" className={'form-control'} placeholder="Enter number" />
                          </div>
                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Primary Email</label>
                            <input type="email" id="email1" className={'form-control'} placeholder="Email ID" />
                          </div>


                        </div>

                        <div className={'row g-5 mt-5'}>
                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Mobile 2</label>
                            <div className={'d-flex gap-3'}>
                              <select id="mobileType1" className={'form-select w-125px'}>
                                <option>Mobile</option>
                                <option>Office</option>
                                <option>Home</option>
                              </select>
                              <input type="tel" id="mobile1" className={'form-control'} placeholder="Enter number" />
                            </div>
                          </div>

                          <div className={'col-md-3'}>
                            <div className={'form-check form-check-custom form-check-solid mt-10'}>
                              <input className={'form-check-input'} type="checkbox" id="sameWhatsapp1" checked={true} />
                              <label className={'form-check-label fw-semibold'} htmlFor="sameWhatsapp1">Primary mobile is WhatsApp</label>
                            </div>
                          </div>

                          <div className={'col-md-3 offset-md-3'}>
                            <label className={'form-label fw-semibold'}>Email 2</label>
                            <input type="email" id="email1" className={'form-control'} placeholder="Email ID" />
                          </div>


                        </div>
                      </div>

                      {/* Identity */}
                      <div className={'tab-pane fade'} id="tab_identity" role="tabpanel">
                        <div className={'row g-5 align-items-end'}>
                          <div className={'col-md-4'}>
                            <label className={'form-label fw-semibold'}>Aadhar Number</label>
                            <input type="text" id="AadharNumber" className={'form-control'} placeholder="Enter AADHAR Number" />
                          </div>

                          <div className={'col-md-4'}>
                            <label className={'form-label fw-semibold'}>PAN Number</label>
                            <input type="text" id="PanNumber" className={'form-control'} placeholder="Enter PAN Number" />
                          </div>


                        </div>
                      </div>

                      {/* Payment */}
                      <div className={'tab-pane fade'} id="tab_payment" role="tabpanel">
                        <div id="paymentBlock">
                          <div className={'row g-5'}>

                            {/* Payment Mode */}
                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Payment Mode <span className={'text-danger'}>*</span></label>
                              <select className={'form-select'}>
                                <option>Select</option>
                              </select>
                            </div>


                            {/* Currency */}
                            <div className={'col-md-3 d-flex justify-content-between'}>
                              <div className={'form-check mt-12'}>
                                <input className={'form-check-input'} type="checkbox" />
                                <label className={'form-check-label fw-semibold'}>Pay-In-Slip Cash</label>
                              </div>
                              <div className={'d-flex flex-column'}>
                                <label className={'form-label fw-semibold'}>Currency <span className={'text-danger'}>*</span></label>
                                <input type="text" className={'form-control'} value="Indian Rupee (INR)" />
                              </div>
                            </div>

                            {/* Amount */}
                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Amount <span className={'text-danger'}>*</span></label>
                              <input type="text" className={'form-control'} />
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Material Deposit Id</label>
                              <input type="text" className={'form-control'} />
                            </div>

                            {/* Material */}
                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Material</label>
                              <input type="text" className={'form-control'} />
                            </div>


                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Bank Name 1</label>
                              <select className={'form-select'}>
                                <option>Select</option>
                              </select>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Cheque/Draft Date</label>
                              <input type="date" className={'form-control'} />
                            </div>
                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Cheque/Draft No</label>
                              <input type="text" className={'form-control'} />
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Deposit Bank &amp; Date</label>
                              <select className={'form-select'}>
                                <option>All</option>
                              </select>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Deposit Date</label>
                              <input type="date" className={'form-control'} />
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>PDC Cheque-1</label>

                              <div className={'btn-group w-100 mt-2'} role="group">
                                <input type="radio" className={'btn-check'} name="pdc" id="pdcYes" autoComplete="off" />
                                <label className={'btn btn-outline-secondary w-50'} htmlFor="pdcYes">Yes</label>

                                <input type="radio" className={'btn-check'} name="pdc" id="pdcNo" autoComplete="off" checked={true} />
                                <label className={'btn btn-outline-secondary w-50'} htmlFor="pdcNo">No</label>
                              </div>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Manual Bank Id</label>
                              <input type="text" id="manualBankId" className={'form-control'} placeholder="Optional" />
                            </div>

                          </div>

                          <div className={'separator separator-dashed my-6'}></div>

                          <div id="chequeSection" className={'d-none'}>
                            <div className={'border rounded p-5'}>
                              <div className={'d-flex justify-content-between align-items-center mb-5'}>
                                <div>
                                  <h5 className={'fw-bold mb-1'}>Cheque Details</h5>
                                  <div className={'text-muted fs-8'}>You can add multiple cheques if needed</div>
                                </div>
                                <button className={'btn btn-primary btn-sm'} type="button" id="addChequeBtn">+ Add Cheque Row</button>
                              </div>

                              <div className={'table-responsive'}>
                                <table className={'table table-rounded table-striped border gy-5 gs-5'}>
                                  <thead>
                                    <tr className={'fw-bold fs-6 text-gray-800'}>
                                      <th>Donor Bank</th>
                                      <th>Cheque/Draft Date</th>
                                      <th>Cheque/Draft No.</th>
                                      <th>Deposit Bank</th>
                                      <th>Deposit Date</th>
                                      <th>PDC</th>
                                      <th className={'text-center'}>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody id="chequeTbody"></tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={'tab-pane fade'} id="tab_receipt" role="tabpanel">
                        <div id="receiptBlock">
                          <div className={'row g-5'}>
                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Receipt Copy Require</label>
                              <select id="receiptCopy" className={'form-select'}>
                                <option>Soft Copy</option>
                                <option>Hard Copy</option>
                                <option>Both</option>
                              </select>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Proof Type</label>
                              <select id="proofType" className={'form-select'}>
                                <option value="">Select</option>
                                <option>PAN</option>
                                <option>Aadhaar</option>
                                <option>Passport</option>
                              </select>
                            </div>


                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Receive In Event <span className={'text-danger'}>*</span></label>
                              <select id="receiveEvent" className={'form-select'}>
                                <option value="">Select</option>
                                <option>Apno Se Apni Baat (Live)</option>
                                <option>Hospital Visit</option>
                                <option>Donation Drive</option>
                                <option>Rathyatra Event</option>
                              </select>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Protocol Sadhak <span className={'text-danger'}>*</span></label>
                              <select id="receiveEvent" className={'form-select'}>
                                <option value="">Select</option>
                              </select>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Provisional No.</label>
                              <input type="text" id="ProNo" className={'form-control'} placeholder="Enter Provisional No." />
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Provisional Date</label>
                              <input type="date" className={'form-control'} placeholder="Enter Provisional Date" />
                            </div>

                          </div>

                          <div className={'separator separator-dashed my-6'}></div>

                          <div className={'border rounded p-5 d-none'} id="magCollapse">
                            <div className={'mb-4'}>
                              <h5 className={'fw-bold mb-1'}>Receipt Magazine Details</h5>
                              <div className={'text-muted fs-8'}>Auto-hidden if address present; show when address missing</div>
                            </div>

                            <div className={'notice d-flex bg-light-info rounded border-info border border-dashed p-4 mb-5'}>
                              <div className={'fw-semibold fs-6 text-gray-700'}>
                                Magazine section is only needed when Donor address is missing/incomplete.
                              </div>
                            </div>

                            <div className={'row g-5'}>
                              <div className={'col-md-4'}>
                                <label className={'form-label fw-semibold'}>Magazine Preference</label>
                                <select id="magPref" className={'form-select'}>
                                  <option value="">Select</option>
                                  <option>Hindi</option>
                                  <option>English</option>
                                </select>
                              </div>

                              <div className={'col-md-4'}>
                                <label className={'form-label fw-semibold'}>Dispatch Address Note</label>
                                <input type="text" id="magNote" className={'form-control'} placeholder="Optional" />
                              </div>

                              <div className={'col-md-4'}>
                                <label className={'form-label fw-semibold'}>Receiver Name</label>
                                <input type="text" id="magReceiver" className={'form-control'} placeholder="Optional" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={'tab-pane fade'} id="tab_purpose" role="tabpanel">
                        <div id="purposeBlock">
                          <div className={'row g-5 align-items-end'}>
                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Head <span className={'text-danger'}>*</span></label>
                              <select id="pHead" className={'form-select'}>
                                <option value="">Select</option>
                                <option value="construction">Construction</option>
                                <option value="limb">Artificial Limb</option>
                                <option value="surgery">Corrective Surgery</option>
                                <option value="food">Food/Seva</option>
                                <option value="general">General Donation</option>
                              </select>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Sub Head <span className={'text-danger'}>*</span></label>
                              <select id="pSub" className={'form-select'}>
                                <option value="">Select</option>
                                <option>General</option>
                                <option>Project Specific</option>
                                <option>Campaign</option>
                              </select>
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Purpose Details</label>
                              <input type="text" id="pDesc" className={'form-control'} placeholder="Optional description" />
                            </div>

                            <div className={'col-md-3'}>
                              <label className={'form-label fw-semibold'}>Quantity <span className={'text-danger'}>*</span></label>
                              <div className={'d-flex gap-3'}>
                                <input type="text" id="pQty" className={'form-control'} value="1" inputMode="numeric" />
                                <button className={'btn btn-primary'} type="button" id="addPurposeBtn">Add</button>
                              </div>
                            </div>
                          </div>

                          <div className={'table-responsive mt-6'}>
                            <table className={'table table-rounded table-striped border gy-5 gs-5'}>
                              <thead>
                                <tr className={'fw-bold fs-6 text-gray-800'}>
                                  <th>Head</th>
                                  <th>Sub Head</th>
                                  <th>Details</th>
                                  <th>Qty</th>
                                  <th className={'text-center'}>Action</th>
                                </tr>
                              </thead>
                              <tbody id="purposeTbody">
                                <tr>
                                  <td colSpan={5} className={'text-muted'}>No purpose added.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Critical Disease</label>
                            <select id="proofType" className={'form-select'}>
                              <option value="">Select</option>
                            </select>
                          </div>

                          <div className={'separator separator-dashed my-6'}></div>

                          <div id="familyRefWrap" className={'d-none'}>
                            <div className={'notice d-flex bg-light-warning rounded border-warning border border-dashed p-4 mb-5'}>
                              <div className={'fw-semibold fs-6 text-gray-700'}>
                                Construction donations: ek family ke multiple log donate kar sakte hain. Main Member Donor ID as reference.
                              </div>
                            </div>

                            <div className={'row g-5'}>
                              <div className={'col-md-6'}>
                                <label className={'form-label fw-semibold'}>Main Member Donor ID (Reference)</label>
                                <input type="text" id="mainMemberDonorId" className={'form-control'} placeholder="Enter main donor id (optional)" />
                              </div>

                              <div className={'col-md-6'}>
                                <label className={'form-label fw-semibold'}>Reference Note</label>
                                <input type="text" id="familyRefNote" className={'form-control'} placeholder="Optional" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={'tab-pane fade'} id="tab_instruction" role="tabpanel">
                        <div className={'row g-5 align-items-end'}>
                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Instruction</label>
                            <select id="instType" className={'form-select'}>
                              <option value="">Select</option>
                              <option>AADHAAR CARD UPDATED</option>
                              <option>ADDRESS UPDATED</option>
                              <option>PAN UPDATED</option>
                              <option>MOBILE UPDATED</option>
                            </select>
                          </div>

                          <div className={'col-md-3'}>
                            <label className={'form-label fw-semibold'}>Update In</label>
                            <select id="instUpdateIn" className={'form-select'}>
                              <option value="">Select</option>
                              <option>Donor Master</option>
                              <option>Receive Master</option>
                              <option>Both</option>
                            </select>
                          </div>

                          <div className={'col-md-4'}>
                            <label className={'form-label fw-semibold'}>Details</label>
                            <input type="text" id="instDetails" className={'form-control'} placeholder="e.g., Aadhaar No." />
                          </div>

                          <div className={'col-md-2'}>
                            <button className={'btn btn-primary'} type="button" id="addInstBtn">Add</button>
                          </div>
                        </div>

                        <div className={'table-responsive mt-6'}>
                          <table className={'table table-rounded table-striped border gy-5 gs-5'}>
                            <thead>
                              <tr className={'fw-bold fs-6 text-gray-800'}>
                                <th>Instruction</th>
                                <th>Update In</th>
                                <th>Details</th>
                                <th className={'text-center'}>Action</th>
                              </tr>
                            </thead>
                            <tbody id="instTbody">
                              <tr>
                                <td colSpan={4} className={'text-muted'}>No instructions added.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className={'tab-pane fade'} id="tab_remarks" role="tabpanel">
                        <textarea id="remarks" className={'form-control'} rows={6} placeholder="Write remarks..."></textarea>
                      </div>

                      <div className={'tab-pane fade'} id="tab_attachements" role="tabpanel">
                        <div id="fileUploadWrapper">

                          <div className={'file-row row g-5 align-items-end mb-6'}>

                            <div className={'col-md-4'}>
                              <label className={'form-label fw-semibold'}>
                                File Type <span className={'text-danger'}>*</span>
                              </label>
                              <select className={'form-select file-type'}>
                                <option value="">Select File Type</option>
                                <option>Cheque Image</option>
                                <option>Receipt Copy</option>
                                <option>ID Proof</option>
                                <option>Other Document</option>
                              </select>
                            </div>

                            <div className={'col-md-4'}>
                              <label className={'form-label fw-semibold'}>
                                Upload File <span className={'text-danger'}>*</span>
                              </label>
                              <input type="file" className={'form-control file-input'} />
                            </div>

                            <div className={'col-md-4'}>
                              <label className={'form-label d-block'}>&nbsp;</label>
                              <div className={'d-flex gap-3'}>

                                <button type="button" className={'btn btn-primary addRowBtn'}>
                                  <i className={'fa fa-plus'}></i> Add More
                                </button>

                                <button type="button" className={'btn btn-light-danger removeRowBtn d-none'}>
                                  <i className={'fa fa-trash'}></i> Remove
                                </button>

                              </div>
                            </div>

                          </div>

                        </div>

                      </div>

                      <div className={'tab-pane fade'} id="tab_announces" role="tabpanel">
                        <div className={'row g-6'}>

                          <div className={'col-12 px-4'}>
                            <div className={'alert alert-info d-flex align-items-center p-4'}>
                              <i className={'fa fa-info-circle fs-2 me-3 text-primary'}></i>
                              <div>
                                When donation is received through a <b>Family Group (WOH)</b>,
                                enter the <b>Main Member Donor ID</b> as reference in all Receive IDs.
                              </div>
                            </div>
                          </div>

                          <div className={'col-12 px-4'}>
                            <div className={'card shadow-sm'}>
                              <div className={'card-header'}>
                                <h3 className={'card-title fw-bold text-primary'}>
                                  <i className={'fa fa-user me-2'}></i> Family Reference Details
                                </h3>
                              </div>

                              <div className={'card-body'}>
                                <div className={'row g-5'}>
                                  <div className={'col-md-4'}>
                                    <label className={'form-label fw-semibold'}>
                                      Main Member Donor ID
                                    </label>
                                    <input type="text" className={'form-control'} placeholder="Enter Main Member Donor ID" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={'col-12 px-4'}>
                            <div className={'card shadow-sm'}>
                              <div className={'card-header'}>
                                <h3 className={'card-title fw-bold text-success'}>
                                  <i className={'fa fa-money-bill-wave me-2'}></i> Due Amount Details
                                </h3>
                              </div>

                              <div className={'card-body'}>
                                <div className={'file-row row g-5 align-items-end'}>

                                  <div className={'col-md-4'}>
                                    <label className={'form-label fw-semibold'}>Total Due Amount</label>
                                    <input type="text" className={'form-control'} placeholder="Enter Total Due Amount" />
                                  </div>

                                  <div className={'col-md-4'}>
                                    <label className={'form-label d-block'}>&nbsp;</label>
                                    <div className={'d-flex gap-3'}>
                                      <button type="button" className={'btn btn-primary'}>
                                        <i className={'fa fa-plus'}></i> Add
                                      </button>
                                      <button type="button" className={'btn btn-light-danger d-none'}>
                                        <i className={'fa fa-trash'}></i> Delete
                                      </button>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={'col-12 px-4'}>
                            <div className={'card shadow-sm'}>
                              <div className={'card-header'}>
                                <h3 className={'card-title fw-bold text-danger'}>
                                  <i className={'fa fa-history me-2'}></i> Old Announce History
                                </h3>
                              </div>

                              <div className={'card-body pt-0'}>
                                <div className={'table-responsive mt-6'}>
                                  <table className={'table table-rounded table-striped border gy-5 gs-5 align-middle'}>
                                    <thead className={'bg-light'}>
                                      <tr className={'fw-bold text-gray-800'}>
                                        <th>Donor Bank</th>
                                        <th>Cheque/Draft Date</th>
                                        <th>Cheque/Draft No.</th>
                                        <th>Deposit Bank</th>
                                        <th>Deposit Date</th>
                                        <th>PDC</th>
                                        <th className={'text-center'}>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody id="chequeTbody">
                                      <tr className={'text-center text-muted'}>
                                        <td colSpan={7}>No history available</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                      {/* <!--end::Tabs Content--> */}

                      <div className={'separator separator-dashed my-8'}></div>

                      {/* <!--begin::Tab Navigation Buttons--> */}
                      <div className={'d-flex justify-content-between flex-wrap gap-3'}>
                        <div className={'d-flex gap-5'}> <button type="button" className={'btn btn-light'} id="prevTabBtn" disabled={true}>Previous</button>
                          <div className={'form-check form-check-custom form-check-solid'}>
                            <input className={'form-check-input'} type="checkbox" id="detailsNotComplete" />
                            <label className={'form-check-label fw-semibold'} htmlFor="detailsNotComplete">
                              Details Not Complete
                            </label>
                          </div>
                          <div className={'form-check form-check-custom form-check-solid'}>
                            <input className={'form-check-input'} type="checkbox" id="DNS" />
                            <label className={'form-check-label fw-semibold'} htmlFor="DNS">
                              Send Receipt After DNC
                            </label>
                          </div>
                        </div>


                        <div className={'d-flex gap-3 flex-wrap'}>
                          <button type="button" className={'btn btn-light'} id="addBtn">Add New</button>
                          <button type="button" className={'btn btn-light-info'} id="printBtn">Print</button>
                          <button type="button" className={'btn btn-primary'} id="saveBtn">Save</button>
                          <button type="button" className={'btn btn-danger'}
                            onClick={() => setViewMode('LIST')}
                            id="exitBtn">Exit</button>
                          <button type="button" className={'btn btn-primary'} id="nextTabBtn">Next</button>
                        </div>
                      </div>
                      {/* <!--end::Tab Navigation Buttons--> */}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
