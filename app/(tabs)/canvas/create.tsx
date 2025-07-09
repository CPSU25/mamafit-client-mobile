import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import AutoHeightImage from '~/components/auto-height-image'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import DressBuilderForm from '~/features/preset/components/dress-builder-form'
import { useGetPreset } from '~/features/preset/hooks/use-get-preset'
import { DressBuilderFormSchema, keysToExtract } from '~/features/preset/validations'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
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

  const handleCheckOut = async () => {
    if (!preset) return

    try {
      setIsSaving(true)
      await AsyncStorage.setItem(
        'order-items',
        JSON.stringify({
          type: 'preset',
          items: [preset]
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
    <SafeView>
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => {
          return (
            <FormProvider {...methods}>
              <DressBuilderForm />
              {methods.formState.isDirty && (
                <View className='px-4 py-2'>
                  <Button onPress={methods.handleSubmit(handleSubmit)} disabled={getPresetMutation.isPending}>
                    <Text className='font-inter-medium'>
                      {getPresetMutation.isPending ? 'Applying...' : 'View Changes'}
                    </Text>
                  </Button>
                </View>
              )}
            </FormProvider>
          )
        }}
      >
        <View className='flex-1'>
          <View className='relative'>
            <TouchableOpacity
              onPress={() => setOpen((prevOpen) => !prevOpen)}
              className='w-14 h-14 rounded-full bg-primary/10 justify-center items-center absolute top-4 left-4 z-50'
            >
              <FontAwesome name='paint-brush' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
            <AutoHeightImage
              uri={preset?.images[0] || 'https://www.tiffanyrose.com/v3-img/products/ARIDMB-zoom.jpg'}
              width={Dimensions.get('window').width}
            />
          </View>

          <View className='p-4 gap-2 flex-1'>
            <Card className='p-4 flex-1' style={[styles.container]}></Card>

            <Button onPress={handleCheckOut} disabled={!preset || isSaving}>
              <Text className='font-inter-medium'>{isSaving ? 'Checking Out...' : 'Check Out'}</Text>
            </Button>
          </View>
        </View>
      </Drawer>
    </SafeView>
  )
}
