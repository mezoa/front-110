import React, { useState } from "react";
import './Sidebar.css';
import logoImage from '../../assets/img/iptracker.png';

const Sidebar = () => {
    const [incomesCollapsed, setIncomesCollapsed] = useState(false);
    const [expensesCollapsed, setExpensesCollapsed] = useState(false);

    const handleIncomesClick = () => {
        setIncomesCollapsed(!incomesCollapsed);
    };

    const handleExpensesClick = () => {
        setExpensesCollapsed(!expensesCollapsed);
    };

    return (
        <div className="sidebar" id="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    {/* Logo */}
                    <img
                        src={logoImage}
                        alt="Logo"
                        className="logo"
                        height="100px"
                        margin="40px"
                    />
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/dashboard">
                        <i className="bi bi-menu-button-wide"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${incomesCollapsed ? 'collapsed' : ''}`}
                        data-bs-target="#incomes-nav"
                        data-bs-toggle="collapse"
                        href="#"
                        onClick={handleIncomesClick}
                    >
                        <i className="bi bi-menu-button-wide"></i>
                        <span>Incomes</span>
                        <i className={`bi bi-chevron-${incomesCollapsed ? 'down' : 'up'} ms-auto`}></i>
                    </a>
                    <ul className={`nav-content collapse ${incomesCollapsed ? 'show' : ''}`} id="incomes-nav" data-bs-parent="#sidebar-nav">
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
                        data-bs-target="#expenses-nav"
                        data-bs-toggle="collapse"
                        href="#"
                        onClick={handleExpensesClick}
                    >
                        <i className="bi bi-menu-button-wide"></i>
                        <span>Expenses</span>
                        <i className={`bi bi-chevron-${expensesCollapsed ? 'down' : 'up'} ms-auto`}></i>
                    </a>
                    <ul className={`nav-content collapse ${expensesCollapsed ? 'show' : ''}`} id="expenses-nav" data-bs-parent="#sidebar-nav">
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
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
