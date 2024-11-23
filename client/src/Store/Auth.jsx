import React from "react";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {
    const [token, setToken] = useState(Cookies.get('accessToekn'));
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [forceUpdate, setForceUpdate] = useState(false);

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
            setIsLoading(true)
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/user/getuser`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();
            // console.log(data.userData);

            if(response.ok){
                setUser((prevUser) =>
                    JSON.stringify(prevUser) !== JSON.stringify(data.userData) ? data.userData : prevUser
                );
                setIsLoading(false)
            } else {
                setUser("");
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        userAuthentication();
    },[forceUpdate]);

    const refreshUser = () => setForceUpdate((prev) => !prev);

    return (
        <AuthContext.Provider value={{setTokenInCookies, authorization, refreshUser, isLoading, user, setUser, isLoggedInuser, loggedOutUser}}>
            {children}
        </AuthContext.Provider>
    )
}