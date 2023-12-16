import React from "react";
import SideNavLink from "../components/SideNavLink";
import CrossIcon from "../../assets/icons/crossicon";
import { useSidebar } from "../stores/sidebar";

const Sidebar = () => {
    const sidebarStore = useSidebar();

    const navlinks = [
        {
            label: "dashboard",
            link: "/admin",
            icon_name: "dashboard-svg-icon",
        },
        {
            label: "income",
            link: "/admin/incomes",
            icon_name: "wallet-svg-icon",
            sub_links: [
                {
                    label: "income list",
                    link: "/admin/incomes",
                },
                {
                    label: "income categories",
                    link: "/admin/income-categories",
                },
            ],
        },
        {
            label: "expense",
            link: "/admin/expenses",
            icon_name: "bank-card-svg-icon",
            sub_links: [
                {
                    label: "expense list",
                    link: "/admin/expenses",
                },
                {
                    label: "expense categories",
                    link: "/admin/expense-categories",
                },
            ],
        },
        {
            label: "site visitors",
            link: "/admin/visitors",
            icon_name: "customer-svg-icon",
        },
    ];

    return (
        <div id="sidebar" className={sidebarStore.open ? "active" : ""}>
            <div className="sidebar-wrapper active">
                <div className="sidebar-header d-flex">
                    <div>
                        <img
                            src="../assets/img/finnaf-logo.png"
                            className="cursor-pointer img-fluid"
                            onClick={() => this.$router.push({ name: "dashboard" })}
                        />
                    </div>
                    <div className="small-screen-menu-icon ms-3">
                        <CrossIcon
                            width="25px"
                            height="25px"
                            onClick={sidebarStore.toggle}
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
