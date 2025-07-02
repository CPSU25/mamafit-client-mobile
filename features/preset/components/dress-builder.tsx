import { FontAwesome } from '@expo/vector-icons'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { PresetWithComponentOptions } from '~/types/preset.type'
import { useGetPreset } from '../hooks/use-get-preset'
import { DressBuilderFormSchema, keysToExtract } from '../validations'
import CategorySection from './category-section'
import ComponentSection from './component-section'
import StyleSection from './style-section'

interface DressBuilderProps {
  setPreset: (preset: PresetWithComponentOptions | null) => void
}

export default function DressBuilder({ setPreset }: DressBuilderProps) {
  const { methods, getPresetMutation } = useGetPreset()
  const [open, setOpen] = useState(false)

  const handleSubmit: SubmitHandler<DressBuilderFormSchema> = async (data) => {
    const filteredData = keysToExtract.map((key) => data[key])
    const preset = await getPresetMutation.mutateAsync(filteredData)
    setPreset(preset)
    setOpen(false)
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return (
          <View className='flex-1 bg-background'>
            <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
              <View className='gap-2'>
                <FormProvider {...methods}>
                  {/* Category */}
                  <CategorySection methods={methods} name='categoryId' />
                  <View className='h-2 bg-muted' />

                  {/* Style */}
                  <StyleSection categoryId={methods.watch('categoryId')} methods={methods} name='styleId' />
                  <View className='h-2 bg-muted' />

                  {/* Component */}
                  <ComponentSection methods={methods} styleId={methods.watch('styleId')} />
                </FormProvider>
              </View>
            </ScrollView>

            {methods.formState.isDirty && (
              <View className='px-4 py-2'>
                <Button onPress={methods.handleSubmit(handleSubmit)} disabled={getPresetMutation.isPending}>
                  <Text className='font-inter-medium'>
                    {getPresetMutation.isPending ? 'Applying...' : 'View Changes'}
                  </Text>
                </Button>
              </View>
            )}
          </View>
        )
      }}
    >
      <TouchableOpacity
        onPress={() => setOpen((prevOpen) => !prevOpen)}
        className='w-14 h-14 m-4 rounded-full bg-primary/10 justify-center items-center'
      >
        <FontAwesome name='paint-brush' size={24} color={PRIMARY_COLOR.LIGHT} />
      </TouchableOpacity>
    </Drawer>
  )
}
