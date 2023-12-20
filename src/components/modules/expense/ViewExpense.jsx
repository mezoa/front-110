import { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import Loader from "../../shared/loader/Loader";
import { useExpenseStore } from "../expense/expenseStore";

const ViewExpense = ({ expense_id }) => {
    const [loading, setLoading] = useState(false);
    const [expense_data, setExpenseData] = useState({});
    const expenseStore = useExpenseStore();

    const fetchData = async (id) => {
        setLoading(true);
        const response = await expenseStore.fetchExpense(id);
        setExpenseData(response.data.data);
        setLoading(false);
    };

    const closeViewExpenseModal = () => {
        expenseStore.resetCurrentExpenseData();
        // emit("close");
    };

    useEffect(() => {
        fetchData(expense_id);
    }, [expense_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Expense Record Details</h5>
                        <button type="button" className="close">
                            <CrossIcon onClick={closeViewExpenseModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="form-items">
                                <form action="">
                                    <div className="form-item">
                                        <label className="my-2">Expense Short Title: </label>

                                        <input
                                            disabled
                                            type="text"
                                            className="form-control"
                                            value={expense_data.title}
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Category: </label>
                                        <div>
                                            {expense_data.categories_details &&
                                                expense_data.categories_details.map((expense_cat) => (
                                                    <span
                                                        key={expense_cat.value}
                                                        className="badge bg-primary m-1 px-2 shadow-sm py-2 rounded-2"
                                                    >
                                                        {expense_cat.label}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Date: </label>

                                        <input
                                            disabled
                                            type="date"
                                            className="form-control"
                                            value={expense_data.date}
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Amount: </label>

                                        <input
                                            disabled
                                            type="number"
                                            className="form-control"
                                            value={expense_data.amount}
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Description: </label>
                                        <textarea
                                            disabled
                                            value={expense_data.description}
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

export default ViewExpense;
