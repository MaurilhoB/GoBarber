import React, { useEffect } from "react"
import { FiAlertTriangle, FiCheck, FiInfo, FiXCircle } from "react-icons/fi"
import { Container } from "./styles"
import { useToast } from "../../../hooks/toast"

interface ToastMessage {
  id: string
  type?: "info" | "error" | "success"
  title: string
  description?: string
}

interface ToastProps {
  toast: ToastMessage
  style: object
}

const iconVariations = {
  info: <FiInfo size={24} />,
  success: <FiCheck size={24} />,
  error: <FiAlertTriangle size={24} />
}

const Toast: React.FC<ToastProps> = ({ toast, style }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [removeToast, toast.id])

  return (
    <Container
      style={style}
      type={toast.type}
      $hasDescription={!!toast.description}
    >
      {iconVariations[toast.type || "info"]}
      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>
      <button type="button" onClick={() => removeToast(toast.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}

export default Toast
