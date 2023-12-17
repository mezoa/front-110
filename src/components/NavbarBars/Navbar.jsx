import MenuIcon from "../../assets/icons/menuicon";
import UserIcon from "../../assets/icons/usericon";
import LogoutIcon from "../../assets/icons/logouticon";
import SettingIcon from "../../assets/icons/settingicon";
import { useSidebar } from "../stores/sidebar";
import { useState } from "react";

const Navbar = () => {
    const sidebarStore = useSidebar();
    const [userDropDown, setUserDropDown] = useState(false);

    const toggleUserDropDown = () => {
        setUserDropDown(!userDropDown);
    };

    return (
        <nav className="navbar navbar-header navbar-expand navbar-light">
            <MenuIcon onClick={sidebarStore.toggle} />
            <ul className="navbar-nav d-flex align-items-center navbar-light ms-auto">
                <div className="top-nav-item position-relative">
                    <span onClick={toggleUserDropDown}>
                        <UserIcon width="25px" height="25px" />
                    </span>
                    {userDropDown && (
                        <div className="top-nav-dropdown">
                            <a className="top-nav-dropdown-item" href="/logout">
                                <LogoutIcon
                                    width="16px"
                                    height="16px"
                                    color="currentColor"
                                />
                                <span className="ms-2">Logout </span>
                            </a>
                            {/* <a className="top-nav-dropdown-item" href="/logout">
                                <SettingIcon
                                    width="16px"
                                    height="16px"
                                    color="currentColor"
                                />
                                <span className="ms-2">Profile Setting</span>
                            </a> */}
                        </div>
                    )}
                </div>
            </ul>
            <a href="/demo" className="ms-2">
                <span className="badge bg-danger py-2 px-3">Demo</span>
            </a>
        </nav>
    );
};

export default Navbar;

// Add the CSS styles to a separate CSS file and import it here
