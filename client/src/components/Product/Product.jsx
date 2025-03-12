import React, { useState, useRef, useCallback } from 'react'
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
import { useInfiniteQuery } from '@tanstack/react-query';

function Product() {
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState(categoryId || "");
  const [brand, setBrand] = useState("");
  const limit = 9;
  const observer = useRef();
  const searchTimeoutRef = useRef(null);
  const { authorization } = useAuth();

  // Function to fetch products with pagination
  const fetchProducts = async ({ pageParam = 0 }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/techify/products/get?skip=${pageParam}&limit=${limit}&sortOption=${sortOption}&sortOrder=${sortOrder}&category=${category}&brand=${brand}&searchTerm=${debouncedSearchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization
          },
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }
  
      const products = data.Allproducts || [];
  
      return {
        products,
        nextPage: products.length === limit ? pageParam + limit : undefined
      };
    } catch (error) {
      console.log(error)
      toast.error(error.message);
      return {
        products: [],
        nextPage: undefined,
      }
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['products', { sortOption, sortOrder, category, brand, searchTerm: debouncedSearchTerm }],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  
  const products = data ? data.pages.flatMap(page => page.products) : [];

  const handleSort = (option) => {
    setSortOption(option);
    setSortOrder((prevOrder) => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 700);
  };

  const handleFilterCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleFilterBrand = (e) => {
    setBrand(e.target.value);
  };

  const lastProductRef = useCallback(node => {
    if (isFetchingNextPage || !hasNextPage) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

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

        <ProductListing products={products} />

        {isLoading && (
          <div className="text-center my-3">
            <Spinner size='lg' variant='primary' />
          </div>
        )}

        {hasNextPage && <div ref={lastProductRef}></div>}
      </section>
    </>
  )
}

export default Product