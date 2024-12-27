import React from 'react'
import ActiveTaskModal from '../../components/ActiveTaskModal'
import './index.css'

export default function Activity() {
  return (
    <div className="activity-page">
      {/* <h1>Task Center</h1> */}
      <ActiveTaskModal />
    </div>
  )
}
