import React, { useEffect, useState } from 'react'
import UserTable from './UserTable';


function AdminUsers() {

  return (
    <>
      <section className="admin-user-table">
        <UserTable />
      </section>
    </>
  )
}

export default AdminUsers
