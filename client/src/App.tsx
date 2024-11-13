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

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <FormProvider>
          <Layout>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <RouterProvider router={routes} />
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
