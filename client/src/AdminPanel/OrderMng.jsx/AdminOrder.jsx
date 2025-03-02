import React, { useEffect, useRef, useState, useCallback } from 'react'
import { BASE_URL } from "../../../config.js";
import { useAuth } from "../../Store/Auth.jsx";
import { toast } from 'react-toastify';
import FilterBar from './FilterBar.jsx';
import OrderTable from './OrderTable.jsx';

function AdminOrder() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState('desc');
    const [status, setStatus] = useState("");
    const [skip, setSkip] = useState(0);
    const limit = 5;
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const isFetching = useRef(false);

    const { authorization } = useAuth();
    let timeoutRef = useRef(null);


    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setSkip(0);
        setOrders([]);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            handleAllOrder()
        }, 500);
    }


    const handleStatus = (e) => {
        setStatus(e.target.value)
        setSkip(0);
        setOrders([]);
    }

    const handleAllOrder = async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/orders?skip=${skip}&limit=${limit}&searchTerm=${searchTerm}&status=${status}`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                },
            })

            const data = await response.json();
            // console.log(data.orders);

            if (response.ok) {
                setOrders(prev => (skip === 0 ? data.orders : [...prev, ...data.orders]));
                setHasMore(data.orders.length === limit);
            } else {
                setHasMore(false);
                toast.error("No More Order Found");
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }


    useEffect(() => {
        handleAllOrder();
    }, [skip, status]);

    const lastOrderRef = useCallback(node => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setSkip(prevSkip => prevSkip + limit);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <>
            <div className="order-container text-center">
                <div className="table-caption bg-primary d-flex align-items-center">
                    <h3 className='fs-3 text-white ps-2'>Order Management</h3>
                </div>
                <FilterBar
                    orders={orders}
                    handleSearch={handleSearch}
                    searchTerm={searchTerm}
                    status={status}
                    handleStatus={handleStatus}
                />
                <OrderTable
                    orders={orders}
                    setOrders={setOrders}
                    handleAllOrder={handleAllOrder}
                />


                <div ref={lastOrderRef}></div>
            </div>
        </>
    )
}

export default AdminOrder
