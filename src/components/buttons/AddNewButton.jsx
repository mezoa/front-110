import PlusIcon from "../../assets/icons/plusicon";

function AddNewButton() {
    return (
        <button className="btn btn-sm btn-primary m-1">
            <PlusIcon color="white" />
            <span className="ms-1 d-600-none">Add New</span>
        </button>
    );
}

export default AddNewButton;
