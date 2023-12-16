import { useEffect, useState } from "react";
import Loader from "../../shared/loader/Loader.jsx";
import Pagination from "../../shared/pagination/Pagination.jsx";
import { useConfirmStore } from "../../shared/confirm-alert/confirmStore.js";
import { useIncomeCategoryStore } from "./incomeCategoryStore";
import BinIcon from "../../../assets/icons/binicon.jsx";
import EditIcon from "../../../assets/icons/editicon.jsx";
import ViewIcon from "../../../assets/icons/viewicon.jsx";
import AddNewButton from "../../buttons/AddNewButton.jsx";
import FilterButton from "../../buttons/FilterButton";
import BulkDeleteButton from "../../buttons/BulkDeleteButton";
import AddIncomeCat from "./AddIncomeCat";
import EditIncomeCat from "./EditIncomeCat";
import ViewIncomeCat from "./ViewIncomeCat";

const IncomeCategories = () => {
    const [loading, setLoading] = useState(false);
    const [filterTab, setFilterTab] = useState(true);
    const [showAddIncomeCat, setShowAddIncomeCat] = useState(false);
    const [showEditIncomeCat, setShowEditIncomeCat] = useState(false);
    const [showViewIncomeCat, setShowViewIncomeCat] = useState(false);

    const confirmStore = useConfirmStore();
    const incomeCategoryStore = useIncomeCategoryStore();
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [qName, setQName] = useState("");
    const [selectedIncomeCats, setSelectedIncomeCats] = useState([]);
    const [allSelected, setAllSelected] = useState(false);

    const selectAll = () => {
        if (allSelected === false) {
            setSelectedIncomeCats(
                incomeCategoryStore.income_categories.map((element) => element.id)
            );
            setAllSelected(true);
        } else {
            setAllSelected(false);
            setSelectedIncomeCats([]);
        }
    };

    const deleteData = (id) => {
        confirmStore.show_box({
            message: "Do you want to delete selected income category?",
        }).then(() => {
            if (confirmStore.do_action === true) {
                incomeCategoryStore.deleteIncomeCat(id).then(() => {
                    incomeCategoryStore.fetchIncomeCats(
                        incomeCategoryStore.current_page,
                        incomeCategoryStore.limit,
                        incomeCategoryStore.q_name
                    );

                    if (Array.isArray(id)) {
                        setAllSelected(false);
                        setSelectedIncomeCats([]);
                    }
                });
            }
        });
    };

    const openEditIncomeCatModal = (id) => {
        incomeCategoryStore.edit_income_category_id = id;
        setShowEditIncomeCat(true);
    };

    const openViewIncomeCatModal = (id) => {
        incomeCategoryStore.view_income_category_id = id;
        setShowViewIncomeCat(true);
    };

    const fetchData = async (
        page = incomeCategoryStore.current_page,
        limit = incomeCategoryStore.limit,
        q_name = incomeCategoryStore.q_name
    ) => {
        setLoading(true);

        setAllSelected(false);
        setSelectedIncomeCats([]);

        try {
            incomeCategoryStore.fetchIncomeCats(page, limit, q_name).then((response) => {
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
                <h3 className="h3">Income Category List</h3>
                <div className="page-heading-actions ms-auto">
                    {selectedIncomeCats.length > 0 && (
                        <BulkDeleteButton onClick={() => deleteData(selectedIncomeCats)} />
                    )}
                    <AddNewButton onClick={() => setShowAddIncomeCat(true)} />
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
                            value={qName}
                            onChange={(e) => {
                                setQName(e.target.value);
                                fetchData(1, incomeCategoryStore.limit, e.target.value);
                            }}
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
                                    onClick={selectAll}
                                    checked={allSelected}
                                />
                            </th>
                            <th>Name</th>
                            <th className="table-action-col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomeCategories.map((income_cat) => (
                            <tr key={income_cat.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedIncomeCats.includes(income_cat.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedIncomeCats([...selectedIncomeCats, income_cat.id]);
                                            } else {
                                                setSelectedIncomeCats(selectedIncomeCats.filter((id) => id !== income_cat.id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className="min150 max150">{income_cat.name}</td>
                                <td className="table-action-btns">
                                    <ViewIcon
                                        color="#00CFDD"
                                        onClick={() => openViewIncomeCatModal(income_cat.id)}
                                    />
                                    <EditIcon
                                        color="#739EF1"
                                        onClick={() => openEditIncomeCatModal(income_cat.id)}
                                    />
                                    <BinIcon
                                        color="#FF7474"
                                        onClick={() => deleteData(income_cat.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                style={{ display: loading ? "none" : "block" }}
                total_pages={incomeCategoryStore.total_pages}
                current_page={incomeCategoryStore.current_page}
                per_page={incomeCategoryStore.limit}
                onPageChange={(currentPage) => fetchData(currentPage, incomeCategoryStore.limit)}
                onPerPageChange={(perpage) => fetchData(1, perpage)}
            />
            <div className="modals-container">
                {showAddIncomeCat && (
                    <AddIncomeCat
                        onClose={() => setShowAddIncomeCat(false)}
                        onRefreshData={() => fetchData(1)}
                    />
                )}
                {showEditIncomeCat && (
                    <EditIncomeCat
                        income_category_id={incomeCategoryStore.edit_income_category_id}
                        onClose={() => setShowEditIncomeCat(false)}
                        onRefreshData={() => fetchData(incomeCategoryStore.current_page)}
                    />
                )}
                {showViewIncomeCat && (
                    <ViewIncomeCat
                        income_category_id={incomeCategoryStore.view_income_category_id}
                        onClose={() => setShowViewIncomeCat(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default IncomeCategories;
