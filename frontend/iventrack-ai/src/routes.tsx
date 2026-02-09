import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout } from "./layouts/auth/AuthLayout";
import { RegisterView } from "./views/auth/RegisterView";
import { LoginView } from "./views/auth/LoginView";
import { LoadingPage } from "./views/LoadingPage";
import { DashboardLayout } from "./layouts/dashboard/DashboardLayout";
import { DashboardPage } from "./views/dashboard/DashboardPage";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
