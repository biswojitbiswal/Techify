import React, { useState, useEffect } from 'react'
import {BASE_URL} from '../../../config.js'
import { toast } from 'react-toastify'
import ProductListing from '../Product/ProductListing.jsx'

function ProdCategory({categoryId}) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const getProductbyCategory = async() => {
        if (!categoryId) return; 
        
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/techify/category/product/${categoryId}`, {
                method: 'GET',
            })
    
            const data = await response.json()
            console.log(data)
            if(response.ok){
                setProducts(Array.isArray(data) ? data : data.products || [])
            } else {
                toast.error(data.message || "Error fetching products")
            }
        } catch (error) {
            console.log(error);
            toast.error("Error Fetching! " + error.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductbyCategory()
    }, [categoryId]);

  return (
    <>
        <ProductListing products={products} />
    </>
  )
}

export default ProdCategory
