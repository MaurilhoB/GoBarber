import React, { useRef, useCallback } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

import * as Yup from 'yup';

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

import { useAuth } from '../../hooks/auth';

import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
}

const Profile: React.FC = ({}) => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const navigation = useNavigation() as NavigationProp<ParamListBase>;

  const { user, updateUser } = useAuth();

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),

          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: string) => !!val,
            then: Yup.string()
              .required('Campo obrigatório')
              .min(6, 'Minimo 6 caracteres'),
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: (val: string) => !!val,
            then: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Confirmação incorreta')
              .required('Confirmação obrigatória'),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, old_password } = data;

        const formData = {
          name,
          email,
          ...(old_password ? data : {}),
        };

        const response = await api.put('/profile/update', formData);

        updateUser(response.data);

        navigation.goBack();

        Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationErrors(e);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Houve um erro',
          'Erro ao atualizar perfil, tente novamente',
        );
      }
    },
    [navigation],
  );

  const handleUpdateAvatar = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Erro ao atualizar seu avatar');
          return;
        }

        const data = new FormData();

        if (response.assets && response.assets.length > 0) {
          const { type, fileName, uri } = response.assets[0];

          data.append('avatar', {
            type,
            uri,
            name: fileName,
          });

          api.patch('/users/avatar', data).then(response => {
            updateUser(response.data);
          });
        }
      },
    );
  }, []);

  const handleGoBack = useCallback(
    () => navigation.goBack(),
    [navigation.goBack],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Container>
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>
          <UserAvatarButton onPress={handleUpdateAvatar}>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>
          <Title>Meu perfil</Title>
          <Form
            ref={formRef}
            initialData={{ name: user.name, email: user.email }}
            onSubmit={handleUpdateProfile}>
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
                oldPasswordInputRef.current?.focus();
              }}
              blurOnSubmit={false}
              icon="mail"
            />
            <Input
              containerStyle={{ marginTop: 16 }}
              ref={oldPasswordInputRef}
              name="old_password"
              placeholder="Senha atual"
              autoCapitalize="none"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
              blurOnSubmit={false}
              icon="lock"
            />
            <Input
              ref={passwordInputRef}
              name="password"
              placeholder="Nova senha"
              autoCapitalize="none"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordConfirmationInputRef.current?.focus();
              }}
              blurOnSubmit={false}
              icon="lock"
            />
            <Input
              ref={passwordConfirmationInputRef}
              name="password_confirmation"
              placeholder="Confirmar senha"
              autoCapitalize="none"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
              icon="lock"
            />
          </Form>
          <Button onPress={() => formRef.current?.submitForm()}>
            Confirmar mudanças
          </Button>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
