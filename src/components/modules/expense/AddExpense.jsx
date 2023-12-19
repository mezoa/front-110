import { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import { useExpenseStore, useExpenseActions } from "./expenseStore";
import Select from "react-select";

const AddExpense = ({ categories, onClose, refreshData }) => {
    const expenseStore = useExpenseStore();
    const [expenseData, setExpenseData] = useState(expenseStore.current_expense_item || {});
    const { resetCurrentExpenseData, addExpense } = useExpenseActions();

    const submitData = async () => {
        try {
            await addExpense(JSON.parse(JSON.stringify(expenseData)));
            console.log(expenseData)
            refreshData();
            onClose();
        } catch (error) {
            console.log("error occurred, ", error);
        }
    };

    const closeAddExpenseModal = () => {
        refreshData();
        onClose();
    };

    useEffect(() => {
        resetCurrentExpenseData();
    }, []);

    console.log('expenseData', expenseData)
    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Expense</h5>
                        <button type="button" className="close" onClick={closeAddExpenseModal}>
                            <CrossIcon  />
                        </button>
                    </div>

                    <div className="modal-body">
                        <form action="">
                            <div className="form-item">
                                <label className="my-2">Expense Short Title</label>
                                <p className="text-danger">
                                    {expenseStore.add_expense_errors && expenseStore.add_expense_errors.title}
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
                                    {expenseStore.add_expense_errors && expenseStore.add_expense_errors.categories}
                                </p>

                                <Select
                                    isSearchable={true}
                                    value={expenseData.categories}
                                    options={categories}
                                    onChange={(value) =>
                                        setExpenseData({
                                            ...expenseData,
                                            categories: value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Expense Date</label>
                                <p className="text-danger">
                                    {expenseStore.add_expense_errors && expenseStore.add_expense_errors.entry_date}
                                </p>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={expenseData.entry_date}
                                    onChange={(e) =>
                                        setExpenseData({
                                            ...expenseData,
                                            entry_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <label className="my-2">Expense Amount</label>
                                <p className="text-danger">
                                    {expenseStore.add_expense_errors && expenseStore.add_expense_errors.amount}
                                </p>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={expenseData.amount}
                                    onChange={(e) => {
                                        const amount = parseFloat(e.target.value);
                                        setExpenseData({ ...expenseData, amount: isNaN(amount) ? 0 : amount });
                                    }}
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
