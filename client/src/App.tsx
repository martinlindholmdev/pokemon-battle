import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { AgentWorkflowPage } from "./pages/AgentWorkflowPage";
import { BattlePage } from "./pages/BattlePage";
import { HomePage } from "./pages/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { PlaybookPage } from "./pages/PlaybookPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";
import { RosterPage } from "./pages/RosterPage";

const router = createBrowserRouter([
  { path: "/workflow", element: <AgentWorkflowPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pokemon/:id", element: <PokemonDetailPage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "playbook", element: <PlaybookPage /> },
      { path: "login", element: <AuthPage mode="login" /> },
      { path: "register", element: <AuthPage mode="register" /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "roster", element: <RosterPage /> },
          { path: "battle", element: <BattlePage /> }
        ]
      }
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
