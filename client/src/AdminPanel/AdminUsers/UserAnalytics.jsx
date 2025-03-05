import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Store/Auth'
import { BASE_URL } from '../../../config'
import { Card, Spinner } from 'react-bootstrap'

function UserAnalytics() {
    const [analytic, setAnalytic] = useState({})

    const {user, authorization} = useAuth();

    const getUserAnalytic = async() => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/get-users-analytic`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();
            // console.log(data);

            if(response.ok){
                setAnalytic(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserAnalytic()
    }, [])

    return (
        <div>
            {
                user.role === 'Admin' ? <div className='h-100'>
                    <div className="card-analytics gap-2 h-100 d-flex flex-column justify-content-between">
                        <Card className='custom-card' style={{ minWidth: "350px", minHeight: "125px" }}>
                            <Card.Body>
                                <h5 className='text-secondary fs-5'>Total User</h5>
                                {
                                    analytic[0]?.totalUsers ?  <h4 className='text-primary'>{String(analytic[0]?.totalUsers || 0).padStart(2, '0')}</h4> : <Spinner animation="border" size='sm' variant="primary" />
                                }
                            </Card.Body>
                        </Card>
                        <Card className='custom-card' style={{ minWidth: "350px", minHeight: "125px"  }}>
                            <Card.Body>
                                <h5 className='text-secondary fs-5'>New User</h5>
                                {
                                    analytic[0]?.totalNewUser ? <h4 className='text-success'>{String(analytic[0]?.totalNewUser || 0).padStart(2, '0')}</h4> : <Spinner animation="border" size='sm' variant="primary" />
                                }
                                
                            </Card.Body>
                        </Card>
                        <Card className='custom-card' style={{ minWidth: "350px", minHeight: "125px" }}>
                            <Card.Body>
                                <h5 className='text-primary-emphasis fs-5'>Active User</h5>
                                {
                                    analytic[0]?.totalActiveUser ? <h4 className='text-warning'>{String(analytic[0]?.totalActiveUser || 0).padStart(2, '0')}</h4> : <Spinner animation="border" size='sm' variant="primary" />
                                }
                            </Card.Body>
                        </Card>
                    </div>
                </div> : ""
            }
        </div>
    )
}

export default UserAnalytics
