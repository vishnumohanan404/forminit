import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import SuccessFormSubmitPage from "./pages/SuccessFormSubmit";
const DashboardPage = React.lazy(() => import("./pages/Dashboard"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));
const Auth = React.lazy(() => import("./pages/Auth"));
const SettingsPage = React.lazy(() => import("./pages/Settings"));
const SupportPage = React.lazy(() => import("./pages/Support"));
const ChangelogsPage = React.lazy(() => import("./pages/Changelogs"));
const FormPage = React.lazy(() => import("./pages/Form"));
const WorkspacePage = React.lazy(() => import("./pages/Workspace"));
const FormViewPage = React.lazy(() => import("./pages/FormView"));
const FormSummaryPage = React.lazy(() => import("./pages/FormSummary"));

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
    path: "/success",
    element: <SuccessFormSubmitPage />,
  },
  {
    path: "/form-summary/:formId",
    element: (
      <ProtectedRoute>
        <FormSummaryPage />
      </ProtectedRoute>
    ),
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
