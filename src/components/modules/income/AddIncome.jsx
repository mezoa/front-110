import React, { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import { useIncomeStore } from "./incomeStore";
import Select from "react-select";

const AddIncome = ({ categories }) => {
    const [incomeData, setIncomeData] = useState({
        title: "",
        categories: [],
        date: "",
        amount: "",
        description: ""
    });

    const incomeStore = useIncomeStore();

    useEffect(() => {
        incomeStore.resetCurrentIncomeData();
    }, []);

    const submitData = async () => {
        try {
            await incomeStore.addIncome(JSON.parse(JSON.stringify(incomeData)));
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred");
        }
    };

    const closeAddIncomeModal = () => {
        incomeStore.resetCurrentIncomeData();
        emit("close");
    };

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Income</h5>
                        <button type="button" className="close">
                            <CrossIcon onClick={closeAddIncomeModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <form action="">
                            <div className="form-item">
                                <label className="my-2">Income Short Title</label>
                                <p className="text-danger">
                                    {incomeStore.add_income_errors.title}
                                </p>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={incomeData.title}
                                    onChange={(e) =>
                                        setIncomeData({ ...incomeData, title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Income Category</label>
                                <p className="text-danger">
                                    {incomeStore.add_income_errors.categories}
                                </p>

                                <Select
                                    isSearchable={true}
                                    isMulti={true}
                                    hideSelectedOptions={false}
                                    value={incomeData.categories}
                                    options={categories}
                                    onChange={(value) =>
                                        setIncomeData({ ...incomeData, categories: value })
                                    }
                                ></Select>
                            </div>
                            <div className="form-item">
                                <label className="my-2">Income Date</label>
                                <p className="text-danger">
                                    {incomeStore.add_income_errors.date}
                                </p>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={incomeData.date}
                                    onChange={(e) =>
                                        setIncomeData({ ...incomeData, date: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Income Amount</label>
                                <p className="text-danger">
                                    {incomeStore.add_income_errors.amount}
                                </p>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={incomeData.amount}
                                    onChange={(e) =>
                                        setIncomeData({ ...incomeData, amount: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Description</label>
                                <textarea
                                    value={incomeData.description}
                                    className="form-control"
                                    rows="5"
                                    onChange={(e) =>
                                        setIncomeData({ ...incomeData, description: e.target.value })
                                    }
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={closeAddIncomeModal}
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

export default AddIncome;
