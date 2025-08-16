import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
import { AddOnMap, AddOnOptionItem, OptionMap } from '~/features/order/types'
import { getOrderItems, getValidPair, transformAddOns, transformOptions } from '~/features/order/utils'
import { selectAddOnOptionFormSchema, SelectAddOnOptionFormSchema } from '~/features/order/validations'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { OrderItemTemp, PresetInStorage } from '~/types/order-item.type'
import { OrderItemType } from '~/types/order.type'

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

    if (orderItems.type === OrderItemType.Preset && type === OrderItemType.Preset) {
      let presetOrderItem = orderItems as OrderItemTemp<PresetInStorage>

      const preset = presetOrderItem.items[itemId as string]

      if (preset.presetId === itemId) {
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

        // Prevent duplicated options on the same position
        const filteredOptions = preset.options.filter(
          (option) => option.addOnOptionId !== addOnOption.addOnOptionId && option.positionId !== addOnOption.positionId
        )

        const updatedPreset = {
          ...preset,
          options: [...filteredOptions, addOnOption]
        }
        presetOrderItem.items[itemId as string] = updatedPreset

        await AsyncStorage.setItem('order-items', JSON.stringify(presetOrderItem))
        router.back()
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
            <Text className='font-inter-medium'>Áp Dụng</Text>
          </Button>
        </FormProvider>
      ) : null}
    </SafeView>
  )
}
