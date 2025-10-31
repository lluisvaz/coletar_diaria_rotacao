import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/login";
import QuickAccess from "@/pages/quick-access";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const showNavigation = location !== "/login";

  return (
    <>
      {showNavigation && (
        <>
          <Sidebar />
          <MobileHeader />
        </>
      )}
      <div className={showNavigation ? "lg:ml-16 pt-14 lg:pt-0" : ""}>
        {children}
      </div>
    </>
  );
}

function Router() {
  const [location, setLocation] = useLocation();
  
  const { data: authStatus, isLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/auth/status"],
    retry: false,
    refetchOnMount: true,
  });

  const isAuthenticated = authStatus?.authenticated ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (location === "/login") {
    if (isAuthenticated) {
      setLocation("/home");
      return null;
    }
    return <Login />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/home" component={QuickAccess} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
