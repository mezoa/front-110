import { useEffect, useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import Loader from "../../shared/loader/Loader";
import Pagination from "../../shared/pagination/Pagination";
import { useConfirmStore } from "../../shared/confirm-alert/confirmStore";
import { useExpenseStore } from "./expenseStore";
import { useExpenseCategoryStore } from "../expense-category/expenseCategoryStore";
import BinIcon from "../../../assets/icons/binicon";
import EditIcon from "../../../assets/icons/editicon";
import ViewIcon from "../../../assets/icons/viewicon";
import AddNewButton from "../../buttons/AddNewButton";
import FilterButton from "../../buttons/FilterButton";
import BulkDeleteButton from "../../buttons/BulkDeleteButton";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import ViewExpense from "./ViewExpense";
import { fetchExpenses } from './expenseStore';


const Expense = () => {
    const [loading, setLoading] = useState(false);
    const [filterTab, setFilterTab] = useState(true);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showEditExpense, setShowEditExpense] = useState(false);
    const [showViewExpense, setShowViewExpense] = useState(false);

    const dispatch = useDispatch();
    const expenseStore = useExpenseStore();
    const confirmStore = useConfirmStore();
    const [expenses, setExpenses] = useState([]);
    const expenseCategoryStore = useExpenseCategoryStore();
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [q_title, setQTitle] = useState("");
    const [selected_expenses, setSelectedExpenses] = useState([]);
    const [all_selected, setAllSelected] = useState(false);
    
    const select_all = () => {
        if (all_selected === false) {
            setSelectedExpenses(expenseStore.expenses.map((element) => element.id));
            setAllSelected(true);
        } else {
            setAllSelected(false);
            setSelectedExpenses([]);
        }
    };

    const fetchCategories = useCallback(async () => {
        const response = await expenseCategoryStore.fetchCatList();
        return response.data;
    }, [dispatch]);
    
    useEffect(() => {
        fetchData(1);
        fetchCategories().then((response) => {
            const mappedResponse = response.map(category => ({
                value: category.category_id,
                label: category.name
            }));
            setExpenseCategories(mappedResponse);
        });
    }, []);

    

    const deleteData = async (id) => {
        confirmStore.show_box({ message: "Do you want to delete selected expense?" }).then(async () => {
            if (confirmStore.do_action === true) {
                expenseStore.deleteExpense(id).then(() => {
                    expenseStore.fetchExpenses(expenseStore.current_page, expenseStore.limit, expenseStore.q_title);
    
                    if (Array.isArray(id)) {
                        setAllSelected(false);
                        setSelectedExpenses([]);
                    }
                });
            }
        });
    };

    const openEditExpenseModal = (id) => {
        expenseStore.edit_expense_id = id;
        setShowEditExpense(true);
    };

    const openViewExpenseModal = (id) => {
        expenseStore.view_expense_id = id;
        setShowViewExpense(true);
    };

    const fetchData = async (page = 1, limit = 10, q_title = "", q_name = "", q_start_amount = "", q_end_amount = "", q_start_date = "", q_end_date = "", q_sort_column = expenseStore.q_sort_column, q_sort_order = expenseStore.q_sort_order) => {
        setLoading(true);
        try {
            const response = await dispatch(fetchExpenses(page, limit, q_title, q_name, q_start_amount, q_end_amount, q_start_date, q_end_date, q_sort_column, q_sort_order));
            setLoading(false);
            console.log('response', response)
            setExpenses(response);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData(1);
        fetchCategories().then((response) => {
            if (Array.isArray(response)) {
                const mappedResponse = response.map(category => ({
                    value: category.category_id,
                    label: category.name
                }));
                setExpenseCategories(mappedResponse);
            } else {
                console.error('fetchCategories response is not an array:', response);
            }
        });
    }, []);

    return (
        <div>
            <div className="page-top-box mb-2 d-flex flex-wrap">
                <h3 className="h3">Expense List</h3>
                <div className="page-heading-actions ms-auto">
                    {selected_expenses.length > 0 && <BulkDeleteButton onClick={() => deleteData(selected_expenses)} />}
                    <AddNewButton onClick={() => setShowAddExpense(true)} />
                    <FilterButton onClick={() => setFilterTab(!filterTab)} />
                </div>
            </div>
            {filterTab && (
                <div className="p-1 my-2">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 my-1">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="type name.."
                                value={q_title}
                                onChange={(e) => {
                                    setQTitle(e.target.value);
                                    fetchData(1, expenseStore.limit, e.target.value);
                                }}
                            />
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <select
                                className="form-select"
                                value={expenseStore.q_category_id} // use category id here
                                onChange={(e) => {
                                    const categoryId = Number(e.target.value);
                                    expenseStore.q_category_id = categoryId; // store category id
                                    const categoryName = expenseCategories.find(cat => cat.value === categoryId)?.label;
                                    if (categoryName) {
                                        expenseStore.q_category = categoryName; // Store the category name
                                        fetchData(1, expenseStore.limit, expenseStore.q_title, categoryName);
                                    } else {
                                        // If no category is selected, pass an empty string as the category name
                                        fetchData(1, expenseStore.limit, expenseStore.q_title, "");
                                    }
                                }}
                            >
                                <option value="">select category</option>
                                {(expenseCategories || []).map((expenseCategory) => (
                                    <option key={expenseCategory.value} value={expenseCategory.value}>
                                        {expenseCategory.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">From</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => {
                                        expenseStore.q_start_date = e.target.value;
                                        fetchData(1);
                                    }}
                                    value={expenseStore.q_start_date}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">To</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => {
                                        expenseStore.q_end_date = e.target.value;
                                        fetchData(1);
                                    }}
                                    value={expenseStore.q_end_date}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Min Amount</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    onInput={(e) => {
                                        expenseStore.q_start_amount = e.target.value;
                                        fetchData(1);
                                    }}
                                    value={expenseStore.q_start_amount}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Max Amount</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    onInput={(e) => {
                                        expenseStore.q_end_amount = e.target.value;
                                        fetchData(1);
                                    }}
                                    value={expenseStore.q_end_amount}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Sort By</span>
                                <select
                                    className="form-select"
                                    value={expenseStore.q_sort_column}
                                    onChange={(e) => {
                                        expenseStore.q_sort_column = e.target.value;
                                        fetchData(1);
                                    }}
                                >
                                    <option value="id">Default</option>
                                    <option value="entry_date">Date</option>
                                    <option value="amount">Amount</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">order</span>
                                <select
                                    className="form-select"
                                    value={expenseStore.q_sort_order}
                                    onChange={(e) => {
                                        expenseStore.q_sort_order = e.target.value;
                                        fetchData(1);
                                    }}
                                >
                                    <option value="desc">desc</option>
                                    <option value="asc">asc</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && <Loader />}
            {!loading && (
                <div className="table-responsive bg-white shadow-sm">
                    <table className="table mb-0 table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={select_all}
                                    checked={all_selected}
                                />
                                </th>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th className="table-action-col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(expenses || []).map((expense) => (
                                <tr key={expense.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            // Check the checkbox if the current expense's id is in the selected_expenses array
                                            checked={selected_expenses.includes(expense.id)}
                                            onChange={(e) => {
                                                // If the checkbox is checked
                                                if (e.target.checked) {
                                                    // Add the current expense's id to the selected_expenses array
                                                    setSelectedExpenses([...selected_expenses, expense.id]);
                                                } else {
                                                    // If the checkbox is not checked, remove the current expense's id from the selected_expenses array
                                                    setSelectedExpenses(selected_expenses.filter((id) => id !== expense.id));
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="min150 max150">{expense.title}</td>
                                    <td className="min100 max100">{expense.amount}</td>
                                    <td className="min200 max200">{expense.category}</td>
                                    <td className="min100 max100">{expense.entry_date}</td>
                                    <td className="table-action-btns">
                                        <ViewIcon color="#00CFDD" onClick={() => openViewExpenseModal(expense.id)} />
                                        <EditIcon color="#739EF1" onClick={() => openEditExpenseModal(expense.id)} />
                                        <BinIcon color="#FF7474" onClick={() => deleteData(expense.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loading && expenses.length > 0 && (
                <Pagination
                    total_pages={expenseStore.total_pages}
                    current_page={expenseStore.current_page}
                    per_page={expenseStore.limit}
                    pageChange={(currentPage) => fetchData(currentPage, expenseStore.limit)}
                    perPageChange={(perpage) => fetchData(1, perpage)}
                />
            )}
            <div className="modals-container">
                {showAddExpense && (
                    <AddExpense
                        categories={expenseCategories}
                        onClose={() => setShowAddExpense(false)}
                        refreshData={() => fetchData(1)}
                    />
                )}
                {showEditExpense && (
                    <EditExpense
                        expense_id={expenseStore.edit_expense_id}
                        categories={expenseCategories}
                        onClose={() => setShowEditExpense(false)}
                        refreshData={() => fetchData(expenseStore.current_page)}
                    />
                )}
                {showViewExpense && (
                    <ViewExpense
                        expense_id={expenseStore.view_expense_id}
                        onClose={() => setShowViewExpense(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Expense;
