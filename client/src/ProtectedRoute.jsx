import React from "react";
import { Navigate} from "react-router-dom";
import { useAuth } from "./Store/Auth";

function ProtectedRoute(WrappedComponent, allowedRoles) {
  return function (props){
    const {user, isLoggedInuser} = useAuth();

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
