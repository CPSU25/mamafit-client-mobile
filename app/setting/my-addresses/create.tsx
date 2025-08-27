import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { useDebounce } from 'use-debounce'
import FieldError from '~/components/field-error'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import AddAddressForm from '~/features/user/components/add-address-form'
import { useAddAddress } from '~/features/user/hooks/use-add-address'
import { useGetForwardGeocoding } from '~/features/user/hooks/use-get-forward-geocoding'
import { AddAddressFormSchema } from '~/features/user/validations'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function CreateAddressScreen() {
  const router = useRouter()
  const { methods, addAddressMutation } = useAddAddress()
  const {
    formState: { errors }
  } = methods

  const [debouncedProvince] = useDebounce(methods.watch('province'), 500)
  const [debouncedDistrict] = useDebounce(methods.watch('district'), 500)
  const [debouncedWard] = useDebounce(methods.watch('ward'), 500)
  const [debouncedStreet] = useDebounce(methods.watch('street'), 500)

  const address = [debouncedStreet, debouncedWard, debouncedDistrict, debouncedProvince].filter(Boolean)
  const hasAllFields = address.length === 4

  const { data: geocodingData, isLoading: isGeocoding } = useGetForwardGeocoding(address.join(', '), hasAllFields)
  const rootMsg = errors.root?.message || (errors as any)['']?.message || (errors as any)._errors?.[0]

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/setting')
    }
  }

  const onSubmit: SubmitHandler<AddAddressFormSchema> = (data) => {
    addAddressMutation.mutate(data)
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-3 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Thêm Địa Chỉ</Text>
      </View>

      <View className='bg-muted h-2' />

      <View className='p-4 flex-1'>
        <FormProvider {...methods}>
          <AddAddressForm geocodingData={geocodingData} isGeocoding={isGeocoding} />
          <View className='flex-1' />
          <View className='gap-2'>
            {rootMsg && <FieldError message={rootMsg} />}
            <Button onPress={methods.handleSubmit(onSubmit)} disabled={isGeocoding || addAddressMutation.isPending}>
              <Text className='font-inter-medium'>
                {addAddressMutation.isPending || isGeocoding ? 'Đang Xử Lý...' : 'Lưu'}
              </Text>
            </Button>
          </View>
        </FormProvider>
      </View>
    </SafeView>
  )
}
