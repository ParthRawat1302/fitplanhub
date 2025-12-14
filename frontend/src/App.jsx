import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginSignupPage from "./pages/LoginSignupPage";
import TrainerDashboard from "./pages/TrainerDashboard";
import PlanDetailsPage from "./pages/PlanDetailsPage";
import UserFeedPage from "./pages/UserFeedPage";
import TrainerProfilePage from "./pages/TrainerProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<LoginSignupPage />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/plans/:id" element={<PlanDetailsPage />} />
        <Route path="/feed" element={<UserFeedPage />} />
        <Route path="/trainers/:trainerId" element={<TrainerProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
