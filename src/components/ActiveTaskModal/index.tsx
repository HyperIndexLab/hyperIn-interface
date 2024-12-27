import React, { useEffect, useState } from 'react'
// import twitterShare from '../../utils/twitterShare'
import fetchWrapper from '../../utils/fetch'
import { useWeb3React } from '@web3-react/core'
import TransactionPopup from '../../components/Popups/TransactionPopup';
import './index.css'
interface IStatus {
  is_bridge: boolean
  is_tweet: boolean
  is_claim: boolean
  is_claim_success: boolean
  txHash?: string
}

export default function ActiveTaskModal() {
  const { account } = useWeb3React() // 获取 account 状态
  const [showPopup, setShowPopup] = useState(false) // 新增状态以控制弹出框显示

  const [status, setStatus] = useState<IStatus | null>(null)
  const [isClaiming, setIsClaiming] = useState(false)
  useEffect(() => {
    if (!account) return
    fetchWrapper(`/api/gift/status/${account}`).then(res => {
      setStatus(res.data)
    })
  }, [])
  const handleClaim = () => {
    setIsClaiming(true)
    fetchWrapper(`/api/gift/claim/${account}`).then(res => {
      setStatus(res.data)
      setIsClaiming(false)
      if (res.data.is_claim_success) { // 检查是否成功
        setShowPopup(true) // 显示弹出框
      }
    })
  }

  const handleGotoBridge = () => {
    window.open('https://www.orbiter.finance/en?src_chain=42161&tgt_chain=177&src_token=ETH', '_blank')
  }

  if (!account) {
    return (
      <div className="active-task-modal" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="active-task-modal-header">
          <h2 className="active-task-modal-title">Complete the task and earn HSK tokens! 🎉</h2>
          <div className="active-task-modal-description">Please connect your wallet first</div>
        </div>
      </div>
    )
  }

  return (
    <div className="active-task-modal" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="active-task-modal-header">
        <h2 className="active-task-modal-title">Complete the task and earn HSK tokens! 🎉</h2>
        <div className="active-task-modal-description">
          users need to first connect via the Bridge platform, then claim their HSK tokens.
        </div>
      </div>
      <div className="active-task-modal-flow">Task Flow</div>
      <div className={`active-task-modal-step ${status?.is_bridge ? 'completed' : ''}`} id="step-1">
        <span>Task 1:Bridge</span>
        {status?.is_bridge ? (
          <button className="active-task-modal-step-button done-button">
            Done{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21.801 10A10 10 0 1 1 17 3.335" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </button>
        ) : (
          <button onClick={handleGotoBridge} className="active-task-modal-step-button">
            Go to Bridge
          </button>
        )}
      </div>

      <div className={`active-task-modal-step ${status?.is_claim_success ? 'completed' : ''}`}>
        <span>Task 2:Get Rewarded</span>
        {status?.is_claim_success ? (
          <button className="active-task-modal-step-button done-button">
            Claimed{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21.801 10A10 10 0 1 1 17 3.335" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </button>
        ) : (
          <button onClick={handleClaim} disabled={isClaiming} className="active-task-modal-step-button">
            {isClaiming ? 'Claiming...' : 'Claim'}
          </button>
        )}
        

 
      </div>
      <div>
        {showPopup &&status?.txHash && <TransactionPopup summary='Claimed Successfully 🎉' hash={status.txHash} success={status?.is_claim_success} />}
      </div>
      
    </div>
  )
}
