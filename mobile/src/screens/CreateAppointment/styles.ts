import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { IProvider } from '.';
import { RectButton } from 'react-native-gesture-handler';

interface ISeparatorProps {
  width?: number;
  height?: number;
}
interface IProviderContainerProps {
  selected: boolean;
}
interface IProviderNameProps {
  selected: boolean;
}

interface IHourProps {
  available: boolean;
  selected: boolean;
}

interface IHourTextProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const Content = styled.ScrollView``;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(
  FlatList as new () => FlatList<IProvider>,
)``;

export const Separator = styled.View<ISeparatorProps>`
  width: ${({ width }) => (width ? `${width}px` : '0px')};
  height: ${({ height }) => (height ? `${height}px` : '0px')};
`;

export const ProviderContainer = styled(RectButton)<IProviderContainerProps>`
  background: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};
  border-radius: 10px;
  padding: 8px 12px;
  flex-direction: row;
  align-items: center;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text<IProviderNameProps>`
  color: ${({ selected }) => (selected ? '#232129' : '#f4ede8')};
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  margin-left: 8px;
`;

export const Calendar = styled.View``;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  color: #f4ede8;
  margin: 0 24px 24px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  height: 46px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background: #ff9000;
  margin: 0 24px;
`;

export const OpenDatePickerButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #232129;
  font-size: 16px;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: { paddingHorizontal: 24 },
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin: 0 24px 12px;
`;

export const Hour = styled(RectButton)<IHourProps>`
  background: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};
  opacity: ${({ available }) => (available ? 1 : 0.3)};
  padding: 12px;
  border-radius: 10px;
  margin-right: 8px;
`;

export const HourText = styled.Text<IHourTextProps>`
  color: ${({ selected }) => (selected ? '#232129' : '#f4ede8')};
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const CreateAppointmentButton = styled(RectButton)`
  height: 50px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background: #ff9000;
  margin: 0 24px 24px;
`;

export const CreateAppointmentButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #232129;
  font-size: 18px;
`;
