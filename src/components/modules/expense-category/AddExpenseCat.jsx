import { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import { useExpenseCategoryStore } from "./expenseCategoryStore";

const AddExpenseCat = () => {
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
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred");
        }
    };

    const closeAddExpenseCatModal = () => {
        expenseCategoryStore.resetCurrentExpenseCatData();
        emit("close");
    };

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Expense Category</h5>
                        <button type="button" className="close">
                            <CrossIcon onClick={closeAddExpenseCatModal} />
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
