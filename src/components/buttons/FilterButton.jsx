import React from "react";
import FilterIcon from "../../assets/icons/filtericon";

const FilterButton = () => {
    return (
        <button className="btn btn-sm btn-outline-info m-1">
            <FilterIcon color="currentColor" />
            <span className="ms-1 d-600-none">Filter</span>
        </button>
    );
};

export default FilterButton;
