// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import { ThemeProvider } from "./components/context/ThemeContext";
import { LanguageProvider } from "./components/context/LanguageContext";

// init i18n (side-effect import — must come before App)
import "./components/lib/i18n";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./components/context/AuthContext";
import UserLoggedInfoProvider from "./components/context/UserLoggedContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <UserLoggedInfoProvider>
          <ThemeProvider>
            <LanguageProvider>
              <HeroUIProvider>
                <App />
              </HeroUIProvider>
            </LanguageProvider>
          </ThemeProvider>
        </UserLoggedInfoProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
