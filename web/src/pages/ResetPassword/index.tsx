import React, { useCallback, useRef, useState } from "react"
import * as Yup from "yup"
import { Form } from "@unform/web"
import { FormHandles } from "@unform/core"
import { Container, Content, Background } from "./styles"
import { FiLock } from "react-icons/fi"

import logoImg from "../../assets/logo.svg"

import Input from "../../components/Input"
import Button from "../../components/Button"

import getValidationErrors from "../../utils/getValidationErrors"
import { useToast } from "../../hooks/toast"
import { useHistory, useLocation } from "react-router-dom"
import api from "../../services/api"

interface ResetPasswordFormData {
  password: string
  password_confirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const history = useHistory()
  const location = useLocation()

  const { addToast } = useToast()

  const [loading, setLoading] = useState(false)

  const submitHandler = useCallback(
    async (data: ResetPasswordFormData) => {
      setLoading(true)
      try {
        formRef.current?.setErrors({})

        const scheme = Yup.object().shape({
          password: Yup.string().required("Senha obrigatória"),

          password_confirmation: Yup.string()
            .oneOf([Yup.ref("password"), null], "Confirmação incorreta")
            .required("Confirmação obrigatória")
        })
        await scheme.validate(data, { abortEarly: false })

        const { password, password_confirmation } = data

        const queryParams = new URLSearchParams(location.search)

        const token = queryParams.get("token")

        if (!token) {
          throw new Error()
        }

        await api.post("/password/reset", {
          password,
          password_confirmation,
          token
        })

        history.push("/")
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationErrors(e)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: "error",
          title: "Erro ao resetar senha",
          description: "Houve um errou ao resetar sua senha, tente novamente."
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, history, location.search]
  )
  return (
    <Container>
      <Content>
        <img src={logoImg} alt="Go Barber" />
        <Form ref={formRef} onSubmit={submitHandler}>
          <h1>Resetar senha</h1>
          <Input
            type="password"
            name="password"
            placeholder="Nova Senha"
            icon={FiLock}
            autoComplete="off"
          />
          <Input
            type="password"
            name="password_confirmation"
            placeholder="Confirmação da senha"
            icon={FiLock}
            autoComplete="off"
          />
          <Button loading={loading} disabled={loading} type="submit">
            Alterar senha
          </Button>
        </Form>
      </Content>
      <Background />
    </Container>
  )
}

export default ResetPassword
