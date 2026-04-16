import React, { useState, useEffect } from 'react';
import axiosInstance from 'src/redux/axiosInstance';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import { ContentTypes } from 'src/constants/content';

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

export const PersonalDetailsTab: React.FC<{ viewMode: string }> = ({ viewMode }) => {

    const [salutations, setSalutations] = useState<Salutation[]>([]);
    const [occasions, setOccasions] = useState<Occasion[]>([]);

    //Fetch Salutations data from API
    useEffect(() => {
        const fetchSalutation = async () => {
            try {
                const response = await axiosInstance.get(`${masterApiPaths.getSalutations}`, {
                    params: {
                        Data_Flag: ContentTypes.DataFlag
                    }
                });
                const apiData = response.data?.Data || response.data || [];
                const finalArray = apiData.result || [];
                // console.log("=== PARSED DATA fetchSalutation: ===", finalArray);
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
                const responce = await axiosInstance.get(`${masterApiPaths.getOccasionMaster}`, {
                    params: {
                        DataFlag: ContentTypes.DataFlag
                    }
                });
                const apiData = responce.data?.Data || responce.data || [];
                const finalArray = apiData.result || [];
                setOccasions(finalArray);
                // console.log("=== PARSED DATA fetchOccasions: ===", finalArray);

            } catch (error: any) {
                console.error('Failed to load occasions:', error);
            }
        };
        if (viewMode === 'FORM') {
            fetchOccasions();
        }
    }, [viewMode]);

    return (
        <>
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

                            <select
                                id="salutation"
                                className={'form-select'}
                                style={{ maxWidth: '110px' }}
                                defaultValue=""
                            >
                                <option value="" disabled>Select</option>
                                {salutations.map((salutation: Salutation, index: number) => {
                                    return (
                                        <option
                                            key={salutation.SAL_CODE || index}
                                            value={salutation.SAL_CODE}
                                        >
                                            {salutation.SAL_NAME}
                                        </option>
                                    );
                                })}
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
                            {occasions.map((occasion: Occasion, index: number) => {
                                return (
                                    <option key={occasion.OccasionId || index}
                                        value={occasion.OccasionId}>
                                        {occasion.OccasionName}
                                    </option>
                                );
                            })}
                        </select>

                    </div>

                    {/* <div className={'col-md-3 d-none'} id="occasionInputBox">
                            <label className={'form-label fw-semibold'}>Enter Detail</label>
                            <input type="text" className={'form-control'} placeholder="Enter Details" />
                          </div> */}

                    {/* <div className={'col-md-8 d-none'} id="inMemoryWrap">
                            <label className={'form-label fw-semibold'}>Occasion / In Memory Details</label>
                            <input type="text" id="inMemoryText" className={'form-control'} placeholder="e.g., Birthday / Anniversary / Punya Tithi..." />
                          </div> */}

                </div>
            </div>

        </>
    );
};  