import React, { useCallback, useRef, useState } from "react"
import { FormHandles } from "@unform/core"
import { Form } from "@unform/web"
import { Link, useHistory } from "react-router-dom"

import * as Yup from "yup"

import { Container, Content, Background } from "./styles"
import { FiArrowLeft, FiMail, FiLock, FiUser } from "react-icons/fi"
import logoImg from "../../assets/logo.svg"

import Input from "../../components/Input"
import Button from "../../components/Button"
import getValidationErrors from "../../utils/getValidationErrors"
import { useToast } from "../../hooks/toast"

import api from "../../services/api"

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const [loading, setLoading] = useState(false)

  const submitHandler = useCallback(
    async (data: SignUpFormData) => {
      try {
        setLoading(true)
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
          password: Yup.string().min(6, "No minímo 6 digítos")
        })
        await schema.validate(data, {
          abortEarly: false
        })
        await api.post("users", {
          name: data.email,
          email: data.email,
          password: data.password
        })

        history.push("/")

        addToast({
          title: "Sucesso",
          description: "Usuário criado com sucesso, voce já pode fazer login",
          type: "success"
        })
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationErrors(e)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          title: "Houve um erro",
          description: "Erro ao criar usuário",
          type: "error"
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, history]
  )
  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="Go Barber" />
        <Form ref={formRef} onSubmit={submitHandler}>
          <h1>Faça seu cadastro</h1>
          <Input
            name="name"
            placeholder="Nome"
            icon={FiUser}
            autoComplete="off"
          />
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
          />
          <Button loading={loading} disabled={loading} type="submit">
            Cadastrar
          </Button>
        </Form>

        <Link to="/">
          <FiArrowLeft size={16} />
          Voltar para logon
        </Link>
      </Content>
    </Container>
  )
}

export default SignUp
