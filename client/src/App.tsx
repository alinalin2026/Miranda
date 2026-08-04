import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AllDaySlimmingTea from "@/pages/AllDaySlimmingTea";
import CostaRicanIcedTea from "@/pages/CostaRicanIcedTea";
import Dashboard from "@/pages/Dashboard";
import GutterQuiz from "@/pages/GutterQuiz";
import MellaraMaxReview from "@/pages/MellaraMaxReview";
import NotFound from "@/pages/NotFound";
import ProductReview from "@/pages/ProductReview";
import TeaQuiz from "@/pages/TeaQuiz";
import VanotiumReview from "@/pages/VanotiumReview";
import VanotiumReviewEs from "@/pages/VanotiumReviewEs";
import VanotiumReviewFr from "@/pages/VanotiumReviewFr";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/review/vanotium-cutting-board"} component={VanotiumReview} />
      <Route path={"/review/vanotium-cutting-board/es"} component={VanotiumReviewEs} />
      <Route path={"/review/vanotium-cutting-board/fr"} component={VanotiumReviewFr} />
      <Route path={"/review/mellaramax-pillow"} component={MellaraMaxReview} />
      <Route path={"/review/all-day-slimming-tea"} component={AllDaySlimmingTea} />
      <Route path={"/recipes/costa-rican-iced-tea"} component={CostaRicanIcedTea} />
      <Route path={"/tea-quiz"} component={TeaQuiz} />
      <Route path={"/gutters"} component={GutterQuiz} />
      <Route path={"/review/:productId"} component={ProductReview} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
