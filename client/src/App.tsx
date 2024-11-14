import "./App.css";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./layouts/LayoutDiv";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FormProvider } from "./contexts/FormContext";
import { Toaster } from "./components/ui/sonner";
import { routes } from "./Routes";
import { Suspense } from "react";
import SuspenseLayout from "./layouts/SuspenseLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <FormProvider>
          <Layout>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <Suspense fallback={<SuspenseLayout />}>
                  <RouterProvider router={routes} />
                </Suspense>
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
