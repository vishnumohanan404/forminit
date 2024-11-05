import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFound";

import AuthProvider from "./contexts/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Auth from "./pages/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SettingsPage from "./pages/Settings";
import SupportPage from "./pages/Support";
import ChangelogsPage from "./pages/Changelogs";
import FormPage from "./pages/Form";
import Layout from "./layouts/Layout";
import WorkspacePage from "./pages/Workspace";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FormProvider } from "./contexts/FormContext";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

// TODO: explore Data API from
const router = createBrowserRouter([
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
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <FormProvider>
          <Layout>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              <Toaster />
            </QueryClientProvider>
          </Layout>
        </FormProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
