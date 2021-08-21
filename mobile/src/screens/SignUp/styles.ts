import styled from 'styled-components/native';
import { animated } from '@react-spring/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px 80px;
  background: #312e38;
`;
export const Title = styled.Text`
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  margin: 64px 0px 24px;
`;

export const BackToSignInContainer = styled(animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;
export const BackToSignIn = styled.TouchableOpacity`
  background: #312e38;
  padding: 16px;
  border-top-width: 1px;
  border-color: #232129;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const BackToSignInText = styled.Text`
  color: #fff;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
  margin-left: 16px;
`;
