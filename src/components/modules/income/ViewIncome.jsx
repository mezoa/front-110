import { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import Loader from "../../shared/loader/Loader";
import { useIncomeStore } from "./incomeStore";

const ViewIncome = ({ income_id }) => {
    const [loading, setLoading] = useState(false);
    const [income_data, setIncomeData] = useState({});
    const incomeStore = useIncomeStore();

    const fetchData = async (id) => {
        setLoading(true);
        await incomeStore.fetchIncome(id);
        setLoading(false);
    };

    const closeViewIncomeModal = () => {
        incomeStore.resetCurrentIncomeData();
        // emit("close");
    };

    useEffect(() => {
        fetchData(income_id);
    }, [income_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Income Record Details</h5>
                        <button type="button" className="close">
                            <CrossIcon onClick={closeViewIncomeModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="form-items">
                                <form action="">
                                    <div className="form-item">
                                        <label className="my-2">Income Short Title: </label>

                                        <input
                                            disabled
                                            type="text"
                                            className="form-control"
                                            value={income_data.title}
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Category: </label>
                                        <div>
                                            {income_data.categories_details &&
                                                income_data.categories_details.map((income_cat) => (
                                                    <span
                                                        key={income_cat.value}
                                                        className="badge bg-primary m-1 px-2 shadow-sm py-2 rounded-2"
                                                    >
                                                        {income_cat.label}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Date: </label>

                                        <input
                                            disabled
                                            type="date"
                                            className="form-control"
                                            value={income_data.date}
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Amount: </label>

                                        <input
                                            disabled
                                            type="number"
                                            className="form-control"
                                            value={income_data.amount}
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Description: </label>
                                        <textarea
                                            disabled
                                            value={income_data.description}
                                            className="form-control"
                                            rows="5"
                                        ></textarea>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewIncome;
