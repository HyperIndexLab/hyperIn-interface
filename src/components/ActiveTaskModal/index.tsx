import React, { useEffect, useState } from 'react'
import fetchWrapper from '../../utils/fetch'
import { useWeb3React } from '@web3-react/core'
import TransactionPopup from '../../components/Popups/TransactionPopup'
import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IStatus {
  is_bridge: boolean
  is_tweet: boolean
  is_claim: boolean
  is_claim_success: boolean
  txHash?: string
}

const TaskModal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
`

const TaskStep = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 20px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.bg3 : theme.bg2)};
  border-radius: 12px;
  box-shadow: ${({ disabled }) => (disabled ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.1)')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

const CheckBox = styled.div<{ completed: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${({ completed, theme }) => (completed ? theme.primary1 : theme.bg4)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
`

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.primary1};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${({ theme }) => theme.primary2};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.bg3};
    cursor: not-allowed;
  }
`

export default function ActiveTaskModal() {
  const { account } = useWeb3React()
  const [showPopup, setShowPopup] = useState(false)
  const [status, setStatus] = useState<IStatus | null>(null)
  const [isClaiming, setIsClaiming] = useState(false)

  useEffect(() => {
    if (!account) return
    fetchWrapper(`/api/gift/status/${account}`).then(res => {
      setStatus(res.data)
    })
  }, [account])

  const handleClaim = () => {
    setIsClaiming(true)
    fetchWrapper(`/api/gift/claim/${account}`).then(res => {
      setStatus(res.data)
      setIsClaiming(false)
      if (res.message.data.is_claim_success) {
        // 检查是否成功
        setShowPopup(true) // 显示弹出框
      }
    })
  }

  const handleGotoBridge = (url: string) => {
    window.open(url, '_blank')
  }

  if (!account) {
    return (
      <TaskModal>
        <h2>Complete the task and earn HSK tokens! 🎉</h2>
        <div>Please connect your wallet first</div>
      </TaskModal>
    )
  }

  return (
    <TaskModal>
      <h2>Complete the task and earn HSK tokens! 🎉</h2>
      <div>users need to first connect via the Bridge platform, then claim their HSK tokens.</div>
      <h3>Task Flow</h3>
      <TaskStep>
        <span>Task 1:Bridge</span>
        {status?.is_bridge ? (
          <CheckBox completed>✓</CheckBox>
        ) : (
          <>
            <StyledButton
              onClick={() =>
                handleGotoBridge('https://www.orbiter.finance/en?src_chain=42161&tgt_chain=177&src_token=ETH')
              }
            >
              Go to Orbiter
            </StyledButton>
            <StyledButton onClick={() => handleGotoBridge('https://owlto.finance/')}>Go to Owlto</StyledButton>
          </>
        )}
      </TaskStep>

      <TaskStep disabled={!status?.is_bridge}>
        <span>Task 2:Get Rewarded</span>
        {status?.is_claim_success ? (
          <CheckBox completed>✓</CheckBox>
        ) : (
          <StyledButton onClick={handleClaim} disabled={isClaiming}>
            {isClaiming ? 'Claiming...' : 'Claim'}
          </StyledButton>
        )}
      </TaskStep>
      {showPopup && status?.txHash && (
        <TransactionPopup summary="Claimed Successfully 🎉" hash={status.txHash} success={status?.is_claim_success} />
      )}
    </TaskModal>
  )
}
