import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar
} from "./styles"

import DayPicker, { DayModifiers } from "react-day-picker"
import "react-day-picker/lib/style.css"

import logoImg from "../../assets/logo.svg"
import { FiClock, FiPower } from "react-icons/fi"
import { useAuth } from "../../hooks/auth"
import { useCallback, useEffect, useMemo, useState } from "react"
import { format, isToday, parseISO, isAfter } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import api from "../../services/api"
import { Link } from "react-router-dom"

interface IMonthAvailabilityItem {
  day: number
  availability: boolean
}

interface IAppointments {
  id: string
  date: string
  formattedDate: string
  user: {
    name: string
    avatar_url: string
  }
}

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [appointments, setAppointments] = useState<IAppointments[]>([])
  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabilityItem[]
  >([])

  const { signOut, user } = useAuth()

  const handleDateChange = useCallback(
    (date: Date, modifiers: DayModifiers) => {
      if (modifiers.available && !modifiers.disabled) {
        setSelectedDate(date)
      }
    },
    []
  )
  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.availability === false)
      .map(
        month =>
          new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            month.day
          )
      )
    return dates
  }, [currentMonth, monthAvailability])

  const selectedDateFormated = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR
    })
  }, [selectedDate])

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "eeee", {
      locale: ptBR
    })
  }, [selectedDate])

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() < 12
    )
  }, [appointments])

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() >= 12
    )
  }, [appointments])

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appointments])

  useEffect(() => {
    api
      .get<IMonthAvailabilityItem[]>(
        `/providers/${user.id}/month-availability`,
        {
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1
          }
        }
      )
      .then(response => {
        setMonthAvailability(response.data)
      })
  }, [currentMonth, user.id])

  useEffect(() => {
    api
      .get<IAppointments[]>("/appointments/me", {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear()
        }
      })
      .then(response => {
        const formattedAppointments = response.data
          .map(appointment => ({
            ...appointment,
            formattedDate: format(parseISO(appointment.date), "HH:mm")
          }))
          .sort((a, b) => {
            const dateA = parseISO(a.date)
            const dateB = parseISO(b.date)

            if (dateA > dateB) return 1

            if (dateA < dateB) return -1

            return 0
          })
        setAppointments(formattedAppointments)
      })
  }, [selectedDate])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Go Barber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateFormated}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedDate}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Sem agendamentos no período</p>
            )}
            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedDate}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p>Sem agendamentos no período</p>
            )}
            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedDate}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] }
            }}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            weekdaysShort={["D", "S", "T", "Q", "Q", "S", "S"]}
            months={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro"
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  )
}

export default Dashboard
