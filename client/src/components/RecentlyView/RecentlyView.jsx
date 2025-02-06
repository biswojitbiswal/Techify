import React, { useEffect, useState } from 'react'
import {useAuth} from '../../Store/Auth'
import { BASE_URL } from '../../../config';
import { Card } from 'antd';
import { Spinner } from 'react-bootstrap';
import './RecentlyView.css'
import { Link } from 'react-router-dom';

const { Meta } = Card;

function RecentlyView() {
    const [recently, setRecently] = useState([]);

    const {authorization} = useAuth();
    
    const getRecenlyViewProduct = async() => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/products/recently-views`, {
                method: "GET",
                headers: {
                    Authorization : authorization,
                }
            });

            const data = await response.json();
            // console.log(data);

            if(response.ok){
                setRecently(data);
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        getRecenlyViewProduct();
    }, []);

  return (
    <div id='recently-view-page'>
        <h3 className='text-primary'>Recently View</h3>
      <div className="recently-view-container">
      {
        recently ? recently.map((item) => {
            return <Link className='text-decoration-none' to={`/product/${item._id}`} key={item._id}><Card
            hoverable
            style={{ width: 300, height: 400 }}
            cover={<img alt="example" style={{height: '250px'}} src={item.images[0]} />}
          >
            <Meta title={item.title} description={item.description} />
          </Card></Link>
        }) : <Spinner variant='primary' size='lg' />
      }
      </div>
    </div>
  )
}

export default RecentlyView
