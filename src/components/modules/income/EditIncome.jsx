import React, { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import Loader from "../../shared/loader/Loader";
import { useIncomeStore } from "./incomeStore";
import Select from "react-select";
import { toast } from "react-toastify";


const EditIncome = ({ income_id, categories, close, refreshData }) => {
    console.log("income_id", income_id)
    const [loading, setLoading] = useState(false);
    const incomeStore = useIncomeStore();
    const { fetchIncome, editIncome } = incomeStore;
    
    const initialIncomeData = {
        title: "",
        categories: "",
        entry_date: "",
        amount: "",
        description: "",
    };
    const [income_data, setIncomeData] = useState([]);

    const submitData = async () => {
        try {
            const { categories, amount, date, ...otherData } = income_data;
            const dataToSubmit = {
                ...otherData,
                category_id: categories.value,
                amount: parseFloat(amount),
                entry_date: date,
            };
            await editIncome(dataToSubmit);
    
            toast.success("Income edited successfully");
            refreshData();
            close();
        } catch (error) {
            console.log("error occurred" + error);
            toast.error("Error occurred while editing income");
        }
    };

    const fetchData = async (id) => {
        setLoading(true);
         const incomes = await fetchIncome(id);
            console.log('incomes', incomes);
        setIncomeData(incomes);
        setLoading(false);
    };

    const closeEditIncomeModal = () => {
        incomeStore.resetCurrentIncomeData();
        close();
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
                            <CrossIcon onClick={closeEditIncomeModal} />
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
                                        <Select
                                            options={categories}
                                            value={income_data.categories}
                                            onChange={(value) =>
                                                setIncomeData({
                                                    ...income_data,
                                                    categories: value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={income_data.entry_date}
                                            onChange={(e) =>
                                                setIncomeData({
                                                    ...income_data,
                                                    entry_date: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Income Amount</label>
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
