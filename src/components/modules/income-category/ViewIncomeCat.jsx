import { useState, useEffect } from "react";
import CrossIcon from "../../../assets/icons/crossicon";
import Loader from "../../shared/loader/Loader"
import { useIncomeCategoryStore } from "./incomeCategoryStore";

const ViewIncomeCat = ({ income_category_id }) => {
    const [loading, setLoading] = useState(false);
    const incomeCategoryStore = useIncomeCategoryStore();
    const [income_category_data, setIncomeCategoryData] = useState({});

    const fetchData = async (id) => {
        setLoading(true);
        await incomeCategoryStore.fetchIncomeCat(id);
        setLoading(false);
    };

    const closeEditIncomeModal = () => {
        incomeCategoryStore.resetCurrentIncomeCatData();
        // emit("close");
    };

    useEffect(() => {
        fetchData(income_category_id);
    }, [income_category_id]);

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Income Category Details</h5>
                        <button type="button" className="close">
                            <CrossIcon onClick={closeEditIncomeModal} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="form-items">
                                <form action="">
                                    <div className="form-item">
                                        <label className="my-2">Category Name</label>
                                        <input
                                            disabled
                                            type="text"
                                            className="form-control"
                                            value={income_category_data.name}
                                        />
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewIncomeCat;
