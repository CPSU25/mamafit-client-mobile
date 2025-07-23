import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import AutoHeightImage from '~/components/auto-height-image'
import SafeView from '~/components/safe-view'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { PresetItem } from '~/features/order/types'
import DressBuilderForm from '~/features/preset/components/dress-builder-form'
import { useGetPreset } from '~/features/preset/hooks/use-get-preset'
import { DressBuilderFormSchema, keysToExtract } from '~/features/preset/validations'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn, getOrderedComponentOptions } from '~/lib/utils'
import { PresetWithComponentOptions } from '~/types/preset.type'

export default function CreateCanvasScreen() {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()
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
    <SafeView>
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
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
          <View className='p-4 flex-1'>
            <ScrollView
              showsVerticalScrollIndicator={false}
              className='flex-1'
              contentContainerStyle={{ paddingBottom: 70 }}
            >
              {/* Preset Display */}
              <View className='gap-2'>
                {preset?.images[0] ? (
                  <View className='flex justify-center items-center'>
                    <AutoHeightImage width={Dimensions.get('window').width - 100} uri={preset.images[0]} />
                  </View>
                ) : (
                  <Card className='p-4'>
                    <Text className='font-inter-medium'>Select a preset to get started</Text>
                    <Text className='text-sm text-muted-foreground'>
                      Select a preset to get started or create a new one
                    </Text>
                  </Card>
                )}

                <TouchableOpacity
                  className={cn(
                    'rounded-xl p-2 flex-row items-center gap-2',
                    isDarkColorScheme ? 'bg-primary/20' : 'bg-primary/10'
                  )}
                  onPress={toggleDrawer}
                >
                  {SvgIcon.colorSwatch({ size: ICON_SIZE.LARGE })}
                  <View className='flex-1'>
                    <Text
                      className={cn(
                        'font-inter-medium text-sm',
                        isDarkColorScheme ? 'text-primary-foreground' : 'text-primary'
                      )}
                    >
                      Touch To Custom
                    </Text>
                    <Text
                      className={cn('text-xs', isDarkColorScheme ? 'text-primary-foreground/70' : 'text-primary/70')}
                    >
                      Tailored for comfort. Designed by you.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Customization Options */}
                {preset?.componentOptions && preset.componentOptions.length > 0 && (
                  <Card className='p-2 gap-3'>
                    {getOrderedComponentOptions(preset?.componentOptions ?? []).map(
                      (option) =>
                        option && (
                          <View
                            className='flex-row items-center justify-between py-2 px-3 bg-muted/50 rounded-xl border border-border/50'
                            key={option.componentName}
                          >
                            <View className='flex-1'>
                              <Text className='text-sm font-inter-medium text-muted-foreground'>
                                {option.componentName}
                              </Text>
                            </View>
                            <Badge variant='secondary' className='ml-2'>
                              <Text className='text-xs font-inter-medium'>{option.name}</Text>
                            </Badge>
                          </View>
                        )
                    )}
                  </Card>
                )}
              </View>
            </ScrollView>
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
              <Button onPress={handleCheckOut} disabled={isSaving}>
                <Text className='font-inter-medium'>{isSaving ? 'Checking Out...' : 'Check Out Now!'}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Drawer>
    </SafeView>
  )
}
