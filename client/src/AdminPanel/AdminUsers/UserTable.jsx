import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../Store/Auth.jsx';
import { Link } from 'react-router-dom';
import { Button, Dropdown, DropdownButton, Table, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { BASE_URL } from '../../../config.js';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [role, setRole] = useState("");
    const [skip, setSkip] = useState(0);
    const limit = 5;
    const [loading, setLoading] = useState(false)
    // const [hasMore, setHasMore] = useState(true)
    // const observer = useRef();
    // const isFetching = useRef(false)


    const { user, authorization, refreshUser } = useAuth();
    let timeoutRef = useRef(null);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setSkip(0)
        setUsers([])

        if (timeoutRef.current) {
            clearTimeout(timeoutRef);
        }

        timeoutRef.current = setTimeout(() => {
            getAllUsers()
        }, 500)
    }

    const handleRole = (e) => {
        setRole(e.target.value)
        setSkip(0);
        setUsers([])
    }

    const getAllUsers = async () => {
        // if (isFetching.current) return;
        // isFetching.current = true;
        // setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/get/users?searchTerm=${searchTerm}&role=${role}&skip=${skip}&limit=${limit}`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                }
            });

            const data = await response.json();
            // console.log(data)

            if (response.ok) {
                setUsers(prev => (skip === 0 ? data.users : [...prev, ...data.users]));

                // setHasMore(data.users.length === limit);
            } else {
                // setHasMore(false);
                toast.error("No More Users Found");
            }
        } catch (error) {
            console.log(error);
        } finally {
            // isFetching.current = false;
            setLoading(false);
        }
    };


    const handleDelete = async (userId) => {
        if (user.role !== 'Admin') {
            toast.error("Access Denied");
        } else {
            try {
                const response = await fetch(`${BASE_URL}/api/techify/admin/user/delete/${userId}`, {
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

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/assign/role/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization
                },
                body: JSON.stringify({ role: newRole })
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.success(data.message);
                refreshUser()
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, [role, skip])

    // const lastUsersRef = useCallback(node => {
    //         if (loading || !hasMore) return;
    //         if (observer.current) observer.current.disconnect();
    //         observer.current = new IntersectionObserver(entries => {
    //             if (entries[0].isIntersecting && hasMore) {
    //                 setSkip(prevSkip => prevSkip + limit);
    //                 console.log(skip)
    //             }
    //         });
    //         if (node) observer.current.observe(node);
    //     }, [loading, hasMore, skip]);

    return (
        <div className='d-flex flex-column gap-3'>
            <div className='d-flex gap-3'>
                <Form.Control type="search" value={searchTerm} onChange={handleSearch} className='w-75 py-2 border-primary' placeholder="Search Here" />

                <Form.Select size='sm' className='w-25 py-2 border-primary' onChange={handleRole} value={role} aria-label="Default select example">
                    <option value="">Select Role</option>
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                </Form.Select>
            </div>
            <div className='rounded-2'>
                <div className="table-caption rounded-top-2 bg-primary d-flex align-items-center py-3">
                    <h3 className='fs-3 text-white ps-2'>User Management</h3>
                </div>
                <Table responsive="sm" bordered hover striped>
                    <thead>
                        <tr className='text-center'>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Edit</th>
                            {user.role === 'Admin' ? <th>Delete</th> : ""}

                        </tr>
                    </thead>
                    <tbody>
                        { loading ? <Spinner animation="border" variant="primary" /> : 
                            users ? users.map((userD, index) => {
                                return <tr key={`${userD._id}_${index}`} className='text-center'>
                                    <td>{userD._id}</td>
                                    <td>{userD.name}</td>
                                    <td>{userD.email}</td>
                                    <td>{user?.role === 'Admin' ? userD.phone : 'XXXXXXXXXX'}</td>
                                    {
                                        user?.role === 'Admin' ? (
                                            <td>
                                                <DropdownButton id={`dropdown-item-${userD._id}`} title={userD.role}
                                                    onSelect={(newRole) => handleRoleChange(userD._id, newRole)}
                                                >
                                                    <Dropdown.Item eventKey="User" as="button" var>User</Dropdown.Item>
                                                    <Dropdown.Item eventKey="Moderator" as="button">Moderator</Dropdown.Item>
                                                    <Dropdown.Item eventKey="Admin" as="button">Admin</Dropdown.Item>
                                                </DropdownButton></td>
                                        ) : (
                                            <td className={userD.role === 'Admin' ? 'text-success' :
                                                userD.role === 'Moderator' ? 'text-warning' :
                                                    'text-primary'} style={{ fontWeight: "600", fontSize: "1.25rem" }}>{userD.role}</td>
                                        )
                                    }

                                    <td><Link to={`/admin/user/edit/${userD._id}`} className="btn btn-primary fs-5"><i className="fa-solid fa-pen-to-square"></i></Link></td>
                                    {
                                        user?.role === 'Admin' && (
                                            <td><Button onClick={() => handleDelete(userD._id)} variant='danger' className='fs-5'><i className="fa-solid fa-trash"></i></Button></td>
                                        )
                                    }
                                </tr>
                            }) : <tr>
                                <td colSpan={7} className="text-center fs-3">
                                    User Not Found
                                </td>
                            </tr>
                        }

                    </tbody>
                </Table>
                {/* <div ref={lastUsersRef}></div> */}
            </div>
        </div>
    )
}

export default UserTable
