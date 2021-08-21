import styled from "styled-components"

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const Content = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: -93px;

  form {
    margin: 40px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }
  }
`
const Header = styled.div`
  width: 100%;
  height: 144px;
  background: #232129;
  display: flex;
  align-items: center;
  padding: 0 15%;

  a > svg {
    width: 24px;
    height: 24px;
    color: #999591;
  }
`
const AvatarInput = styled.div`
  position: relative;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
  label {
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: #ff9000;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    &:hover {
      background: #cc7300;
    }
  }
`

export { Container, Content, Header, AvatarInput }
