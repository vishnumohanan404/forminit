import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import NotFoundPage from "./pages/NotFound";
import Layout from "./layouts/layout";
import AuthProvider from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Auth from "./pages/Auth";

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
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);
function App() {
  return (
    <Layout>
      <AuthProvider isSignedIn={false}>
        <RouterProvider router={router} />
      </AuthProvider>
    </Layout>
  );
}

export default App;
