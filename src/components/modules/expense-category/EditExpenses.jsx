import { useState, useEffect } from "react";
import CrossSvgIcon from "../../assets/icons/cross-svg-icon";
import Loader from "../../components/shared/loader/Loader";
import { useExpenseCategoryStore } from "./expenseCategoryStore";

const EditExpenses = ({ expense_category_id }) => {
    const [loading, setLoading] = useState(false);
    const expenseCategoryStore = useExpenseCategoryStore();
    const [expense_category_data, setExpenseCategoryData] = useState(
        expenseCategoryStore.current_expense_category_item
    );

    const submitData = async () => {
        try {
            await expenseCategoryStore.editExpenseCat(
                JSON.parse(JSON.stringify(expense_category_data))
            );
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred" + error);
        }
    };

    const fetchData = async (id) => {
        setLoading(true);
        await expenseCategoryStore.fetchExpenseCat(id);
        setLoading(false);
    };

    const closeEditExpenseModal = () => {
        expenseCategoryStore.resetCurrentExpenseCatData();
        emit("close");
    };

    useEffect(() => {
        fetchData(expense_category_id);
    }, [expense_category_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Expense</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={closeEditExpenseModal}
                        >
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
                                        <label className="my-2">
                                            Expense Category Name
                                        </label>
                                        <p className="text-danger">
                                            {expenseCategoryStore.edit_expense_category_errors.name}
                                        </p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={expense_category_data.name}
                                            onChange={(e) =>
                                                setExpenseCategoryData({
                                                    ...expense_category_data,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
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

export default EditExpenses;
