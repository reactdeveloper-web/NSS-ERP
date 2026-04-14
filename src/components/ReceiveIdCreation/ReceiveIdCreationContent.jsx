import './ReceiveIdCreationContent.scss';
import React from 'react';
import { ReceiveIdCreationNav } from './ReceiveIdCreationNav';
import { PATH } from 'src/constants/paths';
import { Link } from 'react-router-dom';

function ReceiveIdCreationContent() {
  return (
    <>
      <ReceiveIdCreationNav />
      <div className={'post d-flex flex-column-fluid my-5'}>
        <div className={'container-fluid'}>
          <div className={'row gy-5 g-xl-3'}>
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
                      <span className={'svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle-y ms-4'}>
                        <i className={'fa fa-search'} aria-hidden="true"></i>
                      </span>
                      <input type="text" id="tableSearch" className={'form-control w-250px ps-12'} placeholder="Search records..." />
                    </div>
                    <button id="toggleFilter" className={'btn btn-sm btn-flex btn-light btn-active-primary fw-bolder p-6 mx-5'}>
                      <i className={'fas fa-filter fs-4'}></i>
                    </button>
                    <Link to={PATH.RECEIVE_ID_Master} className={'btn btn-sm btn-primary btn-active-primary p-3'}>
                      <i className={'fa fa-plus'} aria-hidden="true"></i> Add
                    </Link>
                  </div>
                </div>
                {/* end--Header */}
                {/* begin--Filter */}
                <div id={'filterPanel'} className={'px-5 pb-5'} style={{ 'display': 'none' }}>
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
                          <label className='fw-bold mb-2'>Received ID</label>
                          <input type="text" className={'form-control'} />
                        </div>

                        <div className={'col-md-3'}>
                          <label className={'fw-bold mb-2'}>Cheque No.</label>
                          <input type="text" className={'form-control'} />
                        </div>

                        <div className={'col-md-3'}>
                          <label className={'fw-bold mb-2'}>Pay Mode</label>
                          <select className={'form-select select2-hidden-accessible'} data-control="select2" data-select2-id="select2-data-7-mxfo" tabindex="-1" aria-hidden="true">
                            <option data-select2-id="select2-data-9-1kew">Select Mode</option>
                            <option>Cash</option>
                            <option>Cheque</option>
                            <option>Online</option>
                          </select><span className={'select2 select2-container select2-container--bootstrap5'} dir="ltr" data-select2-id="select2-data-8-dtdf" style={{ 'width': '100%' }}><span className={'selection'}><span className={'select2-selection select2-selection--single form-select'} role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-k8ik-container" aria-controls="select2-k8ik-container"><span className={'select2-selection__rendered'} id="select2-k8ik-container" role="textbox" aria-readonly="true" title="Select Mode">Select Mode</span><span className={'select2-selection__arrow'} role="presentation"><b role="presentation"></b></span></span></span><span className={'dropdown-wrapper'} aria-hidden="true"></span></span>
                        </div>

                        <div className={'col-md-3'}>
                          <label className={'fw-bold mb-2'}>City</label>
                          <select className={'form-select select2-hidden-accessible'} data-control="select2" data-select2-id="select2-data-10-3is7" tabindex="-1" aria-hidden="true">
                            <option data-select2-id="select2-data-12-mf42">Select City</option>
                          </select><span className={'select2 select2-container select2-container--bootstrap5'} dir="ltr" data-select2-id="select2-data-11-pce8" style={{ 'width': '100%' }}><span className={'selection'}><span className={'select2-selection select2-selection--single form-select'} role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-5lm0-container" aria-controls="select2-5lm0-container"><span className={'select2-selection__rendered'} id="select2-5lm0-container" role="textbox" aria-readonly="true" title="Select City">Select City</span><span className={'select2-selection__arrow'} role="presentation"><b role="presentation"></b></span></span></span><span className={'dropdown-wrapper'} aria-hidden="true"></span></span>
                        </div>

                        <div className={'col-md-3'}>
                          <label className={'fw-bold mb-2'}>State</label>
                          <select className={'form-select select2-hidden-accessible'} data-control="select2" data-select2-id="select2-data-13-iozm" tabindex="-1" aria-hidden="true">
                            <option data-select2-id="select2-data-15-gf2q">Select State</option>
                          </select><span className={'select2 select2-container select2-container--bootstrap5'} dir="ltr" data-select2-id="select2-data-14-7i0l" style={{ 'width': '100%' }}><span className={'selection'}><span className={'select2-selection select2-selection--single form-select'} role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-448a-container" aria-controls="select2-448a-container"><span className={'select2-selection__rendered'} id="select2-448a-container" role="textbox" aria-readonly="true" title="Select State">Select State</span><span className={'select2-selection__arrow'} role="presentation"><b role="presentation"></b></span></span></span><span className={'dropdown-wrapper'} aria-hidden="true"></span></span>
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
                        <button className={'btn btn-light me-3'}>
                          Reset
                        </button>
                        <button className={'btn btn-primary'}>Search</button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end--Filter */}
                {/* begin--Table */}
                <div className={'card-body p-3'}>
                  <div className={'table-responsive'} style={{ 'maxHeight': '550px' }}>
                    <table id={'receiveTable'} className={'table table-row-dashed table-row-gray-300 align-middle gs-0'}>
                      {/* Table head */}
                      <thead>
                        <tr className={'fw-bolder text-dark bg-light-primary text-nowrap'}>
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
                          <th className={'sortable'} data-sort="4">Date</th>
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
                          <th className={'sortable'} data-sort="9">Type</th>
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
                        <tr valign="top" style={{}}>
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
                            <button type="submit" id="kt_modal_update_customer_submit" className={'btn btn-primary fw-normal fs-7 p-2'}>
                              <span className={'indicator-label'}>WhatsApp
                                Chat</span>
                            </button>
                          </td>
                          <td>
                            <input type="text" className={'form-control p-1 mb-1'} placeholder="" name="name" value="" />
                            <button type="submit" id="kt_modal_update_customer_submit" className={'btn btn-primary fw-normal fs-7 p-2 px-4'}>
                              <span className={'indicator-label'}>Call</span>
                            </button>
                          </td>
                          <td>
                            <input type="file" className={'form-control p-2 mb-1'} placeholder="" name="name" value="" />
                            <button type="submit" id="kt_modal_update_customer_submit" className={'btn btn-primary fw-normal fs-7 p-2 px-4'}>
                              <span className={'indicator-label'}>Call</span>
                            </button>
                          </td>
                          <td>
                            <div className={'d-flex justify-content-end flex-shrink-0'}>
                              <a href="#" className={'btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'}>
                                {/*begin::Svg Icon | path: icons/duotune/general/gen019.svg*/}
                                <span className={'svg-icon svg-icon-3'}>
                                  <i className={'fa fa-eye'} aria-hidden="true"></i>
                                </span>
                              </a>
                              <a href="#" className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                <span className={'svg-icon svg-icon-3'}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path>
                                    <path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path>
                                  </svg>
                                </span>
                              </a>
                              <a href="#" className={'btn btn-icon btn-bg-light btn-active-color-primary btn-sm'}>
                                <span className={'svg-icon svg-icon-3'}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path>
                                    <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path>
                                    <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path>
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
        </div>
      </div>
    </>
  );
}

export default ReceiveIdCreationContent;
