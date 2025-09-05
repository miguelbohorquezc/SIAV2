import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../../shared/constants/routes";
import Navbar from "../../shared/components/Navbar";

// Lazy load de páginas
const LoginPage = lazy(() => import("../../features/auth/pages/LoginPage"));
const DashboardPage = lazy(() => import("../../features/home/pages/DashboardPage"));
const HistoryPage = lazy(() => import("../../features/history/pages/AnnualHistoryPage"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div className="loader">Cargando…</div>}>
        <Routes>
          {/* Rutas públicas */}
          <Route path={PublicRoutes.LOGIN} element={<LoginPage />} />

          {/* Rutas privadas */}
          <Route path={PrivateRoutes.DASHBOARD} element={<DashboardPage />} />
          <Route path={`${PrivateRoutes.HISTORY}/annual`} element={<HistoryPage />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to={PublicRoutes.LOGIN} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
