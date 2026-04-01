import React from 'react';
import { AnnounceMasterNav } from './AnnounceMasterNav';

export const AnnounceMasterContent = () => {
  return (
    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
      <AnnounceMasterNav />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row gy-5 g-xl-8">
            <div className="col-12">
              <div className="card card-xl-stretch mb-5 mb-xl-8">
                <div className="card-header border-0 pt-5">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-1">
                      Announce Master
                    </span>
                    <span className="text-muted mt-1 fw-bold fs-7">
                      This page is ready for content.
                    </span>
                  </h3>
                </div>

                <div className="card-body py-10">
                  <div className="d-flex flex-column align-items-center justify-content-center text-center min-h-300px">
                    <span className="text-muted fs-6">
                      Blank Announce Master page
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
