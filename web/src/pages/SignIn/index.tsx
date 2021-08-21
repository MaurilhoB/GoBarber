import React, { useCallback, useRef, useState } from "react"
import * as Yup from "yup"
import { Form } from "@unform/web"
import { FormHandles } from "@unform/core"
import { Container, Content, Background } from "./styles"
import { FiLogIn, FiMail, FiLock } from "react-icons/fi"

import logoImg from "../../assets/logo.svg"

import Input from "../../components/Input"
import Button from "../../components/Button"

import getValidationErrors from "../../utils/getValidationErrors"
import { useAuth } from "../../hooks/auth"
import { useToast } from "../../hooks/toast"
import { Link } from "react-router-dom"

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn } = useAuth()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(false)

  const submitHandler = useCallback(
    async (data: SignInFormData) => {
      try {
        setLoading(true)
        formRef.current?.setErrors({})

        const scheme = Yup.object().shape({
          email: Yup.string()
            .required("Email obrigatório")
            .email("Email inválido"),
          password: Yup.string().required("Senha obrigatória")
        })
        await scheme.validate(data, { abortEarly: false })

        await signIn({
          email: data.email,
          password: data.password
        })
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationErrors(e)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: "error",
          title: "Ocorreu um erro!",
          description:
            "Errou ao autentica-lo verifique sua combinação email/senha"
        })
      } finally {
        setLoading(false)
      }
    },
    [signIn, addToast]
  )
  return (
    <Container>
      <Content>
        <img src={logoImg} alt="Go Barber" />
        <Form ref={formRef} onSubmit={submitHandler}>
          <h1>Faça seu logon</h1>
          <Input
            name="email"
            placeholder="E-mail"
            icon={FiMail}
            autoComplete="off"
          />
          <Input
            type="password"
            name="password"
            placeholder="Senha"
            icon={FiLock}
            autoComplete="off"
          />
          <Button loading={loading} disabled={loading} type="submit">
            Entrar
          </Button>
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </Form>

        <Link to="signup">
          <FiLogIn size={16} />
          Criar conta
        </Link>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn
