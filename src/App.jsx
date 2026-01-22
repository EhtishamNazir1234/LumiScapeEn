import Login from "./dashboardScreens/auth/Login.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginVerification from "./dashboardScreens/auth/Login-verification.jsx";
import Layout from "./dashboardScreens/layout/Layout.jsx";
import SupplierManagement from "./dashboardScreens/supplierManagement/index.jsx";
import AddSupplier from "./dashboardScreens/supplierManagement/AddSupplier.jsx";
import UserManagement from "./dashboardScreens/userManagement/index.jsx";
import AddAdmin from "./dashboardScreens/userManagement/addAdmin.jsx";
import Subscription from "./dashboardScreens/subscription/index.jsx";
import UpdateSubscription from "./dashboardScreens/subscription/UpdateSubscription.jsx";
import TicketsAndComplaints from "./dashboardScreens/tickets&Complaients/index.jsx";
import Setting from "./dashboardScreens/setting/index.jsx";
import PersonalDetail from "./dashboardScreens/setting/PersonalDetail.jsx";
import ChangePassword from "./dashboardScreens/setting/ChangePassword.jsx";
import CreatePassword from "./dashboardScreens/setting/Create-Password.jsx";
import NotificationSettings from "./dashboardScreens/setting/NotificationSettings.jsx";
import Chat from "./dashboardScreens/chat/index.jsx";
import Dashboard from "./dashboardScreens/dashboard/index.jsx";
import Tariff from "./dashboardScreens/Tariff/index.jsx";
import RolesManagement from "./dashboardScreens/roleManagement/index.jsx";
import NewRole from "./dashboardScreens/roleManagement/NewRole.jsx";
import DeviceManagement from "./dashboardScreens/deviceManagement/index.jsx";
import SystemAnalytics from "./dashboardScreens/systemAnalytics/Index.jsx";
import Reports from "./dashboardScreens/enterpriseDashboard/reports/Index.jsx";
import GenerateNewReports from "./dashboardScreens/enterpriseDashboard/reports/GenerateReport.jsx";
import HelpCenter from "./dashboardScreens/enterpriseDashboard/helpCenter/Index.jsx";
import EnterpriseDashboard from "./dashboardScreens/enterpriseDashboard/dashboard/Index.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  // TEMPORARY: Bypass auth check for screenshots
  const BYPASS_AUTH = true;

  if (loading && !BYPASS_AUTH) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={BYPASS_AUTH || isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route path="/login-verification" element={<LoginVerification />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/enterpriseDashboard" element={<EnterpriseDashboard />} />
        <Route
          path="/supplier-management"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <SupplierManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-supplier"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <AddSupplier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-supplier/:id"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <AddSupplier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-admin"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <AddAdmin />
            </ProtectedRoute>
          }
        />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route
          path="/subscriptions-update"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <UpdateSubscription />
            </ProtectedRoute>
          }
        />
        <Route path="/tickets" element={<TicketsAndComplaints />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/system-analytics"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <SystemAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <RolesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-role"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <NewRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tariff"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <Tariff />
            </ProtectedRoute>
          }
        />
        <Route path="/device-management" element={<DeviceManagement />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/personal-detail" element={<PersonalDetail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/notification-settings" element={<NotificationSettings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/generate-report" element={<GenerateNewReports />} />
        <Route path="/help-center" element={<HelpCenter />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
