import { useState, useEffect } from "react";
import CrossSvgIcon from "../../assets/icons/cross-svg-icon";
import { useIncomeCategoryStore } from "./incomeCategoryStore";

const AddIncomeCat = () => {
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
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred");
        }
    };

    const closeAddIncomeCatModal = () => {
        incomeCategoryStore.resetCurrentIncomeCatData();
        emit("close");
    };

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Income Category</h5>
                        <button type="button" className="close">
                            <CrossSvgIcon onClick={closeAddIncomeCatModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <form action="">
                            <div className="form-item">
                                <label className="my-2">Income Category Name</label>
                                <p className="text-danger">
                                    {incomeCategoryStore.add_income_category_errors.name}
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
