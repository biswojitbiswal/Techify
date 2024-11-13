import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {
    const [token, setToken] = useState(Cookies.get('accessToekn'));
    const [user, setUser] = useState("");

    const authorization = `Bearer ${token}`;

    const setTokenInCookies = (generateToken) => {
        setToken(generateToken);
        return Cookies.set("accessToekn", generateToken, {expires: 7});
    }

    const isLoggedInuser = !!token;

    const loggedOutUser = () => {
        setToken("");
        setUser("");
        return Cookies.remove("accessToekn");
    }

    const userAuthentication = async() => {
        try {
            const response = await fetch(`http://localhost:5000/api/yoga/user/getuser`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();
            // console.log(data.userData);

            if(response.ok){
                setUser(data.userData);
            } else {
                setUser("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        userAuthentication();
    },[]);

    return (
        <AuthContext.Provider value={{setTokenInCookies, authorization, user, isLoggedInuser, loggedOutUser}}>
            {children}
        </AuthContext.Provider>
    )
}