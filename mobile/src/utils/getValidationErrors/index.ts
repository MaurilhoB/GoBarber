import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string
}

const getValidationErrors = (errors: ValidationError): Errors => (
  errors.inner.reduce((acc, err) => ({
    ...acc,
    [String(err.path)]: err.message
  }), {})
)

export default getValidationErrors
