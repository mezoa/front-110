import BinSvg from "../../assets/icons/bin-svg-icon.vue";

function BulkDeleteButton() {
    return (
        <button className="btn btn-sm btn-danger m-1 shadow">
            <BinSvg color="currentColor" />
            <span className="ms-1 d-600-none">Delete Selected</span>
        </button>
    );
}

export default BulkDeleteButton;
