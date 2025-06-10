import { StyleSheet } from 'react-native'

export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)' // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)' // foreground
  }
}

export const PRIMARY_COLOR = {
  LIGHT: 'hsl(262.1 83.3% 57.8%)',
  DARK: 'hsl(263.4 70% 50.4%)'
}

export const ICON_SIZE = {
  EXTRA_SMALL: 24,
  SMALL: 32,
  MEDIUM: 40,
  LARGE: 60,
  EXTRA_LARGE: 100
}

export const getShadowStyles = (shadowColor: string = '#000') => ({
  shadowColor,
  boxShadow: `0 12px 22px -20px ${shadowColor}`,
  elevation: 10
})

export const styles = StyleSheet.create({
  container: getShadowStyles()
})
