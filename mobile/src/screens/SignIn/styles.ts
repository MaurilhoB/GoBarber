import styled from 'styled-components/native';
import { animated } from '@react-spring/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  background: #312e38;
`;
export const Title = styled.Text`
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  margin: 64px 0px 24px;
`;
export const ForgotPassword = styled.TouchableOpacity`
  margin-top: 24px;
  margin-bottom: 32px;
`;

export const ForgotPasswordText = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;

export const CreateAccountContainer = styled(animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const CreateAccountButton = styled(TouchableOpacity)`
  padding: 16px;
  border-top-width: 1px;
  border-color: #232129;
  background: #312e38;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CreateAccountButtonText = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
  margin-left: 16px;
`;
