import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import './Product.css'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config.js';
import FilterBrand from './FilterBrand.jsx';
import SortBtns from './SortBtns.jsx';
import ProductListing from './ProductListing.jsx';
import FilterCategory from './FilterCategory.jsx';


function Product() {
  const {categoryId} = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState(categoryId || "");
  const [brand, setBrand] = useState("");
  const [skip, setSkip] = useState(0);
  const limit = 9;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const storedIds = useRef(new Set());
  const isFetching = useRef(false);
  let timeOutId;


  const { authorization, refreshUser } = useAuth();

  const handleSort = (option) => {
    setSortOption(option);
    setSortOrder((prevOrder) => prevOrder === 'asc' ? 'desc' : 'asc');
    setSkip(0);
    setProducts([]);
  }

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSkip(0);
    setProducts([]);
    if(timeOutId){
      clearTimeout(timeOutId);
    }

    timeOutId = setTimeout(() => {
      productData();
    }, 1000)
  }

  const handleFilterCategory = (e) => {
    setCategory(e.target.value);
    setSkip(0);
    setProducts([]);
  }

  const handleFilterBrand = (e) => {
    setBrand(e.target.value);
    setSkip(0);
    setProducts([]);
  }
  // console.log(category)
  const productData = useCallback(async () => {
    if(isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    // console.log("called")

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(`${BASE_URL}/api/techify/products/get?skip=${skip}&limit=${limit}&sortOption=${sortOption}&sortOrder=${sortOrder}&category=${category}&brand=${brand}&searchTerm=${searchTerm}`, {
        method: "GET",
        headers: {
          Authorization: authorization
        },
        signal,
      })

      const data = await response.json();

      if (response.ok) {
        // setProducts(prev => [...prev, ...data.Allproducts]);
        setProducts(prev => (skip === 0 ? data.Allproducts : [...prev, ...data.Allproducts]));
        setHasMore(data.Allproducts.length === limit);
      } else {
        setHasMore(false);
        toast.error("No more products found.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
    return () => controller.abort();
  }, [skip, sortOption, sortOrder, category, brand, searchTerm]);


  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/techify/admin/product/delete/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: authorization
        }
      })

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        toast.success("Product Removed");
        refreshUser();
        setProducts((prevProducts) => prevProducts.filter(product => product._id !== data.product._id))
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error)
    }
  }



  const lastProductRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip(prevSkip => prevSkip + limit);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);


  useEffect(() => {
    setSkip(0);
    setProducts([]);
    setHasMore(true);
    productData();
  }, [sortOption, sortOrder, category, brand, searchTerm]);

  useEffect(() => {
    if (skip > 0) {
      productData();
    }
  }, [skip]);
  return (
    <>
      <section id="product-page">
        <InputGroup className="mb-3" style={{ height: "50px" }}>
          <Form.Control
            placeholder="Search Here"
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search"
          />
        </InputGroup>

        <div className="sort-filter w-100">
          <SortBtns handleSort={handleSort} sortOption={sortOption} />

          <div className="filter-btns">
            <FilterCategory handleFilterCategory={handleFilterCategory} />
            <FilterBrand handleFilterBrand={handleFilterBrand} />
          </div>
        </div>

        <ProductListing products={products} handleDelete={handleDelete} />

        {loading && <Spinner size='lg' variant='primary' />}

        <div ref={lastProductRef}></div>
      </section>
    </>
  )
}

export default Product
