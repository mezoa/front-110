import React, { useState, useEffect } from "react";
import CrossSvgIcon from "../../assets/icons/cross-svg-icon";
import Loader from "../../components/shared/loader/Loader";
import { useIncomeStore } from "./incomeStore";
import Multiselect from "@vueform/multiselect";

const EditIncome = ({ income_id, categories }) => {
    const [loading, setLoading] = useState(false);
    const incomeStore = useIncomeStore();
    const [income_data, setIncomeData] = useState(incomeStore.current_income_item);

    const submitData = async () => {
        try {
            await incomeStore.editIncome(JSON.parse(JSON.stringify(income_data)));
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred" + error);
        }
    };

    const fetchData = async (id) => {
        setLoading(true);
        await incomeStore.fetchIncome(id);
        setLoading(false);
    };

    const closeEditIncomeModal = () => {
        incomeStore.resetCurrentIncomeData();
        emit("close");
    };

    useEffect(() => {
        fetchData(income_id);
    }, [income_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Income</h5>
                        <button type="button" className="close">
                            <CrossSvgIcon onClick={closeEditIncomeModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="form-items">
                                <form action="">
                                    <div className="form-item">
                                        <label className="my-2">Income Short Title</label>
                                        <p className="text-danger">
                                            {incomeStore.edit_income_errors.title}
                                        </p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={income_data.title}
                                            onChange={(e) =>
                                                setIncomeData({
                                                    ...income_data,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Category</label>
                                        <p className="text-danger">
                                            {incomeStore.edit_income_errors.categories}
                                        </p>
                                        <Multiselect
                                            searchable={true}
                                            mode="tags"
                                            hide-selected={false}
                                            value={income_data.categories}
                                            options={categories}
                                            onChange={(value) =>
                                                setIncomeData({
                                                    ...income_data,
                                                    categories: value,
                                                })
                                            }
                                        ></Multiselect>
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Date</label>
                                        <p className="text-danger">
                                            {incomeStore.edit_income_errors.date}
                                        </p>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={income_data.date}
                                            onChange={(e) =>
                                                setIncomeData({
                                                    ...income_data,
                                                    date: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Amount</label>
                                        <p className="text-danger">
                                            {incomeStore.edit_income_errors.amount}
                                        </p>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={income_data.amount}
                                            onChange={(e) =>
                                                setIncomeData({
                                                    ...income_data,
                                                    amount: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Description</label>
                                        <textarea
                                            value={income_data.description}
                                            className="form-control"
                                            rows="5"
                                            onChange={(e) =>
                                                setIncomeData({
                                                    ...income_data,
                                                    description: e.target.value,
                                                })
                                            }
                                        ></textarea>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={closeEditIncomeModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary ml-1 btn-sm"
                            onClick={submitData}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditIncome;
