// src/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import Logout from './pages/Logout';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import TotalCustomers from './admin/TotalCustomers';
import AdminLoans from './admin/AdminLoans';
import ApprovedLoans from './admin/ApprovedLoans';
import PendingLoans from './admin/PendingLoans';
import RejectedLoans from './admin/RejectedLoans';
import CreateCategory from './admin/CreateCategory';
import CategoryList from './admin/CategoryList';
import EditCategory from './admin/EditCategory';
import AdminUserLoans from './admin/AdminUserLoans';

// User Pages
import LoanHistory from './user/LoanHistory';
import ApplyLoan from './user/ApplyLoan';
import TransactionHistory from './user/TransactionHistory';

// Components
import AdminHeader from './components/AdminHeader';
import UserHeader from './components/UserHeader';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />

      {/* User Routes */}
      <Route
        path="/user-dashboard"
        element={
          <>
            <UserHeader />
            <UserDashboard />
          </>
        }
      />
      <Route
        path="/loan-history"
        element={
          <>
            <UserHeader />
            <LoanHistory />
          </>
        }
      />
      <Route
        path="/apply-loan"
        element={
          <>
            <UserHeader />
            <ApplyLoan />
          </>
        }
      />
      <Route
        path="/transactions"
        element={
          <>
            <UserHeader />
            <TransactionHistory />
          </>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <>
            <AdminHeader />
            <AdminDashboard />
          </>
        }
      />
      <Route
        path="/total-customers"
        element={
          <>
            <AdminHeader />
            <TotalCustomers />
          </>
        }
      />
      <Route
        path="/loans"
        element={
          <>
            <AdminHeader />
            <AdminLoans />
          </>
        }
      />
      <Route
        path="/approved-loans"
        element={
          <>
            <AdminHeader />
            <ApprovedLoans />
          </>
        }
      />
      <Route
        path="/pending-loans"
        element={
          <>
            <AdminHeader />
            <PendingLoans />
          </>
        }
      />
      <Route
        path="/rejected-loans"
        element={
          <>
            <AdminHeader />
            <RejectedLoans />
          </>
        }
      />
      <Route
        path="/categories"
        element={
          <>
            <AdminHeader />
            <CategoryList />
          </>
        }
      />
      <Route
        path="/create-category"
        element={
          <>
            <AdminHeader />
            <CreateCategory />
          </>
        }
      />
      <Route
        path="/edit-category/:id"
        element={
          <>
            <AdminHeader />
            <EditCategory />
          </>
        }
      />
      <Route
        path="/user-loans"
        element={
          <>
            <AdminHeader />
            <AdminUserLoans />
          </>
        }
      />
    </Routes>
  );
}