import { useState, useEffect } from "react";
import CrossSvgIcon from "../../assets/icons/cross-svg-icon";
import Loader from "../../components/shared/loader/Loader";
import { useExpenseStore } from "./expenseStore";
import Multiselect from "@vueform/multiselect";

const EditExpense = ({ expense_id, categories }) => {
    const [loading, setLoading] = useState(false);
    const expenseStore = useExpenseStore();
    const [expense_data, setExpenseData] = useState(expenseStore.current_expense_item);

    const submitData = async () => {
        try {
            await expenseStore.editExpense(JSON.parse(JSON.stringify(expenseStore.current_expense_item)));
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred" + error);
        }
    };

    const fetchData = async (id) => {
        setLoading(true);
        await expenseStore.fetchExpense(id);
        setLoading(false);
    };

    const closeEditExpenseModal = () => {
        expenseStore.resetCurrentExpenseData();
        emit("close");
    };

    useEffect(() => {
        fetchData(expense_id);
    }, [expense_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Expense</h5>
                        <button type="button" className="close" onClick={closeEditExpenseModal}>
                            <CrossSvgIcon />
                        </button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="form-items">
                                <form action="">
                                    <div className="form-item">
                                        <label className="my-2">Expense Short Title</label>
                                        <p className="text-danger">
                                            {expenseStore.edit_expense_errors.title}
                                        </p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={expense_data.title}
                                            onChange={(e) =>
                                                setExpenseData({ ...expense_data, title: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Category</label>
                                        <p className="text-danger">
                                            {expenseStore.edit_expense_errors.categories}
                                        </p>
                                        <Multiselect
                                            searchable={true}
                                            mode="tags"
                                            hide-selected={false}
                                            value={expense_data.categories}
                                            options={categories}
                                            onChange={(value) =>
                                                setExpenseData({ ...expense_data, categories: value })
                                            }
                                        ></Multiselect>
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Date</label>
                                        <p className="text-danger">
                                            {expenseStore.edit_expense_errors.date}
                                        </p>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={expense_data.date}
                                            onChange={(e) =>
                                                setExpenseData({ ...expense_data, date: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Amount</label>
                                        <p className="text-danger">
                                            {expenseStore.edit_expense_errors.amount}
                                        </p>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={expense_data.amount}
                                            onChange={(e) =>
                                                setExpenseData({ ...expense_data, amount: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Description</label>
                                        <textarea
                                            value={expense_data.description}
                                            className="form-control"
                                            rows="5"
                                            onChange={(e) =>
                                                setExpenseData({ ...expense_data, description: e.target.value })
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
                            onClick={closeEditExpenseModal}
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

export default EditExpense;
