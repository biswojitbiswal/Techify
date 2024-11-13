import React, {useEffect} from 'react'
import { useAuth } from '../../Store/Auth'
import { Navigate } from 'react-router-dom';

function Signout() {
  const {loggedOutUser} = useAuth();

  useEffect(() => {
    loggedOutUser();
  }, [loggedOutUser]);

  return <Navigate to="/signin" />;
}

export default Signout
