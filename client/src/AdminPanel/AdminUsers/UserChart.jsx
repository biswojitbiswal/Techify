import React from 'react'
import LineChart from './LineChart'
import UserAnalytics from './UserAnalytics';

function UserChart() {
  return (
    <div className='w-100 d-flex gap-5 py-3'>
      <UserAnalytics />
      <LineChart />
    </div>
  )
}

export default UserChart
