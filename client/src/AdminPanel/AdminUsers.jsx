import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useAuth } from '../Store/Auth';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';


function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { user, authorization } = useAuth();

  const getAllUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/admin/get/users`, {
        method: "GET",
        headers: {
          Authorization: authorization,
        }
      })

      const data = await response.json();
      // console.log(data.users);

      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (userId) => {
    if (user.role !== 'Admin') {
      toast.error("Access Denied");
    } else {
      try {
        const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/admin/user/delete/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: authorization
          }
        })

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          getAllUsers();
          toast.success("User Deleted");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    getAllUsers();
  }, [])
  return (
    <>
      <section className="admin-user-table">
        <Table responsive="sm" bordered hover striped>
          <thead>
            <tr className='text-center'>
              <th>Id</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Edit</th>
              <th>Delete</th>

            </tr>
          </thead>
          <tbody>
            {
              users ? users.map((user, index) => {
                return <tr key={user._id} className='text-center'>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td><Link to={`/admin/user/edit/${user._id}`} className="btn btn-primary">Edit <span><i className="fa-solid fa-pencil ms-2"></i></span></Link></td>
                  <td><Button onClick={() => handleDelete(user._id)} variant='danger'>Delete<span><i className="fa-solid fa-trash ms-2"></i></span></Button></td>




                </tr>
              }) : <tr>
                <td colSpan={user.role === 'Admin' ? 5 : 4} className="text-center">
                  User Not Found
                </td>
              </tr>
            }

          </tbody>
        </Table>
      </section>
    </>
  )
}

export default AdminUsers
