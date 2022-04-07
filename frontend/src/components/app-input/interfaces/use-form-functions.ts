import { FieldErrors } from 'react-hook-form';

export interface UseFormFunctions {
  register: (...rest: any) => any,
  errors: FieldErrors,
}