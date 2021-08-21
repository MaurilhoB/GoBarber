import React, { ChangeEvent, useCallback, useRef, useState } from "react"
import { FormHandles } from "@unform/core"
import { Form } from "@unform/web"
import { Link, useHistory } from "react-router-dom"

import * as Yup from "yup"

import { Container, Content, Header, AvatarInput } from "./styles"
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from "react-icons/fi"

import Input from "../../components/Input"
import Button from "../../components/Button"
import getValidationErrors from "../../utils/getValidationErrors"
import { useToast } from "../../hooks/toast"

import api from "../../services/api"
import { useAuth } from "../../hooks/auth"

interface ProfileFormData {
  name: string
  email: string
  password: string
  old_password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const { user, updateUser } = useAuth()

  const [loading, setLoading] = useState(false)

  const submitHandler = useCallback(
    async (data: ProfileFormData) => {
      try {
        setLoading(true)
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),

          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            is: (val: string) => !!val,
            then: Yup.string()
              .required("Campo obrigatório")
              .min(6, "Minimo 6 caracteres")
          }),
          password_confirmation: Yup.string().when("old_password", {
            is: (val: string) => !!val,
            then: Yup.string()
              .oneOf([Yup.ref("password"), null], "Confirmação incorreta")
              .required("Confirmação obrigatória")
          })
        })
        await schema.validate(data, {
          abortEarly: false
        })

        const { name, email, old_password } = data

        const formData = {
          name,
          email,
          ...(old_password ? data : {})
        }

        const response = await api.put("/profile/update", formData)

        updateUser(response.data)

        history.push("/")

        addToast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso",
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
          description: "Erro ao atualizar perfil, tente novamente",
          type: "error"
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, history, updateUser]
  )

  const avatarChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const avatar = e.target.files[0]
        const data = new FormData()

        data.append("avatar", avatar)

        api.patch("/users/avatar", data).then(response => {
          updateUser(response.data)
        })
      }
    },
    [updateUser]
  )
  return (
    <Container>
      <Header>
        <Link to="/">
          <FiArrowLeft />
        </Link>
      </Header>
      <Content>
        <AvatarInput>
          <img src={user.avatar_url} alt={user.name} />
          <label htmlFor="avatar">
            <FiCamera />
            <input
              onChange={avatarChangeHandler}
              type="file"
              id="avatar"
            ></input>
          </label>
        </AvatarInput>
        <Form
          ref={formRef}
          onSubmit={submitHandler}
          initialData={{
            name: user.name,
            email: user.email
          }}
        >
          <h1>Seu perfil</h1>
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
            containerStyle={{ marginTop: 24 }}
            type="password"
            name="old_password"
            placeholder="Senha atual"
            icon={FiLock}
          />
          <Input
            type="password"
            name="password"
            placeholder="Nova senha"
            icon={FiLock}
          />
          <Input
            type="password"
            name="password_confirmation"
            placeholder="Confirmar senha"
            icon={FiLock}
          />
          <Button loading={loading} disabled={loading} type="submit">
            Confirmar mudanças
          </Button>
        </Form>
      </Content>
    </Container>
  )
}

export default Profile
