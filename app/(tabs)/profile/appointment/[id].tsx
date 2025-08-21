import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { format, parse } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Alert, Image, Linking, ScrollView, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { toast } from 'sonner-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import CancelAppointmentForm from '~/features/appointment/components/cancel-appointment-form'
import { useCancelAppointment } from '~/features/appointment/hooks/use-cancel-appointment'
import { useGetAppointment } from '~/features/appointment/hooks/use-get-appointment'
import { getStatusColor } from '~/features/appointment/utils'
import { CancelAppointmentFormSchema } from '~/features/appointment/validations'
import { useKeyboardOffset } from '~/hooks/use-keyboard-offset'
import { useRefreshs } from '~/hooks/use-refresh'
import { ERROR_MESSAGES, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { cn, openInMaps } from '~/lib/utils'
import { ErrorResponse } from '~/types/common'

const isBranchOpen = (openingHour: string, closingHour: string) => {
  const now = new Date()

  // Convert "HH:MM:SS" to today's Date object
  const [openH, openM, openS] = openingHour.split(':').map(Number)
  const [closeH, closeM, closeS] = closingHour.split(':').map(Number)

  const openingTime = new Date(now)
  openingTime.setHours(openH, openM, openS, 0)

  const closingTime = new Date(now)
  closingTime.setHours(closeH, closeM, closeS, 0)

  // Handle overnight schedules (closing after midnight)
  if (closingTime <= openingTime) {
    // Closing is next day
    if (now >= openingTime) {
      return true // between opening and midnight
    }
    const yesterdayOpening = new Date(openingTime)
    yesterdayOpening.setDate(openingTime.getDate() - 1)
    return now < closingTime // after midnight but before closing
  }

  return now >= openingTime && now <= closingTime
}

export default function AppointmentDetailScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = useLocalSearchParams() as { id: string }

  const [dialogOpen, setDialogOpen] = useState(false)
  const { width } = useWindowDimensions()
  const keyboardHeight = useKeyboardOffset()

  const { data: appointment, isLoading: isLoadingAppointment, refetch: refetchAppointment } = useGetAppointment(id)
  const { methods, cancelAppointmentMutation } = useCancelAppointment()
  const { refreshControl } = useRefreshs([refetchAppointment])

  const initialRegion = useMemo(() => {
    if (appointment?.branch) {
      return {
        longitude: appointment.branch.longitude,
        latitude: appointment.branch.latitude,
        longitudeDelta: 0.01,
        latitudeDelta: 0.01
      }
    }
    return undefined
  }, [appointment?.branch])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const makePhoneCall = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`

    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert('Error', 'This device cannot make phone calls.')
    }
  }

  const isOpen = isBranchOpen(appointment?.branch.openingHour ?? '', appointment?.branch.closingHour ?? '')
  const { bgColor, icon, iconColor, text } = getStatusColor(appointment?.status ?? '')

  const isCanceled = appointment?.status === 'CANCELED'

  const onSubmit: SubmitHandler<CancelAppointmentFormSchema> = async (data) => {
    console.log(data)

    try {
      await cancelAppointmentMutation.mutateAsync({
        appointmentId: id,
        reason: data.reason
      })
      setDialogOpen(false)
      // TODO: add custom toast component
      toast.success('Đã Hủy Lịch Hẹn')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment'] })
      methods.reset()
      handleGoBack()
    } catch (error) {
      const errorMessage =
        (error as AxiosError<ErrorResponse>).response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG
      toast.error(errorMessage)
    }
  }

  if (isLoadingAppointment) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-3 p-4 bg-background'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl text-foreground'>Thông tin lịch hẹn</Text>
      </View>

      <View className='bg-muted flex-1'>
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
          <View className='p-4 gap-4 flex-1'>
            {/* Branch Card */}
            <Card className='gap-2 p-2 flex-row items-center border-transparent' style={styles.container}>
              <Image
                source={{ uri: appointment?.branch.images[0] }}
                className='w-28 h-28 rounded-xl'
                resizeMode='cover'
              />
              <View className='flex-1'>
                <View className='flex-row items-center gap-2'>
                  <Text className='font-inter-medium flex-1' numberOfLines={1}>
                    {appointment?.branch.name}
                  </Text>

                  <View className={cn('px-2.5 py-0.5 rounded-full', isOpen ? 'bg-emerald-500' : 'bg-rose-500')}>
                    <Text className='text-xs font-inter-medium text-white'>{isOpen ? 'Mở Cửa' : 'Đóng Cửa'}</Text>
                  </View>
                </View>

                <Separator className='my-2.5' />

                <View className='flex-row items-start gap-1 mb-1'>
                  <Feather name='map-pin' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
                    {appointment?.branch.street}, {appointment?.branch.ward}, {appointment?.branch.district},
                    {appointment?.branch.province}
                  </Text>
                </View>
                <View className='flex-row items-center gap-1'>
                  <Feather name='clock' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='text-xs text-muted-foreground'>
                    {appointment?.branch.openingHour && appointment?.branch.closingHour ? (
                      <>
                        {format(parse(appointment.branch.openingHour, 'HH:mm:ss', new Date()), 'hh:mm a')} -{' '}
                        {format(parse(appointment.branch.closingHour, 'HH:mm:ss', new Date()), 'hh:mm a')}
                      </>
                    ) : null}
                  </Text>
                </View>
              </View>
            </Card>

            {/* About Branch */}
            <Card className='gap-1 border-transparent p-2' style={styles.container}>
              <Text className='font-inter-medium'>Thông tin chi nhánh</Text>
              <Text className='text-sm text-muted-foreground'>{appointment?.branch.description}</Text>
            </Card>

            {/* Location */}
            <Card className='gap-1 border-transparent p-2' style={styles.container}>
              <Text className='font-inter-medium mb-2'>Vị trí</Text>
              <View className='overflow-hidden rounded-xl'>
                {initialRegion ? (
                  <MapView provider={PROVIDER_GOOGLE} style={{ width: '100%', height: 120 }} region={initialRegion}>
                    <Marker
                      coordinate={{
                        longitude: initialRegion.longitude,
                        latitude: initialRegion.latitude
                      }}
                      title={appointment?.branch.name}
                    />
                  </MapView>
                ) : null}
              </View>
              <TouchableOpacity
                className='px-4 py-2 rounded-xl flex-row items-center justify-center gap-2 bg-blue-50 mt-1'
                onPress={() => openInMaps(appointment?.branch.latitude ?? 0, appointment?.branch.longitude ?? 0)}
              >
                <Feather name='map' size={16} color='#2563eb' />
                <Text className='text-sm text-blue-600 font-inter-medium'>Mở Google Maps</Text>
              </TouchableOpacity>
            </Card>

            {/* Contact Information */}
            <Card className='gap-1 border-transparent p-2' style={styles.container}>
              <Text className='font-inter-medium mb-2'>Thông tin liên hệ</Text>
              <View className='flex-row items-center gap-2'>
                <View className='flex-1 flex-row items-center gap-2'>
                  <Avatar alt='Branch Manager' className='border-2 border-primary'>
                    <AvatarImage source={{ uri: appointment?.branch.branchManager.profilePicture ?? '' }} />
                    <AvatarFallback>
                      <Text>{appointment?.branch.branchManager.userName.charAt(0)}</Text>
                    </AvatarFallback>
                  </Avatar>
                  <View>
                    <Text className='font-inter-medium text-sm'>{appointment?.branch.branchManager.fullName}</Text>
                    <Text className='text-xs text-muted-foreground'>Quản lý chi nhánh</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className={cn(
                    'px-4 py-2 rounded-xl flex-row items-center justify-center gap-2 bg-primary/10',
                    isCanceled && 'opacity-70'
                  )}
                  onPress={() => makePhoneCall(appointment?.branch.branchManager.phoneNumber ?? '')}
                  disabled={isCanceled}
                >
                  <Feather name='phone' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='text-sm text-primary font-inter-medium'>Gọi</Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* Appointment Information */}
            <Card className='gap-1 border-transparent p-2' style={styles.container}>
              <Text className='font-inter-medium mb-2'>Thông tin lịch hẹn</Text>

              <View className='flex-row items-center justify-between mb-2'>
                <View className='flex-row items-center gap-2'>
                  <View className='w-8 h-8 bg-green-100 rounded-full items-center justify-center'>
                    <Feather name='calendar' size={14} color='#059669' />
                  </View>
                  <Text className='text-sm text-muted-foreground'>Ngày & giờ</Text>
                </View>
                <Text className='text-sm'>
                  {format(new Date(appointment?.bookingTime ?? ''), "MMM dd, yyyy 'lúc' hh:mm a")}
                </Text>
              </View>

              <View className='flex-row items-center justify-between mb-2'>
                <View className='flex-row items-center gap-2'>
                  <View className={cn('w-8 h-8 rounded-full items-center justify-center', bgColor)}>
                    <Feather name='activity' size={14} color={iconColor} />
                  </View>
                  <Text className='text-sm text-muted-foreground'>Trạng thái</Text>
                </View>
                <View className={cn('px-2 py-1 rounded-lg flex-row items-center gap-1.5', bgColor)}>
                  <MaterialIcons name={icon} size={16} color={iconColor} />
                  <Text className='font-inter-medium text-xs'>{text}</Text>
                </View>
              </View>

              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                  <View className='w-8 h-8 bg-amber-100 rounded-full items-center justify-center'>
                    <Feather name='file-text' size={14} color='#d97706' />
                  </View>
                  <Text className='text-sm text-muted-foreground'>Ghi chú</Text>
                </View>
                {appointment?.note ? (
                  <Text className='text-sm' numberOfLines={1}>
                    {appointment?.note}
                  </Text>
                ) : (
                  <Text className='text-sm text-muted-foreground' numberOfLines={1}>
                    trống
                  </Text>
                )}
              </View>
            </Card>

            {/* Action */}
            {appointment?.status === 'UP_COMING' ? (
              <Card className='gap-1 border-transparent p-2' style={styles.container}>
                <Text className='font-inter-medium'>Hành động</Text>
                <Text className='text-sm text-muted-foreground mb-2'>
                  Hành động này không thể hoàn tác. Vui lòng xác nhận nếu bạn muốn hủy lịch hẹn.
                </Text>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <TouchableOpacity className='p-3 rounded-xl flex-row items-center justify-center gap-2 bg-rose-50'>
                      <Feather name='x' size={16} color='#e11d48' />
                      <Text className='text-sm text-rose-600 font-inter-medium'>Hủy lịch hẹn</Text>
                    </TouchableOpacity>
                  </DialogTrigger>
                  <DialogContent
                    displayCloseButton={false}
                    style={{
                      marginBottom: keyboardHeight / 2.5,
                      width: width - 30,
                      padding: 16
                    }}
                  >
                    <FormProvider {...methods}>
                      <View className='gap-0.5'>
                        <Text className='font-inter-semibold text-xl'>Hủy lịch hẹn</Text>
                        <Text className='text-sm text-muted-foreground'>
                          Hành động này không thể hoàn tác. Vui lòng xác nhận nếu bạn muốn hủy lịch hẹn.
                        </Text>
                      </View>
                      <CancelAppointmentForm />
                      <TouchableOpacity
                        className='p-3 rounded-xl flex-row items-center justify-center gap-2 bg-rose-50'
                        onPress={methods.handleSubmit(onSubmit)}
                        disabled={cancelAppointmentMutation.isPending}
                      >
                        <Feather name='x' size={16} color='#e11d48' />
                        <Text className='text-sm text-rose-600 font-inter-medium'>
                          {cancelAppointmentMutation.isPending ? 'Đang hủy...' : 'Hủy lịch hẹn'}
                        </Text>
                      </TouchableOpacity>
                    </FormProvider>
                  </DialogContent>
                </Dialog>
              </Card>
            ) : null}
            {isCanceled ? (
              <Card className='gap-1 border-transparent p-2' style={styles.container}>
                <Text className='font-inter-medium mb-2'>Tóm tắt hủy lịch hẹn</Text>

                <View className='flex-row items-center justify-between mb-2'>
                  <View className='flex-row items-center gap-2'>
                    <View className='w-8 h-8 bg-rose-100 rounded-full items-center justify-center'>
                      <Feather name='calendar' size={14} color='#e11d48' />
                    </View>
                    <Text className='text-sm text-muted-foreground'>Đã hủy lúc</Text>
                  </View>
                  <Text className='text-sm'>
                    {format(new Date(appointment?.canceledAt ?? ''), "MMM dd, yyyy 'lúc' hh:mm a")}
                  </Text>
                </View>

                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center gap-2'>
                    <View className='w-8 h-8 bg-rose-100 rounded-full items-center justify-center'>
                      <Feather name='file-text' size={14} color='#e11d48' />
                    </View>
                    <Text className='text-sm text-muted-foreground'>Lý do</Text>
                  </View>
                  <Text className='text-sm' numberOfLines={1}>
                    {appointment.canceledReason}{' '}
                  </Text>
                </View>
              </Card>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </SafeView>
  )
}
