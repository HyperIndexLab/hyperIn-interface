import React from 'react'
import styled from 'styled-components'
import { AlertTriangle } from 'react-feather'
import Modal from '../Modal'
import { ButtonPrimary, ButtonSecondary } from '../Button'

interface PriceImpactConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onDismiss: () => void
  priceImpact: string
  requireExactConfirmation?: boolean
}

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg1};
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  position: relative;
`

const ModalHeader = styled.div`
  padding: 16px 24px;
  height: 48px;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.bg3};
  display: flex;
  align-items: center;
`

const ModalBody = styled.div`
  padding: 24px;
`

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  svg {
    color: ${({ theme }) => theme.red1};
  }
  span.highlight {
    color: ${({ theme }) => theme.red1};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
`

const StyledButtonPrimary = styled(ButtonPrimary)`
  flex: 1;
  height: 48px;
  background: ${({ theme }) => theme.primary1};
  color: white;
  border-radius: 12px;
`

const StyledButtonSecondary = styled(ButtonSecondary)`
  flex: 1;
  height: 48px;
  background: ${({ theme }) => theme.bg3};
  color: white;
  border-radius: 12px;
`

export default function PriceImpactConfirmModal({
  isOpen,
  onConfirm,
  onDismiss,
  priceImpact
}: PriceImpactConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalWrapper>
        <ModalHeader>Price Impact Warning</ModalHeader>

        <ModalBody>
          <WarningMessage>
            <AlertTriangle size={20} />
            <div>
              This swap has a price impact of <span className="highlight">at least {priceImpact}%</span>
            </div>
          </WarningMessage>

          <ButtonGroup>
            <StyledButtonSecondary onClick={onDismiss}>Cancel</StyledButtonSecondary>
            <StyledButtonPrimary onClick={onConfirm}>Confirm Swap</StyledButtonPrimary>
          </ButtonGroup>
        </ModalBody>
      </ModalWrapper>
    </Modal>
  )
}
