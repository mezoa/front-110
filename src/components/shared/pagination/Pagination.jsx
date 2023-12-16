import React, { useState } from "react";

function Pagination({ total_pages, current_page, per_page }) {
    const [item_per_page, setItemPerPage] = useState(per_page);

    function pageChange(perpage) {
        setItemPerPage(perpage);
        emit("perPageChange", parseInt(perpage));
    }

    return (
        <div className="pagination-perpage-container d-flex flex-wrap my-4">
            <div className="select_per_page">
                <select
                    value={item_per_page}
                    onChange={(e) => pageChange(e.target.value)}
                    className="form-select form-select-sm text-uppercase"
                >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="30">30 per page</option>
                    <option value="40">40 per page</option>
                    <option value="50">50 per page</option>
                </select>
            </div>

            <ul
                className="ms-auto pagination pagination-primary"
                style={{ display: total_pages > 1 ? "block" : "none" }}
            >
                {/* prev */}
                <li
                    onClick={() => emit("pageChange", parseInt(current_page) - 1)}
                    className={`page-item us-none cursor-pointer ${
                        current_page == 1 ? "d-none" : ""
                    }`}
                >
                    <span className="page-link"> Prev</span>
                </li>

                {/* 1st page */}
                <li
                    onClick={() => emit("pageChange", 1)}
                    className={`page-item us-none cursor-pointer ${
                        current_page == 1 ||
                        parseInt(current_page) - 1 == 1 ||
                        parseInt(current_page) - 2 == 1
                            ? "d-none"
                            : ""
                    }`}
                >
                    <span className="page-link"> 1 </span>
                </li>

                <span>&nbsp; </span>
                <span>&nbsp; </span>

                {/* current-2 */}
                <li
                    onClick={() => emit("pageChange", parseInt(current_page) - 2)}
                    className={`page-item us-none cursor-pointer ${
                        current_page == 1 || parseInt(current_page) - 1 == 1 ? "d-none" : ""
                    }`}
                >
                    <span className="page-link"> {current_page - 2} </span>
                </li>

                {/* current-1 */}
                <li
                    onClick={() => emit("pageChange", parseInt(current_page) - 1)}
                    className={`page-item us-none cursor-pointer ${
                        current_page == 1 ? "d-none" : ""
                    }`}
                >
                    <span className="page-link"> {current_page - 1} </span>
                </li>

                {/* current */}
                <li className="page-item us-none cursor-pointer active">
                    <span className="page-link" href="#">
                        {current_page}
                    </span>
                </li>

                {/* current+1 */}
                <li
                    onClick={() => emit("pageChange", parseInt(current_page) + 1)}
                    className={`page-item us-none cursor-pointer ${
                        current_page == total_pages ? "d-none" : ""
                    }`}
                >
                    <span className="page-link"> {parseInt(current_page) + 1}</span>
                </li>

                {/* current+2 */}
                <li
                    onClick={() => emit("pageChange", parseInt(current_page) + 2)}
                    className={`page-item us-none cursor-pointer ${
                        parseInt(current_page) == total_pages ||
                        parseInt(current_page) + 1 == total_pages
                            ? "d-none"
                            : ""
                    }`}
                >
                    <span className="page-link">
                        {parseInt(current_page) + 2}
                    </span>
                </li>

                <span>&nbsp; </span>
                <span>&nbsp; </span>
                {/* last page */}
                <li
                    onClick={() => emit("pageChange", parseInt(total_pages))}
                    className={`page-item us-none cursor-pointer ${
                        current_page == total_pages ||
                        parseInt(current_page) + 1 == total_pages ||
                        parseInt(current_page) + 2 == total_pages
                            ? "d-none"
                            : ""
                    }`}
                >
                    <span className="page-link"> {parseInt(total_pages)} </span>
                </li>

                {/* next */}
                <li
                    onClick={() => emit("pageChange", parseInt(current_page) + 1)}
                    className={`page-item us-none cursor-pointer ${
                        current_page == total_pages ? "d-none" : ""
                    }`}
                >
                    <span className="page-link"> next </span>
                </li>
            </ul>
        </div>
    );
}
export default Pagination;