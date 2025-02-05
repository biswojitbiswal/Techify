import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const CategriesContext = createContext();

export const useCategories = () => useContext(CategriesContext);

export const CategoriesContextProvider = ({children}) => {
    const [categories, setCategories] = useState([]);

    const fetchAllCategory = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/category/get-all`, {
                method: "GET",
            })
            const data = await response.json();
            // console.log(data);
            if (response.ok) {
                setCategories(data.categories);
            }
        } catch (error) {
            toast.error("Error fetching categories:", error);
            console.error("Error fetching categories:", error);
        }
    }

    useEffect(() => {
        fetchAllCategory()
    }, [])

    // console.log(categories)

    return (
        <CategriesContext.Provider value={{categories}}>
            {children}
        </CategriesContext.Provider>
    );
};