import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout } from "./layouts/auth/AuthLayout";
import { RegisterView } from "./views/auth/RegisterView";
import { LoginView } from "./views/auth/LoginView";
import { LoadingPage } from "./views/LoadingPage";
import { DashboardLayout } from "./layouts/dashboard/DashboardLayout";
import { DashboardPage } from "./views/dashboard/DashboardPage";
import { ProductsPage } from "./views/dashboard/products/ProductsPage";
import InventoryPage from "./views/dashboard/inventory/InventoryPage";
import MovementsPage from "./views/dashboard/movements/MovementsPage";
import AnalysisPage from "./views/dashboard/analysis/AnalysisPage";
import AlertsPage from "./views/dashboard/alerts/AlertsPage";
import ReportsPage from "./views/dashboard/reports/ReportsPage";
import SettingsPage from "./views/dashboard/settings/SettingsPage";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="/auth/login" element={<LoginView />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="movements" element={<MovementsPage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
