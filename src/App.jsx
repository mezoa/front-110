import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './assets/css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/modules/home/home';
import Dashboard from './components/modules/Dashboard/dashboard';
import Incomes from './components/modules/income/Incomes';
import IncomeCategories from './components/modules/income-category/IncomeCategories';
import Expenses from './components/modules/expense/Expense';
import ExpenseCategories from './components/modules/expense-category/ExpenseCategories';
import Visitors from './components/modules/visitors/visitors';
import Login from './components/auth/Login';
import Register from './components/auth/Register';  
import Sidebar from './components/NavbarBars/Sidebar'; // Check this import path

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideSidebarFor = ['/login', '/register', '/'];

  return (
    <div className="app-container">
      {!hideSidebarFor.includes(location.pathname) && (
        <div className="sidebar-container">
          <Sidebar />
        </div>
      )}
      <div className={`route-container ${hideSidebarFor.includes(location.pathname) ? 'center-content' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/income-categories" element={<IncomeCategories />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expense-categories" element={<ExpenseCategories />} />
          <Route path="/visitors" element={<Visitors />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;