import "./App.css";
import Header from "./components/Header";
// import Layover from "./components/Layover";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import { appStore } from "./store/appStore";
import { Provider } from "react-redux";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";

// Define layout wrapper to include Header in all routes
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
  </>
);

// Define router with layout
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <AuthPage />
      </AppLayout>
    ),
  },
  {
    path: "/home",
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <AppLayout>
        <Profile />
      </AppLayout>
    ),
  },
]);

function App() {
  return (
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;
