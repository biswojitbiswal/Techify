import React from 'react'
import LineChart from './LineChart'
import PieChart from './PieChart'

function OrderChart() {
  return (
    <div className='w-100 d-flex gap-3 px-5 py-3'>
        <LineChart />
        <PieChart />
    </div>
  )
}

export default OrderChart
