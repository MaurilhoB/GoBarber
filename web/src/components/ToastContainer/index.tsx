import React from 'react';
import { useTransition } from '@react-spring/web';

import { Container } from './styles';
import Toast from './Toast';

interface ToastMessage {
  id: string,
  type?: 'info' | 'error' | 'success'
  title: string
  description?: string
}

interface ToastContainerProps {
  messages: ToastMessage[]
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransition = useTransition(
    messages,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
      keys: (message) => message.id
    }
  )
  return (
    <Container>
      {
        messagesWithTransition(
          ({right, opacity}, item) => (
            <Toast
              key={item.id}
              style={{right, opacity}}
              toast={item}
            />
          )
        )
      }
    </Container>
  )
}

export default ToastContainer
