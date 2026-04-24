import React, { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

import {
  getCallTypesApi,
  getCallSubTypesApi,
  getCallSubTypeConfigApi,
} from "src/api/callDispositionApi";


interface CallType {
  call_type_id: number;
  call_type: string;
}

interface CallSubType {
  call_type_did: number;
  call_type_dtl: string;
  call_type_desc: string | null;
  call_sub_type_id: string;
}

interface DynamicField {
  config_id: number;
  config_name: string;
  field_type: string;
  field_values: string;
}

const CallDispositionCard = () => {
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<any>(null);
  const timePickerRef = useRef<any>(null);

  const [callTypes, setCallTypes] = useState<CallType[]>([]);
  const [callSubTypes, setCallSubTypes] = useState<CallSubType[]>([]);
  const [selectedCallType, setSelectedCallType] = useState<number>(0);
  const [wrapNotes, setWrapNotes] = useState("");
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [dynamicValues, setDynamicValues] = useState<Record<number, string>>({});

  // ⭐ Convert API time to Date
  const convertTimeStringToDate = (timeStr: string) => {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  // ⭐ Flatpickr Init
  useEffect(() => {
    if (dateRef.current && !datePickerRef.current) {
      datePickerRef.current = flatpickr(dateRef.current, {
        dateFormat: "d M Y",
        minDate: "today",
      });
    }

    if (timeRef.current && !timePickerRef.current) {
      timePickerRef.current = flatpickr(timeRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
      });
    }
  }, []);

  // ⭐ Load Call Types
  useEffect(() => {
    loadCallTypes();
  }, []);

  const loadCallTypes = async () => {
    try {
      const res = await getCallTypesApi();
      setCallTypes(res?.Data || []);
    } catch (err) {
      console.error("CallTypes error", err);
    }
  };

  // ⭐ Load Call SubTypes
  useEffect(() => {
    if (!selectedCallType) return;
    loadCallSubTypes();
  }, [selectedCallType]);

  const loadCallSubTypes = async () => {
    try {
      const res = await getCallSubTypesApi(selectedCallType);
      setCallSubTypes(res?.Data || []);
    } catch (err) {
      console.error("CallSubTypes error", err);
    }
  };

  // ⭐ SubType change → Load Config + Dynamic Fields
  const handleSubTypeChange = async (subTypeId: number) => {
    if (!subTypeId) return;

    const selected = callSubTypes.find(x => x.call_type_did === subTypeId);
    setWrapNotes(selected?.call_type_desc || "");
    setDynamicFields([]);
    setDynamicValues({});

    const configId = selected?.call_sub_type_id;
    if (!configId) {
      datePickerRef.current?.clear();
      timePickerRef.current?.clear();
      return;
    }

    try {
      const data = await getCallSubTypeConfigApi(configId);
      const allConfigs = data?.Data || [];

      // Dynamic fields
      const fields = allConfigs.filter((x: any) => {
        const type = x.config_type?.toLowerCase().trim();
        return type === "field for pupup" || type === "url";
      });
      setDynamicFields(fields);

      // Call back config
      const callBackConfig = allConfigs.find(
        (x: any) => x.config_type?.toLowerCase().trim() === "call back"
      );

      if (!callBackConfig) {
        datePickerRef.current?.clear();
        timePickerRef.current?.clear();
        return;
      }

      const followUpDate = new Date();
      followUpDate.setDate(
        followUpDate.getDate() + (callBackConfig.call_back_days || 0)
      );
      datePickerRef.current?.setDate(followUpDate, true);

      if (callBackConfig.call_back_time) {
        const timeDate = convertTimeStringToDate(callBackConfig.call_back_time);
        timePickerRef.current?.setDate(timeDate, true);
      } else {
        timePickerRef.current?.clear();
      }
    } catch (err) {
      console.error("Config error", err);
    }
  };

  const parseFieldValues = (fieldValues: string) =>
    fieldValues.split(",").map(v => v.trim()).filter(v => v);

  const renderDynamicField = (field: DynamicField) => {
    if (field.field_type === "DD") {
      return (
        <select
          className="form-select form-select-solid"
          value={dynamicValues[field.config_id] || ""}
          onChange={(e) =>
            setDynamicValues(prev => ({
              ...prev,
              [field.config_id]: e.target.value,
            }))
          }
        >
          <option value="">Select {field.config_name}</option>
          {parseFieldValues(field.field_values).map(val => (
            <option key={val}>{val}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        className="form-control form-control-solid"
        placeholder={`Enter ${field.config_name}`}
        value={dynamicValues[field.config_id] || ""}
        onChange={(e) =>
          setDynamicValues(prev => ({
            ...prev,
            [field.config_id]: e.target.value,
          }))
        }
      />
    );
  };

  return (
    <div className="card shadow-sm mb-5 h-100">
      <div className="card-header">
        <div className="card-title w-100 d-flex justify-content-between">
          <div>
            <h3 className="fw-bold mb-0">Call Disposition</h3>
            <span className="text-muted fs-7">Call meta + follow-up</span>
          </div>
          <button className="btn btn-primary btn-sm">
            <i className="fa fa-save"></i> Save
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-5">

          <div className="col-md-6">
            <label className="form-label fw-semibold">Call Type</label>
            <select
              className="form-select form-select-solid"
              onChange={(e) => {
                setSelectedCallType(Number(e.target.value));
                setCallSubTypes([]);
                setWrapNotes("");
                setDynamicFields([]);
                setDynamicValues({});
                datePickerRef.current?.clear();
                timePickerRef.current?.clear();
              }}
            >
              <option value="">Select Call Type</option>
              {callTypes.map(item => (
                <option key={item.call_type_id} value={item.call_type_id}>
                  {item.call_type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Call Sub Type</label>
            <select
              className="form-select form-select-solid"
              onChange={(e) => handleSubTypeChange(Number(e.target.value))}
            >
              <option value="">Select Call Sub Type</option>
              {callSubTypes.map(item => (
                <option key={item.call_type_did} value={item.call_type_did}>
                  {item.call_type_dtl}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Follow-up Date</label>
            <input ref={dateRef} className="form-control form-control-solid" />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Follow-up Time</label>
            <input ref={timeRef} className="form-control form-control-solid" />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Wrap-up Notes</label>
            <textarea
              className="form-control form-control-solid"
              rows={3}
              value={wrapNotes}
              onChange={(e) => setWrapNotes(e.target.value)}
            />
          </div>

          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-light-primary">
              <i className="fa fa-sms"></i> WhatsApp/SMS
            </button>
          </div>

          {dynamicFields.length > 0 && (
            <div className="col-12">
              <div className="row g-5">
                {dynamicFields.map(field => (
                  <div className="col-md-6" key={field.config_id}>
                    <label className="form-label fw-semibold">
                      {field.config_name}
                    </label>
                    {renderDynamicField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CallDispositionCard;