import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import EmployeeCalendarPage from './pages/EmployeeCalendarPage.jsx';
import AdminCalendarPage from './pages/AdminCalendarPage.jsx';
import AdminInventoryPage from './pages/AdminInventoryPage.jsx';
import AdminEmployeesPage from './pages/AdminEmployeesPage.jsx';
import AdminRequestsPage from './pages/AdminRequestsPage.jsx';
import EmployeeAssetsPage from './pages/EmployeeAssetsPage.jsx';
import EmployeeRequestsPage from './pages/EmployeeRequestsPage.jsx';
import EmployeeProfilePage from './pages/EmployeeProfilePage.jsx';

export default function App() {
  return <HashRouter><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/features" element={<FeaturesPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/employee" element={<EmployeeDashboardPage />} />
    <Route path="/employee/assets" element={<EmployeeAssetsPage />} />
    <Route path="/employee/requests" element={<EmployeeRequestsPage />} />
    <Route path="/employee/profile" element={<EmployeeProfilePage />} />
    <Route path="/employee/calendar" element={<EmployeeCalendarPage />} />
    <Route path="/admin" element={<AdminDashboardPage />} />
    <Route path="/admin/inventory" element={<AdminInventoryPage />} />
    <Route path="/admin/employees" element={<AdminEmployeesPage />} />
    <Route path="/admin/requests" element={<AdminRequestsPage />} />
    <Route path="/admin/calendar" element={<AdminCalendarPage />} />
    <Route path="*" element={<HomePage />} />
  </Routes></HashRouter>;
}
