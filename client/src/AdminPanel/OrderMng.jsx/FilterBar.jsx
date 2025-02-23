import React from 'react'
import { Button, Form } from 'react-bootstrap';

function FilterBar({ orders, handleSearch, searchTerm, status, handleStatus }) {

    const handleExport = () => {
        if (orders.length === 0) {
            toast.error("No Transaction To Export");
            return;
        }
    
        const headers = ["Order ID", "Name", "Contact", "Product", "Quantity", "Amount", "Date", "Order Status", "Payment Status"];
    
        // Flatten orders so each item appears in a new row
        const rows = orders.flatMap(order =>
            order.orderedItem.map(item => [
                order._id,
                order.name,
                order.contact,
                item.productTitle,
                item.quantity,
                item.amount,
                new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-'),
                item.status,
                item.payStatus,
            ])
        );
    
        // Convert array to CSV format
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(","))
            .join("\n");
    
        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", "orders.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <div className='m-4 d-flex gap-2 justify-content-between align-items-center'>

            <Form.Control type="search" value={searchTerm} onChange={handleSearch} className='w-75 py-2 border-primary' placeholder="Search Here" />

            <Form.Select size='sm' className='w-25 py-2 border-primary' onChange={handleStatus} value={status} aria-label="Default select example">
                <option value="">Select Order Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
            </Form.Select>
            <Button variant='primary' onClick={handleExport} className='px-3 py-2'>Export</Button>

        </div>
    )
}

export default FilterBar
