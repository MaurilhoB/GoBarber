import React, { useRef, useCallback } from 'react';
import { useTransition } from '@react-spring/native';

import Icon from 'react-native-vector-icons/Feather';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';

import logoImage from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/core';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText,
  BackToSignInContainer,
} from './styles';

import { useKeyboard } from '@react-native-community/hooks';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = ({}) => {
  const { keyboardShown } = useKeyboard();

  const transition = useTransition(keyboardShown, {
    from: {
      translateX: 150,
    },
    enter: {
      translateX: 0,
      opacity: 1,
    },
    leave: {
      translateX: -120,
      opacity: 0,
    },
  });

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation() as NavigationProp<ParamListBase>;

  const signUpFormHandler = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No minímo 6 digítos'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        await api.post('users', {
          name: data.name,
          email: data.email,
          password: data.password,
        });

        navigation.goBack();

        Alert.alert(
          'Sucesso',
          'Usuário criado com sucesso, voce já pode fazer login',
        );
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationErrors(e);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert('Houve um erro', 'Erro ao criar usuário');
      }
    },
    [navigation],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
        }}>
        <Container>
          <Image source={logoImage} accessibilityLabel="Logotipo Go Barber" />
          <Title>Crie sua conta</Title>
          <Form ref={formRef} onSubmit={signUpFormHandler}>
            <Input
              name="name"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
              blurOnSubmit={false}
              icon="user"
            />
            <Input
              ref={emailInputRef}
              name="email"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
              blurOnSubmit={false}
              icon="mail"
            />
            <Input
              ref={passwordInputRef}
              name="password"
              placeholder="Senha"
              autoCapitalize="none"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
              icon="lock"
            />
          </Form>
          <Button onPress={() => formRef.current?.submitForm()}>
            Cadastrar
          </Button>
        </Container>
        {transition(
          (style, item) =>
            !item && (
              <BackToSignInContainer style={style}>
                <BackToSignIn onPress={() => navigation.goBack()}>
                  <Icon name="arrow-left" size={24} color="#fff" />
                  <BackToSignInText>Voltar para logon</BackToSignInText>
                </BackToSignIn>
              </BackToSignInContainer>
            ),
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
