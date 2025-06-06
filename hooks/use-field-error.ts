import { useColorScheme } from './use-color-scheme'

export const useFieldError = () => {
  const { isDarkColorScheme } = useColorScheme()

  if (isDarkColorScheme) {
    return 'border border-rose-500'
  } else {
    return 'border border-rose-500'
  }
}
