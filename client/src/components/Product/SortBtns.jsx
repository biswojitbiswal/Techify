import React from 'react'
import { Button } from 'react-bootstrap'

function SortBtns({handleSort, sortOption}) {
    return (
        <div className='d-flex gap-2'>
            <Button variant='outline-primary' onClick={() => handleSort("createdAt")} active={sortOption === 'createdAt'}>No Sort</Button>

            <Button variant='outline-primary' onClick={() => handleSort('price')} active={sortOption === 'price'}>Price</Button>
            
            <Button variant='outline-primary' onClick={() => handleSort('averageRating')} active={sortOption === 'averageRating'}>Ratings</Button>
        </div>
    )
}

export default SortBtns
