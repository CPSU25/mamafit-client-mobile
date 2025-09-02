import { Camera, Edit, Lock, Mail, Phone, UserRound } from 'lucide-react-native'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Icon } from '~/components/ui/icon'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Text } from '~/components/ui/text'
import { useImagePicker } from '~/hooks/use-image-picker'
import { placeholderImage, PRIMARY_COLOR } from '~/lib/constants/constants'
import { isValidUrl } from '~/lib/utils'
import { User } from '~/types/common'
import { EditProfileFormSchema } from '../validations'

interface ViewProfileProps {
  user: User
  isEditMode: boolean
  setIsEditMode: (isEditMode: boolean) => void
  isChangingPassword: boolean
  setIsChangingPassword: (isChangingPassword: boolean) => void
}

export default function ViewProfile({
  user,
  isEditMode,
  setIsEditMode,
  isChangingPassword,
  setIsChangingPassword
}: ViewProfileProps) {
  const { isUploading: isUploadingImage, pickImages } = useImagePicker({
    maxImages: 1,
    maxSizeInMB: 2,
    maxDimension: 800,
    path: 'profile-pictures'
  })

  const { control, setValue, watch } = useFormContext<EditProfileFormSchema>()

  const currentFormProfilePicture = watch('profilePicture')

  const currentProfileImage = currentFormProfilePicture || user.profilePicture || placeholderImage
  const imageSource = currentProfileImage && isValidUrl(currentProfileImage) ? currentProfileImage : placeholderImage

  useEffect(() => {
    if (!isChangingPassword) {
      setValue('oldPassword', '')
      setValue('newPassword', '')
    }
  }, [isChangingPassword, setValue])

  const handleImagePick = async () => {
    const urls = await pickImages()

    if (urls.length > 0) {
      setValue('profilePicture', urls[0], { shouldDirty: true })
    }
  }

  return (
    <View>
      <View className='bg-primary p-8 items-center'>
        <View className='relative'>
          <Avatar alt={user.fullName || user.userEmail} className='size-20'>
            <AvatarImage source={{ uri: imageSource }} />
            <AvatarFallback>
              <Text>{user.fullName?.charAt(0) || user.userEmail.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>

          {isEditMode && (
            <TouchableOpacity
              onPress={handleImagePick}
              disabled={isUploadingImage}
              className='absolute -bottom-1 -right-1 bg-background rounded-full p-1.5 border border-border shadow-sm'
            >
              {isUploadingImage ? (
                <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
              ) : (
                <Icon as={Camera} size={16} color={PRIMARY_COLOR.LIGHT} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className='px-4 pt-4 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <Icon as={Edit} size={18} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium text-sm'>Edit Profile</Text>
        </View>
        <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
      </View>

      <View className='px-4 pt-4 gap-4'>
        <View className='gap-2'>
          <View>
            <Text className='font-inter-medium text-sm'>Tên tài khoản</Text>
            <Text className='text-xs text-muted-foreground'>Sẽ hiển thị công khai</Text>
          </View>

          {isEditMode ? (
            <Controller
              control={control}
              name='fullName'
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                  <Input
                    StartIcon={<Icon as={UserRound} size={18} color={PRIMARY_COLOR.LIGHT} />}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Enter full name'
                    className={error ? 'border-destructive' : ''}
                  />
                  {error && <Text className='text-destructive text-xs mt-1'>{error.message}</Text>}
                </View>
              )}
            />
          ) : (
            <Input
              StartIcon={<Icon as={UserRound} size={18} color={PRIMARY_COLOR.LIGHT} />}
              value={user.fullName || 'N/A'}
              editable={false}
              className='text-muted-foreground text-xs'
            />
          )}
        </View>

        <View className='gap-2'>
          <View>
            <Text className='font-inter-medium text-sm'>Tên đăng nhập</Text>
            <Text className='text-xs text-muted-foreground'>Dùng để đăng nhập vào hệ thống</Text>
          </View>

          {isEditMode ? (
            <Controller
              control={control}
              name='userName'
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                  <Input
                    StartIcon={<Icon as={UserRound} size={18} color={PRIMARY_COLOR.LIGHT} />}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Enter username'
                    className={error ? 'border-destructive' : ''}
                  />
                  {error && <Text className='text-destructive text-xs mt-1'>{error.message}</Text>}
                </View>
              )}
            />
          ) : (
            <Input
              StartIcon={<Icon as={UserRound} size={18} color={PRIMARY_COLOR.LIGHT} />}
              value={user.userName || 'N/A'}
              editable={false}
              className='text-muted-foreground text-xs'
            />
          )}
        </View>

        {isEditMode && (
          <View className='gap-2'>
            <View className='flex-row items-center justify-between'>
              <View>
                <Text className='font-inter-medium text-sm'>Đổi mật khẩu</Text>
                <Text className='text-xs text-muted-foreground'>Chỉ cần thiết nếu muốn thay đổi mật khẩu</Text>
              </View>
              <Switch checked={isChangingPassword} onCheckedChange={setIsChangingPassword} />
            </View>
          </View>
        )}

        {isEditMode && isChangingPassword && (
          <>
            <View className='gap-2'>
              <View>
                <Text className='font-inter-medium text-sm'>Mật khẩu cũ</Text>
                <Text className='text-xs text-muted-foreground'>Nhập mật khẩu hiện tại</Text>
              </View>
              <Controller
                control={control}
                name='oldPassword'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View>
                    <Input
                      StartIcon={<Icon as={Lock} size={18} color={PRIMARY_COLOR.LIGHT} />}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder='Enter current password'
                      secureTextEntry
                      className={error ? 'border-destructive' : ''}
                    />
                    {error && <Text className='text-destructive text-xs mt-1'>{error.message}</Text>}
                  </View>
                )}
              />
            </View>

            <View className='gap-2'>
              <View>
                <Text className='font-inter-medium text-sm'>Mật khẩu mới</Text>
                <Text className='text-xs text-muted-foreground'>Nhập mật khẩu mới</Text>
              </View>
              <Controller
                control={control}
                name='newPassword'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View>
                    <Input
                      StartIcon={<Icon as={Lock} size={18} color={PRIMARY_COLOR.LIGHT} />}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder='Enter new password'
                      secureTextEntry
                      className={error ? 'border-destructive' : ''}
                    />
                    {error && <Text className='text-destructive text-xs mt-1'>{error.message}</Text>}
                  </View>
                )}
              />
            </View>
          </>
        )}

        {!isEditMode && (
          <View className='gap-2'>
            <View>
              <Text className='font-inter-medium text-sm'>Mật khẩu</Text>
              <Text className='text-xs text-muted-foreground'>Dùng để đăng nhập vào hệ thống</Text>
            </View>
            <Input
              StartIcon={<Icon as={Lock} size={18} color={PRIMARY_COLOR.LIGHT} />}
              value='********'
              editable={false}
              className='text-muted-foreground text-xs'
            />
          </View>
        )}

        <View className='gap-2'>
          <View>
            <Text className='font-inter-medium text-sm'>Email</Text>
            <Text className='text-xs text-muted-foreground'>Nhận hóa đơn và thông tin khác</Text>
          </View>
          {isEditMode ? (
            <Controller
              control={control}
              name='userEmail'
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                  <Input
                    StartIcon={<Icon as={Mail} size={18} color={PRIMARY_COLOR.LIGHT} />}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Enter email address'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    className={error ? 'border-destructive' : ''}
                  />
                  {error && <Text className='text-destructive text-xs mt-1'>{error.message}</Text>}
                </View>
              )}
            />
          ) : (
            <Input
              StartIcon={<Icon as={Mail} size={18} color={PRIMARY_COLOR.LIGHT} />}
              value={user.userEmail || 'N/A'}
              editable={false}
              className='text-muted-foreground text-xs'
            />
          )}
        </View>

        <View className='gap-2'>
          <View>
            <Text className='font-inter-medium text-sm'>Số điện thoại</Text>
            <Text className='text-xs text-muted-foreground'>Shipper sẽ gọi điện cho bạn</Text>
          </View>
          {isEditMode ? (
            <Controller
              control={control}
              name='phoneNumber'
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                  <Input
                    StartIcon={<Icon as={Phone} size={18} color={PRIMARY_COLOR.LIGHT} />}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Enter phone number'
                    keyboardType='phone-pad'
                    className={error ? 'border-destructive' : ''}
                  />
                  {error && <Text className='text-destructive text-xs mt-1'>{error.message}</Text>}
                </View>
              )}
            />
          ) : (
            <Input
              StartIcon={<Icon as={Phone} size={18} color={PRIMARY_COLOR.LIGHT} />}
              value={user.phoneNumber || 'N/A'}
              editable={false}
              className='text-muted-foreground text-xs'
            />
          )}
        </View>
      </View>
    </View>
  )
}
