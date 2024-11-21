import React, { useState } from 'react'
import styled from 'styled-components'
import { X } from 'react-feather'
import Modal from '../Modal'
import { ButtonConfirmed, ButtonGray } from '../Button'

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
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
  border-bottom: 1px solid ${({ theme }) => theme.bg3};
  display: flex;
  align-items: center;
`

const CloseIcon = styled.div`
  position: absolute;
  right: 24px;
  top: 16px;
  cursor: pointer;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`

const ModalBody = styled.div`
  padding: 24px;
`

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 12px;
  background: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  margin: 16px 0;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary1};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`

interface Props {
  isOpen: boolean
  onConfirm: () => void
  onDismiss: () => void
  priceImpact: string
  requireInput?: boolean
}

export const PriceImpactModal: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onDismiss,
  priceImpact,
  requireInput
}: Props) => {
  const [value, setValue] = useState('')

  const handleConfirm = () => {
    if (requireInput && value.toLowerCase() === 'confirm') {
      onConfirm()
    } else if (!requireInput) {
      onConfirm()
    }
    setValue('')
  }

  const handleDismiss = () => {
    setValue('')
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss}>
      <ModalWrapper>
        <CloseIcon onClick={handleDismiss}>
          <X size={18} />
        </CloseIcon>

        <ModalHeader>Price Impact Confirmation</ModalHeader>

        <ModalBody>
          <div>This swap has a price impact of at least {priceImpact}%.</div>
          {requireInput && (
            <>
              <div>Please type &quot;confirm&quot; to continue with this swap.</div>
              <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Type 'confirm'" autoFocus />
            </>
          )}
          <ButtonGroup>
            <ButtonGray onClick={handleDismiss}>Cancel</ButtonGray>
            <ButtonConfirmed onClick={handleConfirm} disabled={requireInput && value.toLowerCase() !== 'confirm'}>
              Confirm
            </ButtonConfirmed>
          </ButtonGroup>
        </ModalBody>
      </ModalWrapper>
    </Modal>
  )
}
