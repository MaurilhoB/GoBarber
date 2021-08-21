import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Platform, Alert } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';

import { useRoute, useNavigation } from '@react-navigation/native';

import api from '../../services/api';

import { format } from 'date-fns';

import {
  Container,
  Header,
  HeaderTitle,
  UserAvatar,
  Content,
  BackButton,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Separator,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Calendar,
  Title,
  Section,
  SectionTitle,
  HourText,
  Hour,
  Schedule,
  SectionContent,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

interface IRouteParams {
  provider_id: string;
  providers: IProvider[];
}

interface AvailabilityItem {
  hour: number;
  availability: boolean;
}
const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const { user } = useAuth();

  const { provider_id, providers } = route.params as IRouteParams;

  const [selectedProvider, setSelectedProvider] = useState(provider_id);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const selectedProviderIndex = useMemo(
    () => providers.findIndex(provider => provider.id === selectedProvider),
    [],
  );

  const morningAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour < 12)
        .map(({ availability, hour }) => ({
          hour,
          availability,
          hourFormated: format(new Date().setHours(hour), 'HH:00'),
        })),
    [availability],
  );

  const afternoonAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour >= 12)
        .map(({ availability, hour }) => ({
          hour,
          availability,
          hourFormated: format(new Date().setHours(hour), 'HH:00'),
        })),
    [availability],
  );

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProvider(id);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(prev => !prev);
  }, []);

  const handleDateChanged = useCallback((_: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/appointments', {
        provider_id: selectedProvider,
        date,
      });
      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (e) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao criar o agendamento, tente novamente',
      );
    }
  }, [selectedDate, selectedHour, selectedProvider, navigate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            initialScrollIndex={selectedProviderIndex}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 32,
              paddingHorizontal: 24,
            }}
            ItemSeparatorComponent={() => <Separator width={16} />}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}>
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              onChange={handleDateChanged}
              mode="date"
              display="calendar"
              value={selectedDate}
            />
          )}
        </Calendar>
        <Schedule>
          <Title>Escolha o horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(
                ({ hourFormated, availability, hour }) => (
                  <Hour
                    onPress={() => handleSelectHour(hour)}
                    enabled={availability}
                    selected={selectedHour === hour}
                    available={availability}
                    key={hourFormated}>
                    <HourText selected={selectedHour === hour}>
                      {hourFormated}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormated, availability, hour }) => (
                  <Hour
                    onPress={() => handleSelectHour(hour)}
                    enabled={availability}
                    selected={selectedHour === hour}
                    available={availability}
                    key={hourFormated}>
                    <HourText selected={selectedHour === hour}>
                      {hourFormated}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
