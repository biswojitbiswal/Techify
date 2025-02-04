import React, { useState } from 'react'
import {Form} from 'react-bootstrap'

function Search() {
  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }
  return (
    <div>
      <Form.Control size="lg" className='w-100 bg-body-secondary mb-3' type="text" value={search} onChange={handleSearch} placeholder="Search Here" />
    </div>
  )
}

export default Search
