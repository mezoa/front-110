import { useState, useEffect } from "react";
import CrossSvgIcon from "../../assets/icons/cross-svg-icon";
import Loader from "../../components/shared/loader/Loader";
import { useIncomeCategoryStore } from "./incomeCategoryStore";

const EditIncomeCat = ({ income_category_id }) => {
    const [loading, setLoading] = useState(false);
    const incomeCategoryStore = useIncomeCategoryStore();
    const [income_category_data, setIncomeCategoryData] = useState(
        incomeCategoryStore.current_income_category_item
    );

    const submitData = async () => {
        try {
            await incomeCategoryStore.editIncomeCat(
                JSON.parse(JSON.stringify(income_category_data))
            );
            emit("refreshData");
            emit("close");
        } catch (error) {
            console.log("error occurred" + error);
        }
    };

    const fetchData = async (id) => {
        setLoading(true);
        await incomeCategoryStore.fetchIncomeCat(id);
        setLoading(false);
    };

    const closeEditIncomeModal = () => {
        incomeCategoryStore.resetCurrentIncomeCatData();
        emit("close");
    };

    useEffect(() => {
        fetchData(income_category_id);
    }, [income_category_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Income</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={closeEditIncomeModal}
                        >
                            <CrossSvgIcon />
                        </button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="form-items">
                                <form action="">
                                    <div className="form-item">
                                        <label className="my-2">
                                            Income Category Name
                                        </label>
                                        {incomeCategoryStore.edit_income_category_errors.name && (
                                            <p className="text-danger">
                                                {incomeCategoryStore.edit_income_category_errors.name}
                                            </p>
                                        )}
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={income_category_data.name}
                                            onChange={(e) =>
                                                setIncomeCategoryData({
                                                    ...income_category_data,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={closeEditIncomeModal}
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

export default EditIncomeCat;
