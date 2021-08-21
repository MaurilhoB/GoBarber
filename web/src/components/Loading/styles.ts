import styled, { keyframes } from "styled-components"

const ellipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`
const ellipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`
const ellipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`

export const Container = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 20px;

  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  div:nth-child(1) {
    left: 8px;
    animation: ${ellipsis1} 0.6s infinite;
  }
  div:nth-child(2) {
    left: 8px;
    animation: ${ellipsis2} 0.6s infinite;
  }
  div:nth-child(3) {
    left: 32px;
    animation: ${ellipsis2} 0.6s infinite;
  }
  div:nth-child(4) {
    left: 56px;
    animation: ${ellipsis3} 0.6s infinite;
  }
`
