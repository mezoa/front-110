import React, { useState, useEffect } from "react";
import Loader from "../../shared/loader/Loader";
import Pagination from "../../shared/pagination/Pagination";
import { useConfirmStore } from "../../shared/confirm-alert/confirmStore";
import { useIncomeStore } from "./incomeStore";
import { useIncomeCategoryStore } from "../income-category/incomeCategoryStore";
import BinIcon from "../../../assets/icons/binicon";
import EditIcon from "../../../assets/icons/editicon";
import ViewIcon from "../../../assets/icons/viewicon";
import AddNewButton from "../../buttons/AddNewButton";
import FilterButton from "../../buttons/FilterButton";
import BulkDeleteButton from "../../buttons/BulkDeleteButton";
import AddIncome from "./AddIncome";
import EditIncome from "./EditIncome";
import ViewIncome from "./ViewIncome";

const Incomes = () => {
    const [loading, setLoading] = useState(false);
    const [filterTab, setFilterTab] = useState(true);
    const [showAddIncome, setShowAddIncome] = useState(false);
    const [showEditIncome, setShowEditIncome] = useState(false);
    const [showViewIncome, setShowViewIncome] = useState(false);

    let incomeStore = useIncomeStore();
    const confirmStore = useConfirmStore();
    const incomes = incomeStore.incomes;
    const incomeCategoryStore = useIncomeCategoryStore();
    let incomeCategories = [];

    const q_title = "";
    let selected_incomes = [];
    let all_selectd = false;

    const select_all = () => {
        if (all_selectd === false) {
            selected_incomes = [];
            incomeStore.incomes.forEach((element) => {
                selected_incomes.push(element.id);
            });
            all_selectd = true;
        } else {
            all_selectd = false;
            selected_incomes = [];
        }
    };

    const deleteData = async (id) => {
        confirmStore.show_box({ message: "Do you want to delete selected income?" }).then(async () => {
            if (confirmStore.do_action === true) {
                incomeStore.deleteIncome(id).then(() => {
                    incomeStore.fetchIncomes(incomeStore.current_page, incomeStore.limit, incomeStore.q_title);

                    if (Array.isArray(id)) {
                        all_selectd = false;
                        selected_incomes = [];
                    }
                });
            }
        });
    };

    const openEditIncomeModal = (id) => {
        incomeStore.edit_income_id = id;
        setShowEditIncome(true);
    };

    const openViewIncomeModal = (id) => {
        incomeStore.view_income_id = id;
        setShowViewIncome(true);
    };

    const fetchData = async (page = incomeStore.current_page, limit = incomeStore.limit, q_title = incomeStore.q_title) => {
        setLoading(true);

        all_selectd = false;
        selected_incomes = [];

        try {
            incomeStore.fetchIncomes(page, limit, q_title).then((response) => {
                setLoading(false);
            });
        } catch (error) {
            // console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
        incomeCategoryStore.fetchCatList().then((response) => {
            incomeCategories = response;
        });
    }, []);

    return (
        <div>
            <div className="page-top-box mb-2 d-flex flex-wrap">
                <h3 className="h3">Income List</h3>
                <div className="page-heading-actions ms-auto">
                    {selected_incomes.length > 0 && <BulkDeleteButton onClick={() => deleteData(selected_incomes)} />}
                    <AddNewButton onClick={() => setShowAddIncome(true)} />
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
                                onChange={(e) => fetchData(1, incomeStore.limit, e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <select
                                className="form-select"
                                value={incomeStore.q_category}
                                onChange={(e) => fetchData(1)}
                            >
                                <option value="">select category</option>
                                {(incomeCategories || []).map((incomeCategory) => (
                                    <option key={incomeCategory.value} value={incomeCategory.value}>
                                        {incomeCategory.label}
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
                                    onChange={(e) => fetchData(1)}
                                    value={incomeStore.q_start_date}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">To</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => fetchData(1)}
                                    value={incomeStore.q_end_date}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Min Amount</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    onInput={(e) => fetchData(1)}
                                    value={incomeStore.q_start_amount}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Max Amount</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    onInput={(e) => fetchData(1)}
                                    value={incomeStore.q_end_amount}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Sort By</span>
                                <select
                                    className="form-select"
                                    value={incomeStore.q_sort_column}
                                    onChange={(e) => fetchData(1)}
                                >
                                    <option value="id">Default</option>
                                    <option value="date">Date</option>
                                    <option value="amount">Amount</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">order</span>
                                <select
                                    className="form-select"
                                    value={incomeStore.q_sort_order}
                                    onChange={(e) => fetchData(1)}
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
                                        onClick={select_all}
                                        defaultChecked={all_selectd}
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
                                {(incomes || []).map((income) => (
                                    <tr key={income.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                defaultChecked={false}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        selected_incomes.push(income.id);
                                                    } else {
                                                        const index = selected_incomes.indexOf(income.id);
                                                        if (index > -1) {
                                                            selected_incomes.splice(index, 1);
                                                        }
                                                    }
                                                }}
                                                value={income.id}
                                            />
                                        </td>
                                        <td className="min150 max150">{income.title}</td>
                                        <td className="min100 max100">{income.amount}</td>
                                        <td className="min200 max200">
                                            {(income.categories || []).map((income_cat) => (
                                                <span
                                                    key={income_cat.value}
                                                    className="badge bg-primary m-1 px-2 shadow-sm py-1"
                                                >
                                                    {income_cat.label}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="min100 max100">{income.date}</td>
                                        <td className="table-action-btns">
                                            <ViewIcon
                                                color="#00CFDD"
                                                onClick={() => openViewIncomeModal(income.id)}
                                            />
                                            <EditIcon
                                                color="#739EF1"
                                                onClick={() => openEditIncomeModal(income.id)}
                                            />
                                            <BinIcon color="#FF7474" onClick={() => deleteData(income.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                </div>
            )}
            {!loading && (incomes || []).length > 0 && (
                <Pagination
                    total_pages={incomeStore.total_pages}
                    current_page={incomeStore.current_page}
                    per_page={incomeStore.limit}
                    pageChange={(currentPage) => fetchData(currentPage, incomeStore.limit)}
                    perPageChange={(perpage) => fetchData(1, perpage)}
                />
            )}
            <div className="modals-container">
                {showAddIncome && (
                    <AddIncome
                        categories={incomeCategories}
                        close={() => setShowAddIncome(false)}
                        refreshData={() => fetchData(1)}
                    />
                )}
                {showEditIncome && (
                    <EditIncome
                        income_id={incomeStore.edit_income_id}
                        categories={incomeCategories}
                        close={() => setShowEditIncome(false)}
                        refreshData={() => fetchData(incomeStore.current_page)}
                    />
                )}
                {showViewIncome && (
                    <ViewIncome
                        income_id={incomeStore.view_income_id}
                        close={() => setShowViewIncome(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Incomes;
