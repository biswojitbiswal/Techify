import React, { useState, useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { BASE_URL } from '../../../config';
import { useAuth } from '../../Store/Auth';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "chartjs-adapter-date-fns";
import '../Admin.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, TimeScale, LineElement, Title, Tooltip, Legend);


function LineChart() {
    const [timeRange, setTimeRange] = useState('monthly');
    const [lineData, setLineData] = useState([]);
    const [loading, setLoading] = useState(false);

    const { authorization } = useAuth();

    const getUserLineData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${BASE_URL}/api/techify/admin/get-users-linechart/${timeRange}`, {
                    method: "GET",
                    headers: {
                        Authorization: authorization
                    }
                })
    
                const data = await response.json();
                // console.log(data.chartData);
    
                if(response.ok){
                    setLineData(data.chartData)
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        } 

        useEffect(() => {
            getUserLineData();
        }, [timeRange])

        const data = {
            datasets: [
              {
                label: 'Users',
                data: lineData.map(item => ({
                  x: new Date(item.x),
                  y: item.y,
                })),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
              },
            ],
          };
        
          const options = {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                enabled: true,
              },
            },
            scales: {
              x: {
                type: "time",
                time: {
                  unit: timeRange === 'weekly' ? 'day' : timeRange === 'monthly' ? 'month' : 'year',
                },
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Users",
                },
              },
            },
          };
    return (
        <div className='chart-container d-flex flex-column' style={{ width: "70%",}}>
            <div className="time-range-button d-flex gap-2 justify-content-end">
                <Button variant='outline-primary' onClick={() => setTimeRange('weekly')} active={timeRange === 'weekly'}>Weekly</Button>
                <Button variant='outline-primary' onClick={() => setTimeRange('monthly')} active={timeRange === 'monthly'}>Monthly</Button>
                <Button variant='outline-primary' onClick={() => setTimeRange('yearly')} active={timeRange === 'yearly'}>Yearly</Button>
            </div>
            <div className="line-chart w-100">
                {
                    loading ? <Spinner animation="border" variant="primary" /> : <Line data={data} options={options} />
                }
            </div>
        </div>
    )
}

export default LineChart
