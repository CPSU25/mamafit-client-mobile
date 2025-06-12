import React from 'react'
import { Keyboard, Platform, EmitterSubscription } from 'react-native'

export function useKeyboardOffset() {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0)

  React.useEffect(() => {
    const showListener: EmitterSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    )
    const hideListener: EmitterSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    )
    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  return keyboardHeight
}
