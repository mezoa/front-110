import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../stores/sidebar";
import Dashboard from '../../assets/icons/dashboard';
import Wallet from '../../assets/icons/wallet';
import Bankcard from '../../assets/icons/bankcard';
import Customer from '../../assets/icons/customer';

const iconComponents = {
  dashboard: Dashboard,
  wallet: Wallet,
  bankcard: Bankcard,
  customer: Customer,
  // Add other icons if needed
};

const SideNavLink = ({ link_details }) => {
    const sidebarStore = useSidebar();

    const [show_sublinks, setShowSublinks] = useState(false);
    const [sublinks, setSublinks] = useState([]);

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
                    className={`sidebar-item ${
                        window.location.pathname === link_details.link ? "active" : ""
                    }`}
                >
                    <Link
                        onClick={handleNavlinkClick}
                        className="sidebar-link"
                        to={link_details.link}
                    >
                        {Icon && <Icon />}
                        <span>{link_details.label}</span>
                    </Link>
                </li>
            )}

            {link_details.sub_links && (
                <li
                    className={`sidebar-item has-sub ${
                        sublinks.includes(window.location.pathname) ? "active" : ""
                    }`}
                >
                    <span
                        href="#"
                        className="sidebar-link"
                        onClick={() => setShowSublinks(!show_sublinks)}
                    >
                        {Icon && <Icon />}
                        <span>{link_details.label}</span>
                    </span>
                    <ul className={`submenu ${show_sublinks ? "active" : ""}`}>
                        {link_details.sub_links.map((slink) => (
                            <div key={slink.link}>
                                <Link
                                    onClick={handleNavlinkClick}
                                    className={`sidebar-sublink ${
                                        window.location.pathname === slink.link ? "active" : ""
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
