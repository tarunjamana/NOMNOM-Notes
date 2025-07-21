import "./App.css";
import Header from "./components/Header";
// import Layover from "./components/Layover";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import { appStore, persistor } from "./store/appStore";
import { Provider } from "react-redux";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import { PersistGate } from "redux-persist/integration/react";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
  </>
);

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
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={appRouter} />
      </PersistGate>
    </Provider>
  );
}

export default App;
