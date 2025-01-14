import React, { useRef, useContext, useState } from 'react'
import { Settings, X } from 'react-feather'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import {
  useUserSlippageTolerance,
  useExpertModeManager,
  useUserDeadline,
  useDarkModeManager
} from '../../state/user/hooks'
import TransactionSettings from '../TransactionSettings'
import { RowFixed, RowBetween } from '../Row'
import { TYPE } from '../../theme'
import QuestionHelper from '../QuestionHelper'
import Toggle from '../Toggle'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import { ButtonError } from '../Button'
import { useSettingsMenuOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { Text } from 'rebass'
import Modal from '../Modal'
import ConfirmInputModal from './ConfirmInputModal'

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

// const StyledCloseIcon = styled(X)`
//   height: 20px;
//   width: 20px;
//   :hover {
//     cursor: pointer;
//   }

//   > * {
//     stroke: ${({ theme }) => theme.text1};
//   }
// `

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`
const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);

  border: 1px solid ${({ theme }) => theme.bg3};

  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 18.125rem;
    right: -46px;
  `};
`

// const Break = styled.div`
//   width: 100%;
//   height: 1px;
//   background-color: ${({ theme }) => theme.bg3};
//   margin: 1rem 0;
// `

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

const ModalBody = styled.div`
  padding: 24px;
  font-weight: 500;
  line-height: 1.5;
`

const WarningText = styled.div`
  color: ${({ theme }) => theme.red1};
  font-weight: 600;
  text-align: center;
  margin: 0 24px;
`

const CloseButton = styled.div`
  position: absolute;
  right: 24px;
  top: 16px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`

const ConfirmButton = styled(ButtonError)`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: ${({ theme }) => theme.red1};
  transition: all 0.2s ease;
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

const StyledButton = styled(ConfirmButton)`
  max-width: 320px;
  margin: 24px auto;
`

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useSettingsMenuOpen()
  const toggle = useToggleSettingsMenu()

  const theme = useContext(ThemeContext)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [deadline, setDeadline] = useUserDeadline()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [darkMode, toggleDarkMode] = useDarkModeManager()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showInputModal, setShowInputModal] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
        <ModalWrapper>
          <CloseButton onClick={() => setShowConfirmation(false)}>
            <X size={18} />
          </CloseButton>
          <ModalHeader> Enable Expert Mode </ModalHeader>

          <ModalBody>
            <strong>
              Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result in
              bad rates and lost funds.
            </strong>
          </ModalBody>

          <WarningText>
            <strong>ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.</strong>
          </WarningText>

          <StyledButton error={true} onClick={() => setShowInputModal(true)}>
            Turn On Expert Mode
          </StyledButton>
        </ModalWrapper>
      </Modal>

      <ConfirmInputModal
        isOpen={showInputModal}
        onConfirm={value => {
          if (value === 'confirm') {
            toggleExpertMode()
            setShowConfirmation(false)
          }
          setShowInputModal(false)
        }}
        onDismiss={() => setShowInputModal(false)}
      />

      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon />
        {expertMode && (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        )}
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              Transaction Settings
            </Text>
            <TransactionSettings
              rawSlippage={userSlippageTolerance}
              setRawSlippage={setUserslippageTolerance}
              deadline={deadline}
              setDeadline={setDeadline}
            />
            <Text fontWeight={600} fontSize={14}>
              Interface Settings
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  Toggle Expert Mode
                </TYPE.black>
                <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
              </RowFixed>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode()
                        setShowConfirmation(false)
                      }
                    : () => {
                        toggle()
                        setShowConfirmation(true)
                      }
                }
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  Toggle Dark Mode
                </TYPE.black>
              </RowFixed>
              <Toggle isActive={darkMode} toggle={toggleDarkMode} />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
