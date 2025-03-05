import React, { useEffect, useState } from 'react'
import UserTable from './UserTable';
import UserChart from './UserChart';

function AdminUsers() {

  return (
    <>
      <section className="admin-user-table">
        <UserChart />
        <UserTable />
      </section>
    </>
  )
}

export default AdminUsers
