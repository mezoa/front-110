import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../stores/sidebar";

const SideNavLink = ({ link_details }) => {
    const sidebarStore = useSidebar();

    const [show_sublinks, setShowSublinks] = useState(false);
    const [sublinks, setSublinks] = useState([]);

    const handleNavlinkClick = () => {
        if (window.innerWidth <= 767) {
            useSidebar().toggle();
        }
    };

    useEffect(() => {
        setSublinks(link_details.sub_links?.map((obj) => obj.link) || []);
    }, [link_details.sub_links]);

    return (
        <div>
            {/* For Links Only */}
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
                        <Icon />
                        <span>{link_details.label}</span>
                    </Link>
                </li>
            )}

            {/* For Links with SubLinks */}
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
                        <Icon />
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
