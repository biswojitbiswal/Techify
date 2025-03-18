import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const CategriesContext = createContext();

export const useCategories = () => useContext(CategriesContext);

export const CategoriesContextProvider = ({children}) => {
    // const [categories, setCategories] = useState([]);

    const fetchAllCategory = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/category/get-all`, {
                method: "GET",
            })
            const data = await response.json();
            // console.log(data);
            if (!response.ok) {
                toast.error(data.extraDetails ? data.extraDetails : data.message);
            }

            return data.categories || [];
        } catch (error) {
            toast.error("Error fetching categories:", error);
            console.error("Error fetching categories:", error);
        }
    }

    const {data: categories=[]} = useQuery({
        queryKey: ["categories"],
        queryFn: fetchAllCategory,
        staleTime: 15 * 60 * 1000,
        retry: 2,
    })

    // console.log(categories)

    return (
        <CategriesContext.Provider value={{categories}}>
            {children}
        </CategriesContext.Provider>
    );
};