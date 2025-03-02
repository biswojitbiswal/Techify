import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Store/Auth';
import { BASE_URL } from '../../../config';
import { Button, Spinner } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '../Admin.css'

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function PieChart() {
    const [timeRange, setTimeRange] = useState('monthly');
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(false);

    const { authorization } = useAuth();

    const getOrderPieData = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/get-piedata/${timeRange}`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setPieData(data.chartData)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getOrderPieData()
    }, [timeRange]);

    const data = {
        labels: pieData.map(item => item.label),
        datasets: [
          {
            data: pieData.map(item => item.value),
            backgroundColor: ['#F44336', '#00BCD4', '#8BC34A',  '#795548'],
            hoverBackgroundColor: ['#F44336','#00BCD4', '#8BC34A', '#795548']
          },
        ],
      };
    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
    
          },
        },
      };

    return (
        <div className='chart-container d-flex flex-column' style={{width: "35%"}}>
            <div className='d-flex gap-2 justify-content-end'>
                <Button variant='outline-primary' onClick={() => setTimeRange('weekly')} active={timeRange === 'weekly'}>Weekly</Button>
                <Button variant='outline-primary' onClick={() => setTimeRange('monthly')} active={timeRange === 'monthly'}>Monthly</Button>
                <Button variant='outline-primary' onClick={() => setTimeRange('yearly')} active={timeRange === 'yearly'}>Yearly</Button>
            </div>
            <div className='h-100'>
                {
                    loading ? <Spinner animation="border" variant="primary" /> : <Doughnut data={data} options={options} />
                }
            </div>
        </div>
    )
}

export default PieChart
