import React, { useContext, createContext, useState, useCallback } from 'react';
import ToastContainer from '../components/ToastContainer';

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}
interface ToastMessage {
  id: string,
  type?: 'info' | 'error' | 'success'
  title: string
  description?: string
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = useCallback(({ title, description, type }: Omit<ToastMessage, 'id'>) => {

    const base = 'asod6kjnx443d23asd24524jaklsd253jaias325224o'.split('')
    const id = base.map(item => base[Math.round(Math.random() * base.length)]).join('')
    const toast = {
      id,
      type,
      title,
      description
    }
    setMessages((state) => [...state, toast])
  }, [])

  const removeToast = (id: string) => {
    setMessages((state) => state.filter(message => message.id !== id))
  }
  return (
    <ToastContext.Provider value={{addToast, removeToast}}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if(!context) {
    throw new Error('useToast should be used inside ToastProvider')
  }
  return context
}
