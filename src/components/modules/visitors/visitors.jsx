import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../components/shared/loader/Loader";
import Pagination from "../../shared/pagination/Pagination";

const Visitors = () => {
    const [loading, setLoading] = useState(false);
    const [visitors, setVisitors] = useState([]);
    const [visitCount, setVisitCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async (page, limit) => {
        setLoading(true);
        setCurrentPage(page);
        setPerPage(limit);
        try {
            const response = await axios.get(`/api/visitors?page=${page}&limit=${limit}`);
            setVisitors(response.data.data.data);
            setTotalPages(response.data.data.last_page);
            setLoading(false);
            setVisitCount(response.data.total_site_visit);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData(1, 10);
    }, []);

    return (
        <div>
            <div className="page-top-box mb-2 d-flex flex-wrap">
                <h3 className="h3">Site Visitors</h3>
                <span className="small-text text-success">({visitCount})</span>
            </div>
            {loading && <Loader />}
            {!loading && (
                <div className="bg-white shadow-sm table-responsive">
                    <table className="table mb-0 table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>IP Address</th>
                                <th className="table-action-col">Total Login</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.map((visitor) => (
                                <tr key={visitor.id}>
                                    <td className="max100">{visitor.ip}</td>
                                    <td className="max100">{visitor.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loading && visitors.length > 0 && (
                <Pagination
                    total_pages={totalPages}
                    current_page={currentPage}
                    per_page={perPage}
                    onPageChange={(currentPage) => fetchData(currentPage, perPage)}
                    onPerPageChange={(perpage) => fetchData(1, perpage)}
                />
            )}
        </div>
    );
};

export default Visitors;
