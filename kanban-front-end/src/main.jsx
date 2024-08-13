import React from "react";
import ReactDOM from 'react-dom/client'
import Welcome from './welcome-page.jsx'
import ErrorPage from './error-page.jsx'
import SignIn from "./signin.jsx";
import SignUp from "./signup.jsx";
import Dashboard from "./dashboard.jsx";
import Project from "./project.jsx";
import Mission from "./mission.jsx";
import './output.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/project",
    element: <Project />,
  },
  {
    path: "/mission",
    element: <Mission />,
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);