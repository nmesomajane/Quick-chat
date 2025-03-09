import React from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import User from "../pages/User"
import Login  from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../components/ProtectedRoute";
import { ReactNode } from "react";



import ScrollToTop from "../components/ScrollToTop";
import { SharedLayout } from "../components/layout/SharedLayout";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { Route } from "react-router-dom";

const ProtectedRouteWrapper = ({ children }: { children: ReactNode}) => {
  const { currentUser } = useContext(AuthContext) ?? {}; // Handle possible null context
  return currentUser ? children : <Navigate to="/login" replace />;
};

export function AppRoutes() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: (
        <>
          <ScrollToTop />
          <SharedLayout />
        </>
      ),
      children: [
        { 
          index: true, 
          element: <Signup />
           },
        { 
          path: "login", 
          element: <Login /> 
          },
          { 
          path: "user", 
          element: (
          <ProtectedRouteWrapper>
            <User />
          </ProtectedRouteWrapper>
          ),
          },
      ],
    },
  ];
  return useRoutes(routes);
}
