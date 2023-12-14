import React, { useState, useEffect } from "react";
import CrossSvgIcon from "../../assets/icons/cross-svg-icon";
import Loader from "../../components/shared/loader/Loader";
import { useExpenseCategoryStore } from "./expenseCategoryStore";

const ViewExpenseCat = ({ expense_category_id }) => {
    const [loading, setLoading] = useState(false);
    const expenseCategoryStore = useExpenseCategoryStore();
    const [expense_category_data, setExpenseCategoryData] = useState(
        expenseCategoryStore.current_expense_category_item
    );

    const fetchData = async (id) => {
        setLoading(true);
        await expenseCategoryStore.fetchExpenseCat(id);
        setLoading(false);
    };

    const closeEditExpenseModal = () => {
        expenseCategoryStore.resetCurrentExpenseCatData();
        // emit("close");
    };

    useEffect(() => {
        fetchData(expense_category_id);
    }, [expense_category_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Expense Category Details</h5>
                        <button type="button" className="close">
                            <CrossSvgIcon onClick={closeEditExpenseModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="form-items">
                                <form action="">
                                    <div className="form-item">
                                        <label className="my-2">Category Name</label>
                                        <input
                                            disabled
                                            type="text"
                                            className="form-control"
                                            value={expense_category_data.name}
                                        />
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

export default ViewExpenseCat;
