import React from 'react'
import UserTable from './UserTable';
import UserChart from './UserChart';
import { useAuth } from '../../Store/Auth';

function AdminUsers() {
  const { user } = useAuth();
  return (
    <>
      <section className="admin-user-table">
        {
          user?.role === 'Admin' ?
            <UserChart /> : ""
        }
        <UserTable />
      </section>
    </>
  )
}

export default AdminUsers
