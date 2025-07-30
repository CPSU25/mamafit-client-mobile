import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
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
import { AddOnMap, AddOnOptionItem, OptionMap, PresetItem } from '~/features/order/types'
import {
  addAddOnOptionToPreset,
  getOrderItems,
  getValidPair,
  savePresetToAsyncStorage,
  transformAddOns,
  transformOptions
} from '~/features/order/utils'
import { selectAddOnOptionFormSchema, SelectAddOnOptionFormSchema } from '~/features/order/validations'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function ChooseAddOnScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { itemId, type } = useLocalSearchParams()

  const [selectedAddOn, setSelectedAddOn] = useState<AddOnMap | null>(null)
  const [optionDetail, setOptionDetail] = useState<OptionMap | null>(null)

  const { data: addOns, isLoading: isLoadingAddOns, refetch: refetchAddOns } = useGetAddOns()

  const methods = useForm<SelectAddOnOptionFormSchema>({
    defaultValues: {
      addOnId: '',
      positionId: '',
      sizeId: '',
      type: '',
      value: '',
      positionName: '',
      sizeName: ''
    },
    resolver: zodResolver(selectAddOnOptionFormSchema)
  })

  const { refreshControl } = useRefreshs([refetchAddOns])

  const transformedAddOns = transformAddOns(addOns ?? [])

  const transformedOptions = selectedAddOn?.groupOptions ? transformOptions(selectedAddOn.groupOptions) : []

  const onSubmit: SubmitHandler<SelectAddOnOptionFormSchema> = async (data) => {
    if (!optionDetail) return
    const orderItems = await getOrderItems()

    if (!orderItems) return

    if (orderItems.type === 'preset' && type === 'preset') {
      const preset = orderItems.items[0] as PresetItem
      if (preset.id === itemId) {
        const validPair = getValidPair(optionDetail, data.positionId, data.sizeId, data.type)

        if (!validPair) {
          return
        }

        const addOnOption: AddOnOptionItem = {
          addOnOptionId: validPair.id,
          name: validPair.name,
          sizeName: data.sizeName,
          positionName: data.positionName,
          value: data.value,
          type: data.type,
          price: validPair.price,
          positionId: validPair.positionId,
          sizeId: data.sizeId
        }

        const updatedPreset = addAddOnOptionToPreset(preset, addOnOption)
        const success = await savePresetToAsyncStorage(updatedPreset)

        if (success) {
          router.back()
        }
      }
    }
  }

  const handleGoBack = () => {
    if (currentStep === 1) {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace('/order/review')
      }
    }

    if (currentStep === 2) {
      setCurrentStep(1)
      setSelectedAddOn(null)
    }

    if (currentStep === 3) {
      setCurrentStep(2)
      setOptionDetail(null)
      methods.reset({
        addOnId: selectedAddOn?.id || '',
        positionId: '',
        sizeId: '',
        type: '',
        value: ''
      })
    }
  }

  const getScreenTitle = () => {
    if (currentStep === 2 && selectedAddOn) {
      return selectedAddOn.name
    }
    if (currentStep === 3 && optionDetail) {
      return optionDetail.name
    }

    return 'Select MamaFit Add-Ons'
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

  if (!itemId || !type) {
    return <Redirect href='/order/review' />
  }

  return (
    <SafeView>
      <View className='flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>{getScreenTitle()}</Text>
      </View>

      <View className='h-2 bg-muted' />

      {currentStep === 1 ? (
        <AddOnsList addOns={transformedAddOns} onPress={onPressAddOn} refreshControl={refreshControl} />
      ) : null}

      {currentStep === 2 ? <OptionsList options={transformedOptions} onPress={onPressOption} /> : null}

      {currentStep === 3 && optionDetail ? (
        <FormProvider {...methods}>
          <AddOptionForm optionDetail={optionDetail} />
          <Button className='mx-4 mt-4' onPress={methods.handleSubmit(onSubmit)}>
            <Text className='font-inter-medium'>Apply Changes</Text>
          </Button>
        </FormProvider>
      ) : null}
    </SafeView>
  )
}
