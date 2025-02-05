import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config.js";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {
    const [token, setToken] = useState(Cookies.get('accessToken'));
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [forceUpdate, setForceUpdate] = useState(false);
    const [darkMode, setDarkMode] = useState(Cookies.get('darkmode') === 'true')


    const authorization = `Bearer ${token}`;

    const setTokenInCookies = (generateToken) => {
        setToken(generateToken);
        return Cookies.set("accessToken", generateToken, {expires: 7});
    }

    const handleDarkMode = () => {
        const newmode = !darkMode;
        setDarkMode(newmode);
        Cookies.set('darkmode', newmode.toString(), {expires: 7});
    }

    const isLoggedInuser = !!token;

    const loggedOutUser = () => {
        setToken("");
        setUser("");
        setDarkMode("");
        Cookies.remove('darkmode');
        return Cookies.remove("accessToken");
    }

    const userAuthentication = async() => {
        try {
            setIsLoading(true)
            const response = await fetch(`${BASE_URL}/api/techify/user/getuser`, {
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

    useEffect(() => {
        if(darkMode){
          document.body.style.backgroundColor = "#000000";
        } else {
          document.body.style.backgroundColor = "#ffffff";
    
        }
    }, [darkMode]);

   

    return (
        <AuthContext.Provider value={{
            setTokenInCookies, 
            authorization, 
            refreshUser, 
            isLoading, 
            user, 
            setUser, 
            isLoggedInuser, 
            loggedOutUser,
            darkMode,
            handleDarkMode
            
        }}>
            {children}
        </AuthContext.Provider>
    )
}