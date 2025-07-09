import { FontAwesome } from '@expo/vector-icons'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import DressBuilderForm from '~/features/preset/components/dress-builder-form'
import { useGetPreset } from '~/features/preset/hooks/use-get-preset'
import { DressBuilderFormSchema, keysToExtract } from '~/features/preset/validations'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { PresetWithComponentOptions } from '~/types/preset.type'

export default function CreateCanvasScreen() {
  const [preset, setPreset] = useState<PresetWithComponentOptions | null>(null)
  const [open, setOpen] = useState(false)
  const { methods, getPresetMutation } = useGetPreset()

  const handleSubmit: SubmitHandler<DressBuilderFormSchema> = async (data) => {
    const filteredData = keysToExtract.map((key) => data[key])
    const preset = await getPresetMutation.mutateAsync(filteredData)
    setPreset(preset)
    setOpen(false)
  }

  console.log(preset)

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
        <View className='p-4'>
          <TouchableOpacity
            onPress={() => setOpen((prevOpen) => !prevOpen)}
            className='w-14 h-14 rounded-full bg-primary/10 justify-center items-center'
          >
            <FontAwesome name='paint-brush' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
        </View>
      </Drawer>
    </SafeView>
  )
}
