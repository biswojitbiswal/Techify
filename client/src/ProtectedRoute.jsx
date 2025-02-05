import React, {useState, useEffect} from "react";
import { Navigate} from "react-router-dom";
import { useAuth } from "./Store/Auth";
import { Spinner } from "react-bootstrap";

function ProtectedRoute(WrappedComponent, allowedRoles) {
  return function (props){
    const {user, isLoggedInuser, isLoading} = useAuth();

    if (isLoading) {
      // Render a loading spinner or placeholder
      return <Spinner animation="border" variant="primary" />
    }

    if(!isLoggedInuser){
      return <Navigate to="/signin"/>;
    }

    if(!allowedRoles.includes(user.role)){
      return <Navigate to="/*"/>;
    }

    return <WrappedComponent {...props} />;
  }
}

export default ProtectedRoute
