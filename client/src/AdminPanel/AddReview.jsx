import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useAuth } from '../Store/Auth.jsx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config.js';


function AdminReview() {
    const [reviews, setReviews] = useState([]);

    const { authorization, user, isLoading } = useAuth();


    const handleStatus = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/status/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.success("Status Changed!");
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review._id === id ? { ...review, status: data.review.status } : review
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getAllReviews = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/get/reviews`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                }
            })

            const data = await response.json();
            // console.log(data);

            if (response.ok) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/delete/review/${reviewId}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.error("Review Deleted");
                getAllReviews()
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getAllReviews();
    }, []);

    const sortedReviews = reviews.sort((a, b) =>
        a.status === "Pending" && b.status === "Approved" ? -1 : 1
    );

    return (
        <>
            <section className="admin-user-table">
                <Table responsive="sm" bordered hover striped>
                    <thead>
                        <tr className='text-center'>
                            <th>Id</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Review</th>
                            <th>Rating</th>
                            <th>Status</th>
                            {user.role === 'Admin' && <th>Delete</th>}

                        </tr>
                    </thead>
                    <tbody>
                        {sortedReviews && sortedReviews.length > 0 ?
                            sortedReviews?.map((review, index) => (
                                <tr key={review._id} className="text-center">
                                    <td>{review._id}</td>
                                    <td>{review?.reviewBy?.name}</td>
                                    <td>{review?.reviewProduct?.title}</td>
                                    <td>{review.comment}</td>
                                    <td>{review.rating}</td>
                                    <td>
                                        <Form>
                                            <Form.Check
                                                className='fs- 1'
                                                type="switch"
                                                id={`status-switch-${review._id}`}
                                                label={review.status}
                                                checked={review.status === 'Approved'}
                                                onChange={() => handleStatus(review._id)}
                                            />
                                        </Form>
                                    </td>

                                    {
                                        user.role == 'Admin' && (<td style={{ width: "120px" }}><Button variant='danger' onClick={() => handleDeleteReview(review._id)}><i className="fa-solid fa-trash fs-5"></i></Button></td>)
                                    }
                                </tr>
                            )) : <tr>
                                <td colSpan={7} className="text-center fs-3">
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

export default AdminReview
