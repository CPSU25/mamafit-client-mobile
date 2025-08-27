import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin'
import { useNotifications } from '~/components/providers/notifications.provider'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { useGoogleAuth } from '../hooks/use-google-auth'

export default function GoogleAuthButton() {
  const { mutate: signInWithGoogle, isPending: isSigningInWithGoogle } = useGoogleAuth()
  const { expoPushToken } = useNotifications()

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const response = await GoogleSignin.signIn()

      if (isSuccessResponse(response)) {
        const { idToken } = response.data
        if (idToken && expoPushToken) {
          signInWithGoogle({ jwtToken: idToken, notificationToken: expoPushToken })
        }
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  }

  return (
    <Button
      variant='outline'
      className='flex flex-row items-center justify-center gap-2'
      onPress={signIn}
      disabled={isSigningInWithGoogle}
    >
      {SvgIcon.google({ size: 22 })}
      <Text className='font-inter-medium'>Tiếp tục với Google</Text>
    </Button>
  )
}
