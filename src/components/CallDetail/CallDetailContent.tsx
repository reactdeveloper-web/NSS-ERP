import React from "react";
import DonorSidebarCard from "src/components/CallDetail/components/DonorSidebarCard";
import HistoryCard from "src/components/CallDetail/components/HistoryCard";
import ActionsCard from "src/components/CallDetail/components/ActionsCard";
import ViewCard from "src/components/CallDetail/components/ViewCard";
import CallDispositionCard from "src/components/CallDetail/components/CallDispositionCard";
import { PageToolbar } from '../Common/PageToolbar';

const CallDetailContent = () => {
  return (
     <div className="content d-flex flex-column flex-column-fluid" id="kt_content">

      <PageToolbar title="National Gangotri" description="Call Detail" />

      <div className="post d-flex flex-column-fluid">
        <div className="container-fluid">
      <div className="row g-5 mb-5">

        {/* LEFT */}
        <div className="col-xl-3">
          <DonorSidebarCard />
        </div>

        {/* CENTER */}
        <div className="col-xl-6">
          <HistoryCard />

          <div className="d-flex gap-5">
            <ActionsCard />
            <ViewCard />
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-xl-3">
          <CallDispositionCard />
        </div>

      </div>
      </div>
    </div>
    </div>
  );
};

export default CallDetailContent;