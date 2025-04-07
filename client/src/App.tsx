import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { LanguageProvider } from "./lib/i18n/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
