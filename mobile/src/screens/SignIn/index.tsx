import React, { useRef, useCallback } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import { useKeyboard } from '@react-native-community/hooks';
import { useTransition } from '@react-spring/native';

import Icon from 'react-native-vector-icons/Feather';

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

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
  CreateAccountContainer,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}
import { useAuth } from '../../hooks/auth';

const SignIn: React.FC = () => {
  const { signIn, user } = useAuth();
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
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation() as NavigationProp<ParamListBase>;

  const signInFormHandler = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const scheme = Yup.object().shape({
        email: Yup.string()
          .required('Email obrigatório')
          .email('Email inválido'),
        password: Yup.string().required('Senha obrigatória'),
      });
      await scheme.validate(data, { abortEarly: false });
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        const errors = getValidationErrors(e);
        formRef.current?.setErrors(errors);
        return;
      }
      Alert.alert(
        'Ocorreu um erro!',
        'Errou ao autentica-lo verifique sua combinação email/senha',
      );
    }
  }, []);

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
          <Title>Faça seu logon</Title>

          <Form ref={formRef} onSubmit={signInFormHandler}>
            <Input
              name="email"
              placeholder="Email"
              keyboardType="email-address"
              autoCorrect={false}
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
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
              icon="lock"
            />
          </Form>
          <Button onPress={() => formRef.current?.submitForm()}>Entrar</Button>
          <ForgotPassword>
            <ForgotPasswordText>Esqueci a minha senha</ForgotPasswordText>
          </ForgotPassword>
        </Container>
        {transition(
          (style, item) =>
            !item && (
              <CreateAccountContainer style={style}>
                <CreateAccountButton
                  onPress={() => navigation.navigate('SignUp')}>
                  <Icon name="log-in" size={24} color="#ff9000" />
                  <CreateAccountButtonText>
                    Criar uma conta
                  </CreateAccountButtonText>
                </CreateAccountButton>
              </CreateAccountContainer>
            ),
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
