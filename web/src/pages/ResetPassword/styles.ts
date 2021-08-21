import styled, { keyframes } from 'styled-components';

import signInBackground from '../../assets/sign-in-background.png';

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`

const goToRight = keyframes`
from {
  opacity: 0;
  transform: translateX(-50px);
}
 to {
  opacity: 1;
  transform: translateX(0);
 }
`

const Content = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${goToRight} 1s ease;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color .2s;

      &:hover {
        color: #c3beba;
      }
    }
  }

  > a {
    color: #ff9000;
    text-decoration: none;
    display: flex;
    align-items: center;
    margin-top: 24px;
    transition: color .2s;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: #cc7300;
    }
  }
`

const Background = styled.div`
  flex: 1;
  background: url(${signInBackground}) no-repeat center;
  background-size: cover;
`

export { Container, Content, Background }
