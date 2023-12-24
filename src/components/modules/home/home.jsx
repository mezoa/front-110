import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './home.css';
import logo from '../../../assets/img/Budget Flow No Shadow.svg';

const Home = () => {
  return (
    <>
      <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
      </div>
      <motion.div
        className="homecontainer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="wrapper">
          <div className="component-title">
            <div>
              <div className="indicator"></div>
              <div className="title">HOME</div>
            </div>
          </div>
          {/* Add buttons for login and register redirections */}
          <div className="auth-buttons">
            <Link to="/login">
              <button className="auth-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="auth-button">Register</button>
            </Link>
          </div>
          <div className="home">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="description">
                Welcome to our expense tracker! An expense tracker is a tool that helps you keep track of your personal expenses.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="features"
            >
              <div className="feature-card">
                <span>INCOME TRACKER</span>
                <span>
                  Keep a record of your earnings and track your income sources to manage your finances effectively...
                </span>
              </div>
              <div className="feature-card">
                <span>EXPENSE TRACKER</span>
                <span>
                  Monitor your spending habits, categorize expenses, and analyze your expenditures to make informed financial decisions...
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Home;