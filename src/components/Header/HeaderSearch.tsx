import React, { useState, useRef, useEffect } from "react";

export const HeaderSearch = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  // click outside close
  useEffect(() => {
    const handleClickOutside = (e:any) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fake search loader
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div ref={boxRef} className="position-relative">
      
      {/* SEARCH ICON */}
      <div
        className="btn btn-icon btn-active-light-primary"
        onClick={() => setOpen(!open)}
      >
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
															<rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black"></rect>
															<path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black"></path>
														</svg>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px show">
          
          {/* SEARCH INPUT */}
          <div className="position-relative mb-5">
            <input
              type="text"
              className="form-control form-control-flush ps-10"
              placeholder="Search..."
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
            />

            {/* spinner */}
            {loading && (
              <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                <span className="spinner-border h-15px w-15px text-gray-400"></span>
              </span>
            )}
          </div>

          <div className="separator border-gray-200 mb-5"></div>

          {/* RESULTS */}
          {!query && (
            <div className="text-muted">Start typing to search...</div>
          )}

          {query && !loading && (
            <div className="scroll-y mh-200px">

              <h5 className="text-muted mb-3">Quick Links</h5>

              <a href="#" className="d-flex text-dark mb-4">
                <div className="symbol symbol-40px me-4 bg-light">
                  <i className="ki-duotone ki-profile-circle fs-2"></i>
                </div>
                <div>
                  <div className="fw-bold">Donors</div>
                  <div className="text-muted fs-7">Search donor records</div>
                </div>
              </a>

              <a href="#" className="d-flex text-dark mb-4">
                <div className="symbol symbol-40px me-4 bg-light">
                  <i className="ki-duotone ki-receipt fs-2"></i>
                </div>
                <div>
                  <div className="fw-bold">Receipts</div>
                  <div className="text-muted fs-7">Search receipts</div>
                </div>
              </a>

              <a href="#" className="d-flex text-dark mb-4">
                <div className="symbol symbol-40px me-4 bg-light">
                  <i className="ki-duotone ki-chart fs-2"></i>
                </div>
                <div>
                  <div className="fw-bold">Reports</div>
                  <div className="text-muted fs-7">View analytics</div>
                </div>
              </a>

            </div>
          )}
        </div>
      )}
    </div>
  );
};