import React, {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"
import { useField } from "@unform/core"

import { IconBaseProps } from "react-icons"
import { Container, Error } from "./styles"
import { FiAlertCircle } from "react-icons/fi"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  containerStyle?: object
  icon?: React.ComponentType<IconBaseProps>
}

const Input: React.FC<InputProps> = ({
  icon: Icon,
  name,
  containerStyle = {},
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isFocused, setFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const { fieldName, registerField, error, defaultValue = "" } = useField(name)

  const handleInputBlur = useCallback(() => {
    setFocused(false)
    setIsFilled(!!inputRef.current?.value)
  }, [])

  const handleInputFocus = useCallback(() => {
    setFocused(true)
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value"
    })
  }, [fieldName, registerField])

  return (
    <Container
      style={containerStyle}
      hasError={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
    >
      {Icon && <Icon size={18} />}
      <input
        ref={inputRef}
        name={name}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  )
}

export default Input
