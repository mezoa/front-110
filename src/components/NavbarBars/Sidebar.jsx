import React, { useState } from "react";
import './Sidebar.css';
import logoImage from '../../assets/img/Budget Flow.svg';
import LogoutIcon from "../../assets/icons/logouticon";
import { BiMenu } from 'react-icons/bi';

const Sidebar = () => {
    const [incomesCollapsed, setIncomesCollapsed] = useState(false);
    const [expensesCollapsed, setExpensesCollapsed] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // add this line

    const handleIncomesClick = () => {
        setIncomesCollapsed(!incomesCollapsed);
    };

    const handleExpensesClick = () => {
        setExpensesCollapsed(!expensesCollapsed);
    };

    const toggleSidebar = () => { // add this function
        setIsSidebarOpen(!isSidebarOpen);
    };


        return (
        <>    
            <button className="sidebar-toggle-button" onClick={toggleSidebar}>
                <BiMenu />
            </button>
            <div className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`} id="bootstrap-sidebar">
                <div className="sidebar-content">
                    {/* Logo */}
                    <img
                            src={logoImage}
                            alt="Logo"
                            className="logo"
                            height="150px"
                            weight="150px"
                            margin="20px"
                        />
                    <ul className="sidebar-nav" id="bootstrap-sidebar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/dashboard">
                            <i className="bi bi-menu-button-wide"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${incomesCollapsed ? 'collapsed' : ''}`}
                            data-bs-target="#bootstrap-incomes-nav"
                            data-bs-toggle="collapse"
                            href="#"
                            onClick={handleIncomesClick}
                        >
                            <i className="bi bi-menu-button-wide"></i>
                            <span>Incomes</span>
                            <i className={`bi bi-chevron-${incomesCollapsed ? 'down' : 'up'} ms-auto`}></i>
                        </a>
                        <ul className={`nav-content collapse ${incomesCollapsed ? 'show' : ''}`} id="bootstrap-incomes-nav" data-bs-parent="#bootstrap-sidebar-nav">
                            <li className="dropdown-item">
                                <a href="/incomes">
                                    <i className="bi bi-circle"></i>
                                    <span>Income list</span>
                                </a>
                            </li>
                            <li className="dropdown-item">
                                <a href="/income-categories">
                                    <i className="bi bi-circle"></i>
                                    <span>Income categories</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${expensesCollapsed ? 'collapsed' : ''}`}
                            data-bs-target="#bootstrap-expenses-nav"
                            data-bs-toggle="collapse"
                            href="#"
                            onClick={handleExpensesClick}
                        >
                            <i className="bi bi-menu-button-wide"></i>
                            <span>Expenses</span>
                            <i className={`bi bi-chevron-${expensesCollapsed ? 'down' : 'up'} ms-auto`}></i>
                        </a>
                        <ul className={`nav-content collapse ${expensesCollapsed ? 'show' : ''}`} id="bootstrap-expenses-nav" data-bs-parent="#bootstrap-sidebar-nav">
                            <li className="dropdown-item">
                                <a href="/expenses">
                                    <i className="bi bi-circle"></i>
                                    <span>Expense list</span>
                                </a>
                            </li>
                            <li className="dropdown-item">
                                <a href="/expense-categories">
                                    <i className="bi bi-circle"></i>
                                    <span>Expense categories</span>
                                </a>
                            </li>
                        </ul>
                        <div className="logout-container">
                            <a href="/">
                                <LogoutIcon width="25px" height="25px" color="currentColor" />
                            </a>
                        </div>
                    </li>
                </ul>
               </div> 
            </div>
        </>    
    );
};

export default Sidebar;