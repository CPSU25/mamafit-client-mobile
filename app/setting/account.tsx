import { Redirect, useRouter } from 'expo-router'
import { ArrowLeft, Check, X } from 'lucide-react-native'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import ViewProfile from '~/features/user/components/view-profile'
import { useEditProfile } from '~/features/user/hooks/use-edit-profile'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { EditProfileFormSchema } from '~/features/user/validations'
import { useAuth } from '~/hooks/use-auth'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

export default function AccountScreen() {
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const { user } = useAuth()
  const { data: userProfile, isLoading } = useGetProfile(user?.userId)

  const defaultValues: EditProfileFormSchema = useMemo(
    () => ({
      fullName: userProfile?.fullName || '',
      profilePicture: userProfile?.profilePicture || '',
      userName: userProfile?.userName || '',
      userEmail: userProfile?.userEmail || '',
      oldPassword: '',
      newPassword: '',
      phoneNumber: userProfile?.phoneNumber || ''
    }),
    [userProfile]
  )

  const { methods, editProfileMutation } = useEditProfile(defaultValues)
  const {
    handleSubmit,
    reset,
    formState: { isDirty }
  } = methods

  useEffect(() => {
    if (isEditMode && userProfile) {
      reset({
        fullName: userProfile.fullName || '',
        profilePicture: userProfile.profilePicture || '',
        userName: userProfile.userName || '',
        userEmail: userProfile.userEmail || '',
        oldPassword: '',
        newPassword: '',
        phoneNumber: userProfile.phoneNumber || ''
      })
    }
  }, [isEditMode, userProfile, reset])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/setting')
    }
  }

  const handleSave = async (data: EditProfileFormSchema) => {
    console.log(data)
    editProfileMutation.mutate(data)

    setIsEditMode(false)
    setIsChangingPassword(false)
  }

  const handleCancel = () => {
    reset({
      fullName: userProfile?.fullName || '',
      profilePicture: userProfile?.profilePicture || '',
      userName: userProfile?.userName || '',
      userEmail: userProfile?.userEmail || '',
      oldPassword: '',
      newPassword: '',
      phoneNumber: userProfile?.phoneNumber || ''
    })

    setIsChangingPassword(false)
    setIsEditMode(false)
  }

  const onSaveClick = () => {
    handleSubmit(handleSave)()
  }

  if (isLoading) return <Loading />

  if (!userProfile) return <Redirect href='/profile' />

  return (
    <SafeView>
      <KeyboardAwareScrollView bottomOffset={20} className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='flex flex-row items-center justify-between p-4'>
          <View className='flex flex-row items-center gap-3'>
            <TouchableOpacity onPress={handleGoBack}>
              <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
            <Text className='font-inter-medium text-xl'>Tài khoản</Text>
          </View>

          {isEditMode && (
            <View className='flex flex-row items-center gap-3'>
              <TouchableOpacity
                onPress={handleCancel}
                className={cn('p-1', editProfileMutation.isPending && 'opacity-50')}
                disabled={editProfileMutation.isPending}
              >
                <Icon as={X} size={24} color='#EF4444' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSaveClick}
                className={cn('p-1', (editProfileMutation.isPending || !isDirty) && 'opacity-50')}
                disabled={editProfileMutation.isPending || !isDirty}
              >
                <Icon as={Check} size={24} color='#22C55E' />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className='bg-muted h-2' />

        <View className='mb-8'>
          <FormProvider {...methods}>
            <ViewProfile
              user={userProfile}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              isChangingPassword={isChangingPassword}
              setIsChangingPassword={setIsChangingPassword}
            />
          </FormProvider>
        </View>
      </KeyboardAwareScrollView>
    </SafeView>
  )
}
