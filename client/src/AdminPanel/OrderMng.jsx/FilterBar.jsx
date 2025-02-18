import React from 'react'
import { Button, Form } from 'react-bootstrap';

function FilterBar({handleSearch, searchTerm, handleSort, sort, handleStatus}) {
    
    return (
        <div className='m-4 d-flex justify-content-between align-items-center'>
            <Button variant='outline-primary' onClick={() => handleSort('createdAt')} active={sort === 'createdAt'}>No Sort</Button>
            <Button variant='outline-primary' onClick={() => handleSort('amount')} active={sort === 'amount'}>Sort By Amount</Button>

            <Form.Control type="search" value={searchTerm} onChange={handleSearch} className='w-50 py-2 border-primary' placeholder="Search Here" />

            <Form.Select size='sm' className='w-25 py-2 border-primary' onChange={handleStatus} aria-label="Default select example">
                <option>Select Order Status</option>
                <option value="Pending">Pending</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
            <Button variant='primary'>Export</Button>

        </div>
    )
}

export default FilterBar
