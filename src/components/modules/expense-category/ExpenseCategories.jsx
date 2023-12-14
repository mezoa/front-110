import { useState, useEffect } from "react";
import Loader from '../../shared/loader/Loader.jsx'
import Pagination from "../../shared/pagination/Pagination";
import { useConfirmStore } from "../../shared/confirm-alert/confirmStore.js";
import { useExpenseCategoryStore } from "./expenseCategoryStore";
import BinIcon from "../../../assets/icons/binicon.jsx";
import EditSvgIcon from "../../assets/icons/edit-svg-icon";
import ViewSvgIcon from "../../assets/icons/view-svg-icon";
import AddNewButton from "../../components/buttons/AddNewButton";
import FilterButton from "../../components/buttons/FilterButton";
import BulkDeleteButton from "../../components/buttons/BulkDeleteButton";
import AddExpenseCat from "./AddExpenseCat";
import EditExpenseCat from "./EditExpenseCat";
import ViewExpenseCat from "./ViewExpenseCat";

const ExpenseCategories = () => {
    const [loading, setLoading] = useState(false);
    const [filterTab, setFilterTab] = useState(true);
    const [showAddExpenseCat, setShowAddExpenseCat] = useState(false);
    const [showEditExpenseCat, setShowEditExpenseCat] = useState(false);
    const [showViewExpenseCat, setShowViewExpenseCat] = useState(false);

    const confirmStore = useConfirmStore();
    const expenseCategoryStore = useExpenseCategoryStore();
    const [expense_categories, setExpenseCategories] = useState([]);
    const [q_name, setQName] = useState("");
    const [selected_expense_cats, setSelectedExpenseCats] = useState([]);
    const [all_selectd, setAllSelectd] = useState(false);

    const select_all = () => {
        if (all_selectd === false) {
            setSelectedExpenseCats(
                expenseCategoryStore.expense_categories.map((element) => element.id)
            );
            setAllSelectd(true);
        } else {
            setAllSelectd(false);
            setSelectedExpenseCats([]);
        }
    };

    const deleteData = (id) => {
        confirmStore.show_box({
            message: "Do you want to delete selected expense category?",
        }).then(() => {
            if (confirmStore.do_action === true) {
                expenseCategoryStore.deleteExpenseCat(id).then(() => {
                    expenseCategoryStore.fetchExpenseCats(
                        expenseCategoryStore.current_page,
                        expenseCategoryStore.limit,
                        expenseCategoryStore.q_name
                    );

                    if (Array.isArray(id)) {
                        setAllSelectd(false);
                        setSelectedExpenseCats([]);
                    }
                });
            }
        });
    };

    const openEditExpenseCatModal = (id) => {
        expenseCategoryStore.edit_expense_category_id = id;
        setShowEditExpenseCat(true);
    };

    const openViewExpenseCatModal = (id) => {
        expenseCategoryStore.view_expense_category_id = id;
        setShowViewExpenseCat(true);
    };

    const fetchData = async (
        page = expenseCategoryStore.current_page,
        limit = expenseCategoryStore.limit,
        q_name = expenseCategoryStore.q_name
    ) => {
        setLoading(true);

        setAllSelectd(false);
        setSelectedExpenseCats([]);

        try {
            expenseCategoryStore.fetchExpenseCats(page, limit, q_name).then((response) => {
                setLoading(false);
            });
        } catch (error) {
            // console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    return (
        <div>
            <div className="page-top-box mb-2 d-flex flex-wrap">
                <h3 className="h3">Expense Category List</h3>
                <div className="page-heading-actions ms-auto">
                    {selected_expense_cats.length > 0 && (
                        <BulkDeleteButton onClick={() => deleteData(selected_expense_cats)} />
                    )}
                    <AddNewButton onClick={() => setShowAddExpenseCat(true)} />
                    <FilterButton onClick={() => setFilterTab(!filterTab)} />
                </div>
            </div>
            <div className="p-1 my-2" style={{ display: filterTab ? "block" : "none" }}>
                <div className="row">
                    <div className="col-md-3 col-sm-6 my-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="type name.."
                            value={q_name}
                            onChange={(e) => setQName(e.target.value)}
                            onKeyUp={() => fetchData(1, expenseCategoryStore.limit, q_name)}
                        />
                    </div>
                </div>
            </div>

            {loading && <Loader />}
            <div className="table-responsive bg-white shadow-sm" style={{ display: loading ? "none" : "block" }}>
                <table className="table mb-0 table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    onClick={select_all}
                                    checked={all_selectd}
                                />
                            </th>
                            <th>Name</th>
                            <th className="table-action-col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense_categories.map((expense_cat) => (
                            <tr key={expense_cat.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selected_expense_cats.includes(expense_cat.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedExpenseCats([...selected_expense_cats, expense_cat.id]);
                                            } else {
                                                setSelectedExpenseCats(selected_expense_cats.filter((id) => id !== expense_cat.id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className="min150 max150">{expense_cat.name}</td>
                                <td className="table-action-btns">
                                    <ViewSvgIcon color="#00CFDD" onClick={() => openViewExpenseCatModal(expense_cat.id)} />
                                    <EditSvgIcon color="#739EF1" onClick={() => openEditExpenseCatModal(expense_cat.id)} />
                                    <BinIcon color="#FF7474" onClick={() => deleteData(expense_cat.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                style={{ display: loading ? "none" : "block" }}
                total_pages={expenseCategoryStore.total_pages}
                current_page={expenseCategoryStore.current_page}
                per_page={expenseCategoryStore.limit}
                onPageChange={(currentPage) => fetchData(currentPage, expenseCategoryStore.limit)}
                onPerPageChange={(perpage) => fetchData(1, perpage)}
            />
            <div className="modals-container">
                {showAddExpenseCat && (
                    <AddExpenseCat
                        onClose={() => setShowAddExpenseCat(false)}
                        onRefreshData={() => fetchData(1)}
                    />
                )}
                {showEditExpenseCat && (
                    <EditExpenseCat
                        expense_category_id={expenseCategoryStore.edit_expense_category_id}
                        onClose={() => setShowEditExpenseCat(false)}
                        onRefreshData={() => fetchData(expenseCategoryStore.current_page)}
                    />
                )}
                {showViewExpenseCat && (
                    <ViewExpenseCat
                        expense_category_id={expenseCategoryStore.view_expense_category_id}
                        onClose={() => setShowViewExpenseCat(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ExpenseCategories;
