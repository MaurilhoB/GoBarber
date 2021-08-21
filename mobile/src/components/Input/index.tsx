import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';

import { Container, Icon, TextInput } from './styles';
import { TextInputProps } from 'react-native';

import { useField } from '@unform/core';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: object;
}

interface InputValueReference {
  value: string;
}
interface InputRef {
  focus(): void;
}
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const { registerField, fieldName, defaultValue = '', error } = useField(name);

  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });
  const inputElementRef = useRef<any>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current?.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current?.setNativeProps({
          text: value,
        });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current?.clear();
      },
    });
  }, [fieldName, registerField]);

  useEffect(() => {
    inputElementRef.current?.setNativeProps({
      style: { fontFamily: 'RobotoSlab-Regular' },
    });
  }, []);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFilled || isFocused ? '#ff9000' : '#666360'}
      />
      <TextInput
        defaultValue={defaultValue}
        ref={inputElementRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholderTextColor="#666360"
        onChangeText={value => (inputValueRef.current.value = value)}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
