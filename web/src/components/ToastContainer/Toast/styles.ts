import styled, { css } from "styled-components"
import { animated } from "@react-spring/web"

interface ToastProps {
  type?: "info" | "success" | "error"
  $hasDescription: boolean
}

const toastTypeVariations = {
  info: css`
    background: #ebe8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `
}

export const Container = styled(animated.div)<ToastProps>`
  width: 360px;
  position: relative;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px 30px 16px 16px;
  display: flex;

  & + div {
    margin-top: 8px;
  }

  ${({ type }) => toastTypeVariations[type || "info"]}

  > svg {
    margin: 4px 12px 0 0;
  }
  div {
    flex: 1;

    strong {
      margin-bottom: 5px;
    }

    p {
      margin-top: 4px;
      font-size: 14px;
      line-height: 20px;
      opacity: 0.8;
    }
  }

  button {
    position: absolute;
    top: 20px;
    right: 16px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }

  ${({ $hasDescription }) =>
    !$hasDescription &&
    css`
      align-items: center;
      svg {
        margin-top: 0;
      }
    `}
`
