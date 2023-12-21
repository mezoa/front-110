import React, { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import Loader from "../../../components/shared/loader/Loader";
import { useExpenseStore, fetchExpense, editExpense } from "./expenseStore";
import Select from 'react-select'; // Import the react-select library
import {toast} from "react-toastify";

const EditExpense = ({ expenseId, categories, onClose, refreshData }) => {
    const [loading, setLoading] = useState(false);
    const expenseStore = useExpenseStore();
    const [expense_data, setExpenseData] = useState(expenseStore.current_expense_item || {
        title: '',
        categories: '',
        entry_date: '',
        amount: '',
        description: ''
    });


    console.log(expenseId);
    const submitData = async () => {
        console.log(expense_data)
        try {
            const dataToSubmit = {
                ...expense_data,
                category_id: expense_data.categories.value,
                expense_id: expenseId,
            };
            delete dataToSubmit.categories;
            console.log(dataToSubmit)
            await editExpense(dataToSubmit);
            refreshData();
            onClose();
            toast.success('Expense successfully edited!');
        } catch (error) {
            console.log("error occurred" + error);
            toast.error('An error occurred while editing the expense.');
        }
    };
    const fetchData = async () => {
        setLoading(true);
        await fetchExpense(expenseId);
        setLoading(false);
    };

    const closeEditExpenseModal = () => {
        expenseStore.resetCurrentExpenseData();
    };

    useEffect(() => {
        fetchData();
    }, [expenseId]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Expense</h5>
                        <button type="button" className="close" onClick={closeEditExpenseModal}>
                            <CrossIcon />
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
                                        <p className="text-danger">{expense_data.title}</p>
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
                                            {expense_data.categories.label}
                                        </p>
                                        <Select
                                            options={categories}
                                            value={expense_data.categories}
                                            onChange={(value) =>
                                                setExpenseData({ ...expense_data, categories: value })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Date</label>
                                        <p className="text-danger">{expense_data.entry_date}</p>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={expense_data.entry_date}
                                            onChange={(e) =>
                                                setExpenseData({ ...expense_data, entry_date: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="form-item">
                                        <label className="my-2">Expense Amount</label>
                                        <p className="text-danger">{expense_data.amount}</p>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={expense_data.amount}
                                            onChange={(e) =>
                                                setExpenseData({ ...expense_data, amount: parseFloat(e.target.value) })
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
