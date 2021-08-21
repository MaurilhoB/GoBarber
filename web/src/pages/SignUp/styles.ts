import styled, { keyframes } from 'styled-components';

import signUpBackground from '../../assets/sign-up-background.png';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;
`

const goToLeft = keyframes`
from {
  opacity: 0;
  transform: translateX(50px);
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
  animation: ${goToLeft} 1s ease;

  img {
    margin-top: 40px;
  }

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
    margin: 24px 0px;
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
  background: url(${signUpBackground}) no-repeat center;
  background-size: cover;
`

export { Container, Content, Background }
