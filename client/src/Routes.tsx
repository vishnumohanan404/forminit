import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Auth from "./pages/Auth";
import SettingsPage from "./pages/Settings";
import SupportPage from "./pages/Support";
import ChangelogsPage from "./pages/Changelogs";
import FormPage from "./pages/Form";
import WorkspacePage from "./pages/Workspace";
import FormViewPage from "./pages/FormView";

// TODO: explore Data API from
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/workspaces/:id",
    element: (
      <ProtectedRoute>
        <WorkspacePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/form/:id",
    element: (
      <ProtectedRoute>
        <FormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/form",
    element: (
      <ProtectedRoute>
        <FormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/view-form/:id",
    element: <FormViewPage />,
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/support",
    element: (
      <ProtectedRoute>
        <SupportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/changelogs",
    element: (
      <ProtectedRoute>
        <ChangelogsPage />
      </ProtectedRoute>
    ),
  },
]);
