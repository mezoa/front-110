import { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import { useExpenseCategoryStore } from "./expenseCategoryStore";

const AddExpenseCat = ({onClose, onRefreshData}) => {
    const [expenseCategoryData, setExpenseCategoryData] = useState({});
    const expenseCategoryStore = useExpenseCategoryStore();

    useEffect(() => {
        expenseCategoryStore.resetCurrentExpenseCatData();
    }, []);

    const submitData = async () => {
        try {
            await expenseCategoryStore.addExpenseCat(
                JSON.parse(JSON.stringify(expenseCategoryData))
            );
            onRefreshData();
            onClose();
        } catch (error) {
            console.log("error occurred, error: ", error); // log the error
        }
    };

    const closeAddExpenseCatModal = () => {
        expenseCategoryStore.resetCurrentExpenseCatData();
        onClose();
    };

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Expense Category</h5>
                        <button type="button" className="close" onClick={closeAddExpenseCatModal}>
                            <CrossIcon  />
                        </button>
                    </div>

                    <div className="modal-body">
                        <form action="">
                            <div className="form-item">
                                <label className="my-2">Expense Category Name</label>
                                <p className="text-danger">
                                    {expenseCategoryStore.add_expense_category_errors.name}
                                </p>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={expenseCategoryData.name}
                                    onChange={(e) =>
                                        setExpenseCategoryData({
                                            ...expenseCategoryData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={closeAddExpenseCatModal}
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

export default AddExpenseCat;
