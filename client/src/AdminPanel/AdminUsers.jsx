import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useAuth } from '../Store/Auth';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { BASE_URL } from '../../config.js';


function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { user, authorization, refreshUser } = useAuth();

  const getAllUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/yoga/admin/get/users`, {
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
        const response = await fetch(`${BASE_URL}/api/yoga/admin/user/delete/${userId}`, {
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

  const handleRoleChange = async(userId, newRole) => {
    try {
      const response = await fetch(`${BASE_URL}/api/yoga/admin/assign/role/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization
        },
        body: JSON.stringify({role: newRole})
      })

      const data = await response.json();
      console.log(data);

      if(response.ok){
        toast.success(data.message);
        refreshUser()
      }
    } catch (error) {
      console.log(error);
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Edit</th>
              {user.role === 'Admin' ? <th>Delete</th> : ""}

            </tr>
          </thead>
          <tbody>
            {
              users ? users.map((userD, index) => {
                return <tr key={userD._id} className='text-center'>
                  <td>{index + 1}</td>
                  <td>{userD.name}</td>
                  <td>{userD.email}</td>
                  <td>{userD.phone}</td>
                  {
                    user?.role === 'Admin' ? (
                      <td>
                      <DropdownButton id={`dropdown-item-${userD._id}`}  style={{minWidth: "150px"}} title={userD.role}
                      onSelect={(newRole) => handleRoleChange(userD._id, newRole)}
                      >
                        <Dropdown.Item eventKey="User" as="button">User</Dropdown.Item>
                        <Dropdown.Item eventKey="Moderator" as="button">Moderator</Dropdown.Item>
                        <Dropdown.Item eventKey="Admin" as="button">Admin</Dropdown.Item>
                      </DropdownButton></td>
                    ) : (
                      <td className={userD.role === 'Admin' ? 'text-success' :
                        userD.role === 'Moderator' ? 'text-warning' :
                          'text-primary'} style={{ fontWeight: "600", fontSize: "1.25rem" }}>{userD.role}</td>
                    )
                  }

                  <td><Link to={`/admin/user/edit/${userD._id}`} className="btn btn-primary">Edit <span><i className="fa-solid fa-pencil ms-2"></i></span></Link></td>
                  {
                    user?.role === 'Admin' && (
                      <td><Button onClick={() => handleDelete(userD._id)} variant='danger'>Delete<span><i className="fa-solid fa-trash ms-2"></i></span></Button></td>
                    )
                  }
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
