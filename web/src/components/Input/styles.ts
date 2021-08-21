import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip'

interface ContainerProps {
  isFocused: boolean
  isFilled: boolean
  hasError: boolean
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  width: 100%;
  padding: 0 16px;
  color: #666360;
  display: flex;
  align-items: center;
  
  ${({hasError}) => (
    hasError && css`
    border-color: #c53030;
  `)}
  
  ${({isFocused}) => (
    isFocused && css`
    color: #ff9000;
    border-color: #ff9000;
  `)}

  ${({isFilled}) => (
    isFilled && css`
    color: #ff9000;
  `)}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    padding: 16px 0px;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }
  svg {
    margin-right: 16px;
  }
  & + div {
    margin-top: 10px;
  }
`
export const Error = styled(Tooltip)`
  margin-left: 16px;
  height: 20px;

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }

  svg {
    margin: 0
  }
`
