import { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import { useIncomeCategoryStore } from "./incomeCategoryStore";

const AddIncomeCat = ({ onRefreshData, onClose }) => {
    const [incomeCategoryData, setIncomeCategoryData] = useState({});
    const incomeCategoryStore = useIncomeCategoryStore();

    useEffect(() => {
        incomeCategoryStore.resetCurrentIncomeCatData();
    }, []);

    const submitData = async () => {
        try {
            await incomeCategoryStore.addIncomeCat(
                JSON.parse(JSON.stringify(incomeCategoryData))
            );
            onRefreshData();
            onclose();
        } catch (error) {
            console.log("error occurred");
        }
    };

    const closeAddIncomeCatModal = () => {
        incomeCategoryStore.resetCurrentIncomeCatData();
        onClose();
    };

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Income Category</h5>
                        <button type="button" className="close" onClick={closeAddIncomeCatModal}>
                            <CrossIcon  />
                        </button>
                    </div>

                    <div className="modal-body">
                        <form action="">
                            <div className="form-item">
                                <label className="my-2">Income Category Name</label>
                                <p className="text-danger">
                                    { incomeCategoryStore.add_income_category_errors && incomeCategoryStore.add_income_category_errors.name}
                                </p>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={incomeCategoryData.name}
                                    onChange={(e) =>
                                        setIncomeCategoryData({
                                            ...incomeCategoryData,
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
                            onClick={closeAddIncomeCatModal}
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

export default AddIncomeCat;
