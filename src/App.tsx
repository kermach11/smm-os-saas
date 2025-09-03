import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "./components/TranslationProvider";
import { adminManager } from "./components/admin-v2/AdminManager";
import Index from "./pages/Index";
import LinkCore from "./pages/LinkCore";
import CaseMachine from "./pages/CaseMachine";
import BookMe from "./pages/BookMe";
import NotFound from "./pages/NotFound";
import PocketBaseTestPage from "./components/PocketBaseTestPage";

const queryClient = new QueryClient();

const App = () => {
  // 🎯 Ініціалізуємо AdminManager V2 систему
  useEffect(() => {
    // AdminManager автоматично ініціалізується при імпорті
    console.log('🎯 AdminManager V2 готовий до роботи!');
    console.log('🎯 Поточний стан:', adminManager.getState());
    
    return () => {
      // Очищення при размонтуванні
      adminManager.destroy();
      console.log('🎯 AdminManager V2 вимкнено');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/linkcore" element={<LinkCore />} />
              <Route path="/casemachine" element={<CaseMachine />} />
              <Route path="/bookme" element={<BookMe />} />
              <Route path="/test-pocketbase" element={<PocketBaseTestPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export default App;
