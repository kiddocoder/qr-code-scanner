import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import Onboarding from "./pages/Onboarding"
import ScanPage from "./pages/Scanner"
import AppLayout from "./layouts/AppLayout"
import BatchScanPage from "./pages/BatchScanner"
import Settings from "./pages/Settings"
import Generate from "./pages/Generate"
import History from "./pages/History"
import { AuthProvider } from "./contexts/authContext"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Onboarding />
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/scanner",
        element: <ScanPage />
      },
      {
        path: "/batch/scanner",
        element: <BatchScanPage />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/generate",
        element: <Generate />
      },
      {
        path: "/history",
        element: <History />
      },
    ]
  }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
