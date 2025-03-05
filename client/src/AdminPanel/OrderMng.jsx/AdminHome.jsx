import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Store/Auth'
import AdminOrder from './AdminOrder';
import { Card } from 'react-bootstrap';
import '../Admin.css'
import { BASE_URL } from '../../../config';
import OrderChart from './OrderChart';

function AdminHome() {
  const [analytic, setAnalytic] = useState();

  const { user, authorization } = useAuth();

  const getOrderAnalytics = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/techify/admin/get-analytics`, {
        method: "GET",
        headers: {
          Authorization: authorization,
        }
      })

      const data = await response.json()
      // console.log(data);

      if (response.ok) {
        setAnalytic(data[0]);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOrderAnalytics();
  }, []);
  return (
    <>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        {
          user.role === 'Admin' ? <div className='w-100 px-5 py-3'>
            <div className="card-analytics gap-2 w-100 d-flex justify-content-between">
              <Card className='custom-card' style={{ minWidth: "260px" }}>
                <Card.Body>
                  <h5 className='text-secondary fs-5'>Total Revenue</h5>
                  <h4 className='text-success'>₹{analytic?.totalRevenue?.toLocaleString()}</h4>
                </Card.Body>
              </Card>
              <Card className='custom-card' style={{ minWidth: "260px" }}>
                <Card.Body>
                  <h5 className='text-secondary fs-5'>Total Orders</h5>
                  <h4 className='text-primary'>{String(analytic?.totalOrder || 0).padStart(2, '0')}</h4>
                </Card.Body>
              </Card>
              <Card className='custom-card' style={{ minWidth: "260px" }}>
                <Card.Body>
                  <h5 className='text-secondary fs-5'>Confirmed Orders</h5>
                  <h4 className='text-warning'>{String(analytic?.totalConfirmed || 0).padStart(2, '0')}</h4>
                </Card.Body>
              </Card>
              <Card className='custom-card' style={{ minWidth: "260px" }}>
                <Card.Body>
                  <h5 className='text-secondary fs-5'>Completed Orders</h5>
                  <h4 className='text-success'>{String(analytic?.totalCompleted || 0).padStart(2, 0)}</h4>
                </Card.Body>
              </Card>
              <Card className='custom-card' style={{ minWidth: "260px" }} >
                <Card.Body>
                  <h5 className='text-secondary fs-5'>Canceled Orders</h5>
                  <h4 className='text-danger'>{String(analytic?.
                    totalCanceled || 0).padStart(2, 0)}</h4>
                </Card.Body>
              </Card>
            </div>

            <OrderChart />
          </div> : ""
        }
        <AdminOrder />
      </div>
    </>
  )
}

export default AdminHome

