import React, { useEffect, useRef, useState } from 'react'
import { BASE_URL } from "../../../config.js";
import { useAuth } from "../../Store/Auth.jsx";
import Button from 'react-bootstrap/Button';
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
    const [limit] = useState(5);
    const storedIds = useRef(new Set());

    const { authorization } = useAuth();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSort = (option) => {
        setSort(option);
        setSortOrder((prevOrder) => prevOrder === 'asc' ? 'desc' : 'asc')
    }

    const handleStatus = (e) => {
        setStatus(e.target.value)
    }

    const handleAllOrder = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/orders?skip=${skip}&limit=${limit}`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                },
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                const newOrders = data.orders.filter(order => !storedIds.current.has(order._id));

                if (newOrders.length > 0) {
                    newOrders.forEach(order => storedIds.current.add(order._id));

                    setOrders(prevOrders => [...prevOrders, ...newOrders]);
                }
            } else {
                toast.error("No More Order Found");
            }

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        handleAllOrder();
    }, [skip]);
    return (
        <>
            <div className="order-container text-center">
                <div className="table-caption bg-primary d-flex align-items-center">
                    <h3 className='fs-3 text-white ps-2'>Order Management</h3>
                </div>
                <FilterBar
                    handleSearch={handleSearch}  
                    searchterm={searchTerm}
                    handleSort={handleSort}
                    sort={sort}
                    handleStatus={handleStatus}
                />
                <OrderTable 
                    orders={orders} 
                    setOrders={setOrders} 
                    handleAllOrder={handleAllOrder} 
                />
                <Button variant='primary' onClick={() => setSkip((prev) => prev + limit)} className='m-3 fs-5'>More</Button>
            </div>
        </>
    )
}

export default AdminOrder
