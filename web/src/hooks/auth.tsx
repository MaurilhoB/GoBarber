import { createContext, useCallback, useContext, useState } from "react"

import api from "../services/api"

interface SignInCredentials {
  email: string
  password: string
}

interface IUser {
  id: string
  name: string
  email: string
  avatar_url: string
}

interface AuthState {
  token: string
  user: IUser
}

interface AuthContextData {
  user: IUser
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
  updateUser(user: IUser): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@GoBarber:token")
    const user = localStorage.getItem("@GoBarber:user")

    if (user && token) {
      api.defaults.headers.authorization = `Bearer ${token}`
      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("sessions", {
      email,
      password
    })

    const { token, user } = response.data

    localStorage.setItem("@GoBarber:token", token)
    localStorage.setItem("@GoBarber:user", JSON.stringify(user))

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem("@GoBarber:token")
    localStorage.removeItem("@GoBarber:user")

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(
    (user: IUser) => {
      localStorage.setItem("@GoBarber:user", JSON.stringify(user))
      setData({
        ...data,
        user
      })
    },
    [data]
  )
  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth should be used inside AuthProvider")
  }

  return context
}
