import React from "react";
import { useNavigate } from "react-router-dom";
import SideNavLink from "./SideNavLink";
import CrossIcon from "../../assets/icons/crossicon";
import { useSidebar } from "../stores/sidebar";
//import '../../assets/css/app.css';
import './Sidebar.css';
import iptracker from "../../assets/img/iptracker.png";

const Sidebar = () => {
    const sidebarStore = useSidebar();
    const navigate = useNavigate();

    const navlinks = [
        {
            label: "dashboard",
            link: "/dashboard",
            icon_name: "dashboard",
        },
        {
            label: "income",
            link: "/incomes",
            icon_name: "wallet",
            sub_links: [
                {
                    label: "income list",
                    link: "/incomes",
                },
                {
                    label: "income categories",
                    link: "/income-categories",
                },
            ],
        },
        {
            label: "expense",
            link: "/expenses",
            icon_name: "bankcard",
            sub_links: [
                {
                    label: "expense list",
                    link: "/expenses",
                },
                {
                    label: "expense categories",
                    link: "/expense-categories",
                },
            ],
        },
        {
            label: "site visitors",
            link: "/visitors",
            icon_name: "customer",
        },
        {
            label: "pages",
            link: "/pages",
            icon_name: "pages",
        },
    ];

    return (
        <div id="sidebar" className={sidebarStore.open ? "active" : ""}>
            <div className="sidebar-wrapper active">
                <div className="sidebar-header d-flex">
                    <div>
                        <img
                            src={iptracker}
                            className="cursor-pointer img-fluid"
                            onClick={() => navigate("/admin")}
                            alt="EXP/IP TRACKER"
                        />
                    </div>
                    <div className="small-screen-menu-icon ms-3">
                        <CrossIcon
                            width="25px"
                            height="25px"
                            onClick={() => sidebarStore.open = !sidebarStore.open} // toggle the open state
                        />
                    </div>
                </div>
                <div className="sidebar-menu">
                    <ul className="menu">
                        {navlinks.map((link) => (
                            <SideNavLink key={link.link} link_details={link} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
