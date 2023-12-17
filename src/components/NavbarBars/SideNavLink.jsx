import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../stores/sidebar";
import Dashboard from '../../assets/icons/dashboard';
import Wallet from '../../assets/icons/wallet';
import Bankcard from '../../assets/icons/bankcard';
import Customer from '../../assets/icons/customer';

const SideNavLink = ({ link_details }) => {
    const sidebarStore = useSidebar();

    const [show_sublinks, setShowSublinks] = useState(false);
    const [sublinks, setSublinks] = useState([]);

    const iconComponents = {
        dashboard: Dashboard,
        wallet: Wallet,
        bankcard: Bankcard,
        customer: Customer
    };

    const Icon = link_details.icon_name ? iconComponents[link_details.icon_name.toLowerCase()] : null;

    const handleNavlinkClick = () => {
        if (window.innerWidth <= 767) {
          sidebarStore.toggle();
        }
    };

    useEffect(() => {
        setSublinks(link_details.sub_links?.map((obj) => obj.link) || []);
    }, [link_details.sub_links]);

    return (
    <div>
        {!link_details.sub_links && (
            <li
                className={`sidebar-item custom-sidebar-item ${
                    window.location.pathname === link_details.link ? "active custom-active" : ""
                }`}
            >
                <Link
                    onClick={handleNavlinkClick}
                    className="sidebar-link custom-sidebar-link"
                    to={link_details.link}
                >
                    {Icon && <Icon />}
                    <span>{link_details.label}</span>
                </Link>
            </li>
        )}

        {link_details.sub_links && (
            <li
                className={`sidebar-item has-sub custom-sidebar-item ${
                    sublinks.includes(window.location.pathname) ? "active custom-active" : ""
                }`}
            >
                <span
                    href="#"
                    className="sidebar-link custom-sidebar-link"
                    onClick={() => setShowSublinks(!show_sublinks)}
                >
                    {Icon && <Icon />}
                    <span>{link_details.label}</span>
                </span>
                <ul className={`submenu custom-submenu ${show_sublinks ? "active custom-active" : ""}`}>
                    {link_details.sub_links.map((slink) => (
                        <div key={slink.link}>
                            <Link
                                onClick={handleNavlinkClick}
                                className={`sidebar-sublink custom-sidebar-sublink ${
                                    window.location.pathname === slink.link ? "active custom-active" : ""
                                }`}
                                to={slink.link}
                            >
                                <span>{slink.label}</span>
                            </Link>
                        </div>
                    ))}
                </ul>
            </li>
        )}
    </div>
);
};

export default SideNavLink;
