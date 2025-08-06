import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Dimensions, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native'

import { Drawer } from 'react-native-drawer-layout'
import AutoHeightImage from '~/components/auto-height-image'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { PresetItem } from '~/features/order/types'
import DressBuilderForm from '~/features/preset/components/dress-builder-form'
import { useGetPreset } from '~/features/preset/hooks/use-get-preset'
import { DressBuilderFormSchema, keysToExtract } from '~/features/preset/validations'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { PresetWithComponentOptions } from '~/types/preset.type'

export default function CreateCanvasScreen() {
  const router = useRouter()
  const [preset, setPreset] = useState<PresetWithComponentOptions | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const { methods, getPresetMutation } = useGetPreset()

  const handleSubmit: SubmitHandler<DressBuilderFormSchema> = async (data) => {
    const filteredData = keysToExtract.map((key) => data[key])
    const preset = await getPresetMutation.mutateAsync(filteredData)
    setPreset(preset)
    setOpen(false)
  }

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleCheckOut = async () => {
    if (!preset) return

    try {
      setIsSaving(true)

      const newPreset: PresetItem = {
        ...preset,
        addOnOptions: []
      }

      await AsyncStorage.setItem(
        'order-items',
        JSON.stringify({
          type: 'preset',
          items: [newPreset]
        })
      )
      router.push('/order/review')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ImageBackground
      source={preset?.images?.[0] ? { uri: preset.images[0] } : require('~/assets/images/mamafit-cover.png')}
      className='flex-1'
    >
      <SafeView>
        <Drawer
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          swipeEnabled={false}
          renderDrawerContent={() => {
            return (
              <FormProvider {...methods}>
                <DressBuilderForm />
                <View className='px-4 py-2'>
                  <Button onPress={methods.handleSubmit(handleSubmit)} disabled={getPresetMutation.isPending}>
                    <Text className='font-inter-medium'>
                      {getPresetMutation.isPending ? 'Applying...' : 'View Changes'}
                    </Text>
                  </Button>
                </View>
              </FormProvider>
            )
          }}
        >
          <View className='flex-1'>
            <View
              className='absolute bottom-0 left-0 right-0 flex-row justify-end gap-3 bg-background p-4 border-t border-border'
              style={{ boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <View className='flex-1'>
                <Text className='text-sm text-muted-foreground font-inter-medium'>Total Price</Text>
                <Text className='font-inter-semibold text-xl text-primary'>
                  <Text className='underline font-inter-semibold text-primary'>đ</Text>
                  {preset?.price ? preset.price.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleDrawer}
                className='bg-primary/10 rounded-full w-12 h-12 justify-center items-center'
              >
                <FontAwesome name='paint-brush' size={24} color={PRIMARY_COLOR.LIGHT} />
              </TouchableOpacity>
              <Button onPress={handleCheckOut} disabled={isSaving}>
                <Text className='font-inter-medium'>{isSaving ? 'Checking Out...' : 'Check Out Now!'}</Text>
              </Button>
            </View>
          </View>
        </Drawer>
      </SafeView>
    </ImageBackground>
  )
}
