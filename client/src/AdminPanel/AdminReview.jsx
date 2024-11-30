import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useAuth } from '../Store/Auth';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';


function AdminReview() {
    const [reviews, setReviews] = useState([]);
    const [check, setCheck] = useState(false);

    const { authorization, user, isLoading } = useAuth();

    if (isLoading) {
        return <Spinner animation="border" />;
    }

    if (!user || (user.role !== 'Admin' && user.role !== 'Moderator')) {
        return <Navigate to="/admin" replace />
    }

    const handleStatus = async(id) => {
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/admin/status/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();
            console.log(data);
            
            if(response.ok){
                toast.success("Approved!");
                getAllReviews()
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getAllReviews = async () => {
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/admin/get/reviews`, {
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

    useEffect(() => {
        getAllReviews();
    }, []);

    const pendingReviews = reviews?.filter(review => review.status === 'Pending');
    const approvedReviews = reviews?.filter(review => review.status === 'Approved');

    // console.log(pendingReviews);
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
                            <th>Edit</th>
                            <th>Delete</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            pendingReviews.map((review, index) => {
                                return <tr key={review._id} className='text-center'>
                                    <td>{index + 1}</td>
                                    <td>{review.reviewBy.name}</td>
                                    <td>{review.reviewProduct.title}</td>
                                    <td>{review.comment}</td>
                                    <td>{review.rating}</td>
                                    <td>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                label={review.status}
                                                onClick={() => handleStatus(review._id)}
                                            />
                                        </Form>
                                    </td>
                                    <td><Link className="btn btn-primary">Edit <span><i className="fa-solid fa-pencil ms-2"></i></span></Link></td>
                                    <td><Button variant='danger'>Delete<span><i className="fa-solid fa-trash ms-2"></i></span></Button></td>
                                </tr>
                            })
                        }
                        {
                            approvedReviews?.map((review, index) => {
                                return <tr key={review._id} className='text-center'>
                                    <td>{index + 1}</td>
                                    <td>{review.reviewBy.name}</td>
                                    <td>{review.reviewProduct.title}</td>
                                    <td>{review.comment}</td>
                                    <td>{review.rating}</td>
                                    <td>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                label={review.status}
                                                readOnly
                                                checked={review.status === 'Approved'}
                                            />
                                        </Form>
                                    </td>
                                    <td><Link className="btn btn-primary">Edit <span><i className="fa-solid fa-pencil ms-2"></i></span></Link></td>
                                    <td><Button variant='danger'>Delete<span><i className="fa-solid fa-trash ms-2"></i></span></Button></td>
                                </tr>
                            })
                        }


                    </tbody>
                </Table>
            </section>
        </>
    )
}

export default AdminReview
