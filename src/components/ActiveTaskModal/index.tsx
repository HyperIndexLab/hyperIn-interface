import React, { useEffect, useState } from 'react'
import twitterShare from '../../utils/twitterShare'
import fetchWrapper from '../../utils/fetch'

import './index.css'

interface IStatus {
	is_bridge: boolean
	is_tweet: boolean
	is_claim: boolean
	is_claim_success: boolean
}

export default function ActiveTaskModal() {
	const [status, setStatus] = useState<IStatus | null>(null)
	useEffect(() => {
		fetchWrapper('http://localhost:3000/api/activity/status?address=0x2b23d7D962CEB0C0e5a1780c3D1AeD6A5e5bfBbf', {useMock: true}).then(res => {
			setStatus(res.data)
		})
	}, [])

	return (
		<div className='active-task-modal' style={{display: 'flex', flexDirection: 'column'}}>
			<div className='active-task-modal-header'>
				<h2 className='active-task-modal-title'>
					Complete the task and earn HSK tokens! 🎉
				</h2>
				<div className='active-task-modal-description'>
					users need to first connect via the Bridge platform, then post a tweet to claim their HSK tokens.
				</div>
			</div>
			<div className="active-task-modal-flow">Task Flow</div>
			<div className={`active-task-modal-step ${status?.is_bridge ? 'completed' : ''}`} id="step-1">
				<span>Task 1: Quests 进行 Bridge</span>
				{status?.is_bridge ? <button className="active-task-modal-step-button">Done</button> : <button className="active-task-modal-step-button" disabled>bridge</button>}
			</div>
			<div className={`active-task-modal-step ${status?.is_tweet ? 'completed' : ''}`}>
				<span>Task 2: Quests 发布推文</span>
				{status?.is_tweet ? <button className="active-task-modal-step-button">Done</button> : <button className="active-task-modal-step-button" onClick={() => twitterShare('Trade on KiloEx and enjoy up to 55%25 cashback!')}>分享</button>}	
			</div>
		
			<div className={`active-task-modal-step ${status?.is_claim_success ? 'completed' : ''}`}>
				<span>领取奖励</span>
				{status?.is_claim_success ? <button className="active-task-modal-step-button">已领取</button> : <button className="active-task-modal-step-button">领取</button>}
			</div>
		</div>
	)
}