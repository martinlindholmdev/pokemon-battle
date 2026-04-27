import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { BattlePage } from "./pages/BattlePage";
import { HomePage } from "./pages/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";
import { RosterPage } from "./pages/RosterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pokemon/:id", element: <PokemonDetailPage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
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
