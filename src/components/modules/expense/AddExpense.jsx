import { useState, useEffect } from "react";
import CrossSvgIcon from "../../assets/icons/cross-svg-icon";
import { useExpenseStore } from "./expenseStore";
import Multiselect from "@vueform/multiselect";

const AddExpense = ({ categories }) => {
    const expenseStore = useExpenseStore();
    const [expenseData, setExpenseData] = useState(expenseStore.current_expense_item);

    const submitData = async () => {
        try {
            await expenseStore.addExpense(JSON.parse(JSON.stringify(expenseData)));
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred");
        }
    };

    const closeAddExpenseModal = () => {
        expenseStore.resetCurrentExpenseData();
        emit("close");
    };

    useEffect(() => {
        expenseStore.resetCurrentExpenseData();
    }, []);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Expense</h5>
                        <button type="button" className="close">
                            <CrossSvgIcon onClick={closeAddExpenseModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <form action="">
                            <div className="form-item">
                                <label className="my-2">Expense Short Title</label>
                                <p className="text-danger">
                                    {expenseStore.add_expense_errors.title}
                                </p>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={expenseData.title}
                                    onChange={(e) =>
                                        setExpenseData({
                                            ...expenseData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Expense Category</label>
                                <p className="text-danger">
                                    {expenseStore.add_expense_errors.categories}
                                </p>

                                <Multiselect
                                    searchable={true}
                                    mode="tags"
                                    hide-selected={false}
                                    value={expenseData.categories}
                                    options={categories}
                                    onChange={(value) =>
                                        setExpenseData({
                                            ...expenseData,
                                            categories: value,
                                        })
                                    }
                                ></Multiselect>
                            </div>
                            <div className="form-item">
                                <label className="my-2">Expense Date</label>
                                <p className="text-danger">
                                    {expenseStore.add_expense_errors.date}
                                </p>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={expenseData.date}
                                    onChange={(e) =>
                                        setExpenseData({
                                            ...expenseData,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Expense Amount</label>
                                <p className="text-danger">
                                    {expenseStore.add_expense_errors.amount}
                                </p>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={expenseData.amount}
                                    onChange={(e) =>
                                        setExpenseData({
                                            ...expenseData,
                                            amount: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Description</label>
                                <textarea
                                    value={expenseData.description}
                                    className="form-control"
                                    rows="5"
                                    onChange={(e) =>
                                        setExpenseData({
                                            ...expenseData,
                                            description: e.target.value,
                                        })
                                    }
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={closeAddExpenseModal}
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

export default AddExpense;
