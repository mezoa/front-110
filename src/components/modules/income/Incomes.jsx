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
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [incomes, setIncomes] = useState([]);

    let incomeStore = useIncomeStore();
    const confirmStore = useConfirmStore();
    const incomeCategoryStore = useIncomeCategoryStore();

    const [q_title, setQTitle] = useState([]);
    const [q_start_date, setQStartDate] = useState([]);
    const [q_end_date, setQEndDate] = useState([]);
    const [categoryLabel, setCategoryLabel] = useState('');
    
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

    const fetchData = async (page = 1, limit = incomeStore.limit, title = q_title, category = incomeStore.q_category, startDate = q_start_date, endDate = q_end_date) => {
        setLoading(true);
        all_selectd = false;
        selected_incomes = [];
    
        try {
            const response = await incomeStore.fetchIncomes(
                page,
                limit,
                title,
                category,
                startDate,
                endDate,
                incomeStore.q_start_amount,
                incomeStore.q_end_amount,
                incomeStore.q_sort_column,
                incomeStore.q_sort_order
            );
    
            setLoading(false);
            setIncomes(response);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };
    
      

    useEffect(() => {
        fetchData(1);
        incomeCategoryStore.fetchCatList().then((response) => {
            const mappedResponse = response.map(category => ({
                value: category.category_id,
                label: category.name
            }));
            setIncomeCategories(mappedResponse);
        });
    }, [incomeStore.q_title, incomeStore.q_category]);

    
    // Call fetchData whenever a filter value changes
    useEffect(() => {
        fetchData();
    }, [incomeStore.q_title, incomeStore.q_category]); // Add more dependencies as needed
    
    console.log("incomecategories", incomeCategories)
    return (
        <div>
            <div className="page-top-box mb-2 d-flex flex-wrap">
                <h3 className="h3">Income List</h3>
                <div className="page-heading-actions ms-auto">
                    {selected_incomes.length > 0 && <BulkDeleteButton onClick={() => deleteData(selected_incomes)} />}
                    <AddNewButton onClick={() => { console.log('Button clicked'); setShowAddIncome(true); }}  />
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
                            value={incomeStore.q_title}
                            onChange={(e) => {
                                const title = e.target.value;
                                incomeStore.q_title = title;
                                fetchData(1, incomeStore.limit, title);
                            }}
                        />
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <select
                                className="form-select"
                                value={incomeStore.q_category}
                                onChange={(e) => {
                                    const categoryId = Number(e.target.value);
                                    const categoryName = incomeCategories.find(cat => cat.value === categoryId)?.label;
                                    if (categoryName) {
                                        incomeStore.q_category = categoryName; // Store the category name instead of the id
                                        fetchData(1, incomeStore.limit, incomeStore.q_title, categoryName);
                                    } else {
                                        // If no category is selected, pass an empty string as the category name
                                        fetchData(1, incomeStore.limit, incomeStore.q_title, "");
                                    }
                                }}
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
                                    onChange={(e) => {
                                        const startDate = e.target.value;
                                        setQStartDate(startDate);
                                        fetchData(1, incomeStore.limit, q_title, incomeStore.q_category, startDate);
                                    }}
                                    value={q_start_date}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">To</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => setQEndDate(e.target.value)}
                                    value={q_end_date}
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
                                    onChange={(e) => {
                                        incomeStore.q_sort_column = e.target.value;
                                        fetchData(1);
                                    }}
                                >
                                    <option value="id">Default</option>
                                    <option value="date">Date</option>
                                    <option value="amount">Amount</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6 my-1">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Order</span>
                                <select
                                    className="form-select"
                                    value={incomeStore.q_sort_order}
                                    onChange={(e) => {
                                        incomeStore.q_sort_order = e.target.value;
                                        fetchData(1);
                                    }}
                                >
                                    <option value="desc">Desc</option>
                                    <option value="asc">Asc</option>
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
                                    <tr key={income.income_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                defaultChecked={false}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        selected_incomes.push(income.income_id);
                                                    } else {
                                                        const index = selected_incomes.indexOf(income.income_id);
                                                        if (index > -1) {
                                                            selected_incomes.splice(index, 1);
                                                        }
                                                    }
                                                }}
                                                value={income.income_id}
                                            />
                                        </td>
                                        <td className="min150 max150">{income.title}</td>
                                        <td className="min100 max100">{income.amount}</td>
                                        <td className="min200 max200">{income.category}</td>
                                        <td className="min100 max100">{new Date(income.date).toLocaleDateString()}</td>
                                        <td className="table-action-btns">
                                            <ViewIcon
                                                color="#00CFDD"
                                                onClick={() => openViewIncomeModal(income.income_id)}
                                            />
                                            <EditIcon
                                                color="#739EF1"
                                                onClick={() => openEditIncomeModal(income.income_id)}
                                            />
                                            <BinIcon color="#FF7474" onClick={() => deleteData(income.income_id)} />
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
