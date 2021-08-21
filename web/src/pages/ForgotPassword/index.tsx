import React, { useCallback, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';

import * as Yup from 'yup';

import { Container, Content, Background } from './styles';
import { FiArrowLeft, FiMail} from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string,
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)

  const submitHandler = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true)
      formRef.current?.setErrors({})
      
      const schema = Yup.object().shape({
        email: Yup
          .string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
      })
      await schema.validate(data, {
        abortEarly: false
      })

      await api.post('/password/forgot', {
        email: data.email,
      })

      addToast({
        title: 'Sucesso',
        description: 'Um email foi enviado com instruções para recuperar sua senha',
        type: 'success'
      })
    } catch (e) {
      if(e instanceof Yup.ValidationError){
        const errors = getValidationErrors(e)
        formRef.current?.setErrors(errors)
        return
      }
      addToast({
        title: 'Houve um erro',
        description: 'Houve um erro ao tentar recuperar sua senha, tente novamente',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [addToast])
  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="Go Barber" />
        <Form ref={formRef} onSubmit={submitHandler}>
          <h1>Recupere sua senha</h1>
          <Input name="email" placeholder="E-mail" icon={FiMail} autoComplete="off" />
          <Button loading={loading} disabled={loading} type="submit">Recuperar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft size={16} />
          Voltar para logon
        </Link>
      </Content>
    </Container>
  )
}

export default ForgotPassword
