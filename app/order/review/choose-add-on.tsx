import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import AddOnsList from '~/features/order/components/add-on-section/add-ons-list'
import AddOptionForm from '~/features/order/components/add-on-section/add-option-form'
import OptionsList from '~/features/order/components/add-on-section/options-list'
import { useGetAddOns } from '~/features/order/hooks/use-get-add-ons'
import { AddOnMap, OptionMap } from '~/features/order/types'
import { getPairAddOnId, transformAddOns, transformOptions } from '~/features/order/utils'
import { selectAddOnOptionFormSchema, SelectAddOnOptionFormSchema } from '~/features/order/validations'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function ChooseAddOnScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  const [selectedAddOn, setSelectedAddOn] = useState<AddOnMap | null>(null)
  const [optionDetail, setOptionDetail] = useState<OptionMap | null>(null)

  const { data: addOns, isLoading: isLoadingAddOns } = useGetAddOns()

  const methods = useForm<SelectAddOnOptionFormSchema>({
    defaultValues: {
      addOnId: selectedAddOn?.id || '',
      positionId: '',
      sizeId: '',
      type: '',
      value: ''
    },
    resolver: zodResolver(selectAddOnOptionFormSchema)
  })

  const transformedAddOns = transformAddOns(addOns ?? [])

  const transformedOptions = selectedAddOn?.groupOptions ? transformOptions(selectedAddOn.groupOptions) : []

  const onSubmit: SubmitHandler<SelectAddOnOptionFormSchema> = (data) => {
    if (!optionDetail) return
    console.log(getPairAddOnId(optionDetail, data.positionId, data.sizeId, data.type))
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/order/review')
    }
  }

  const onPressAddOn = (addOn: AddOnMap) => {
    setSelectedAddOn(addOn)
    setCurrentStep(2)
  }

  const onPressOption = (option: OptionMap | null) => {
    setOptionDetail(option)
    setCurrentStep(3)
  }

  useEffect(() => {
    if (selectedAddOn) {
      methods.setValue('addOnId', selectedAddOn.id)
    }
  }, [selectedAddOn, methods])

  if (isLoadingAddOns) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex-row items-center gap-4 px-4 pt-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Select MamaFit Add-Ons</Text>
      </View>
      {currentStep === 1 && <AddOnsList addOns={transformedAddOns} onPress={onPressAddOn} />}
      {currentStep === 2 && <OptionsList options={transformedOptions} onPress={onPressOption} />}
      {currentStep === 3 && optionDetail && (
        <FormProvider {...methods}>
          <AddOptionForm optionDetail={optionDetail} />
          <Button className='mx-4 mt-4' onPress={methods.handleSubmit(onSubmit)}>
            <Text className='font-inter-medium'>Apply Changes</Text>
          </Button>
        </FormProvider>
      )}
    </SafeView>
  )
}
