import React from "react";
import FilterSvg from "../../assets/icons/filter-svg-icon.vue";

const FilterButton = () => {
    return (
        <button className="btn btn-sm btn-outline-info m-1">
            <FilterSvg color="currentColor" />
            <span className="ms-1 d-600-none">Filter</span>
        </button>
    );
};

export default FilterButton;
