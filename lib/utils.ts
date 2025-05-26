import { clsx, type ClassValue } from 'clsx'
import { FieldErrors } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isFormError = <T extends FieldErrors>(errors: T, fieldName: keyof T): boolean => {
  return Boolean(errors[fieldName])
}
