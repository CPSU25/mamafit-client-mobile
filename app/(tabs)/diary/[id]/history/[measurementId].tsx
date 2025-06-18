import { Feather, FontAwesome } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MeasurementField } from '~/components/measurement-field'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { MeasurementsFormOutput } from '~/features/diary/create-diary/validations'
import { useEditMeasurementDetail } from '~/features/diary/edit-measurement-detail/use-edit-measurement-detail'
import { useGetMeasurementDetail } from '~/features/diary/get-measurement-detail/get-measurement-detail'
import { useGetWeekOfPregnancy } from '~/features/diary/get-week-of-pregnancy/use-get-week-of-pregnancy'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

export default function DiaryHistoryDetailScreen() {
  const router = useRouter()
  const { measurementId, id } = useLocalSearchParams() as { measurementId: string; id: string }
  const { methods, initializeMeasurementsForm, editMeasurementDetailMutation } = useEditMeasurementDetail()
  const { isDarkColorScheme } = useColorScheme()
  const { data: measurementDetail } = useGetMeasurementDetail(measurementId)
  const { data: weekOfPregnancy } = useGetWeekOfPregnancy(id)

  useEffect(() => {
    if (measurementDetail) {
      initializeMeasurementsForm(measurementDetail)
    }
  }, [measurementDetail, initializeMeasurementsForm])

  const isEditable = weekOfPregnancy === measurementDetail?.weekOfPregnancy

  const mainData = [
    {
      title: 'Pregnancy Status',
      description: 'Tap to recalculate your measurements',
      icon: SvgIcon.calendarOne({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'weekOfPregnancy' as const, label: 'Gestational age', unit: 'weeks', editable: false },
        { name: 'weight' as const, label: 'Weight', unit: 'kg', editable: isEditable },
        { name: 'bust' as const, label: 'Bust', unit: 'cm', editable: isEditable },
        { name: 'waist' as const, label: 'Waist', unit: 'cm', editable: isEditable },
        { name: 'hip' as const, label: 'Hip', unit: 'cm', editable: isEditable }
      ]
    }
  ]

  const calculatedData = [
    {
      title: 'Upper Body',
      description: 'Tap any measurement to edit',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'neck' as const, label: 'Neck', unit: 'cm', editable: isEditable },
        { name: 'coat' as const, label: 'Coat', unit: 'cm', editable: isEditable },
        { name: 'chestAround' as const, label: 'Chest around', unit: 'cm', editable: isEditable },
        { name: 'shoulderWidth' as const, label: 'Shoulder width', unit: 'cm', editable: isEditable }
      ]
    },
    {
      title: 'Core & Waist',
      description: 'Tap any measurement to edit',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'stomach' as const, label: 'Stomach', unit: 'cm', editable: isEditable },
        { name: 'pantsWaist' as const, label: 'Pants waist', unit: 'cm', editable: isEditable }
      ]
    },
    {
      title: 'Lower Body',
      description: 'Tap any measurement to edit',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'thigh' as const, label: 'Thigh', unit: 'cm', editable: isEditable },
        { name: 'legLength' as const, label: 'Leg length', unit: 'cm', editable: isEditable }
      ]
    },
    {
      title: 'Garment Specific',
      description: 'Tap any measurement to edit',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'dressLength' as const, label: 'Dress length', unit: 'cm', editable: isEditable },
        { name: 'sleeveLength' as const, label: 'Sleeve length', unit: 'cm', editable: isEditable }
      ]
    }
  ]

  const handleGoBack = () => {
    router.back()
  }

  const onSubmit: SubmitHandler<MeasurementsFormOutput> = (data) => {
    const { weekOfPregnancy, ...rest } = data

    editMeasurementDetailMutation.mutate({
      measurementId,
      inputs: rest
    })
  }

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <FormProvider {...methods}>
          <View className='flex flex-row items-center justify-between p-4'>
            <View className='flex flex-row items-center gap-4'>
              <TouchableOpacity onPress={handleGoBack}>
                <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
              </TouchableOpacity>
              <Text className='text-xl font-inter-semibold flex-1'>
                Week {measurementDetail?.weekOfPregnancy} measurements
              </Text>
            </View>
          </View>
          <View className='bg-muted h-2' />
          <View className='flex flex-col gap-4 p-4'>
            <Animated.View
              entering={FadeInDown.delay(100)}
              className={cn(
                'border rounded-2xl p-4 border-dashed',
                isDarkColorScheme ? 'bg-amber-500/10 border-amber-900' : 'bg-amber-500/20 border-amber-500/30'
              )}
            >
              <View className='flex flex-row items-baseline gap-3'>
                <FontAwesome name='exclamation-triangle' size={16} color={isDarkColorScheme ? '#f59e0b' : '#d97706'} />
                <View className='flex flex-col gap-0.5 flex-shrink'>
                  <Text className={cn('font-inter-semibold', isDarkColorScheme ? 'text-amber-500' : 'text-amber-600')}>
                    {isEditable ? 'Important Information' : 'Read-only Information'}
                  </Text>
                  <Text className={cn('text-xs', isDarkColorScheme ? 'text-amber-500' : 'text-amber-600')}>
                    {isEditable
                      ? 'This information will assist us in delivering the most precise results for your measurements.'
                      : 'This information is read-only and cannot be edited since it is not the current week of pregnancy.'}
                  </Text>
                </View>
              </View>
            </Animated.View>

            {mainData.map((category, categoryIndex) => (
              <Animated.View
                key={category.title}
                entering={FadeInDown.delay(200 + categoryIndex * 100)}
                className='rounded-2xl'
              >
                <Card className='p-2'>
                  <View className='flex flex-row items-center gap-2 mb-4'>
                    <View
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'
                      )}
                    >
                      {category.icon}
                    </View>
                    <View>
                      <Text className='font-inter-semibold text-sm uppercase'>{category.title}</Text>
                      <Text className='text-xs text-muted-foreground'>{category.description}</Text>
                    </View>
                  </View>
                  <View className='flex flex-col gap-2'>
                    {category.measurements.map((measurement, index) => (
                      <MeasurementField
                        key={measurement.name}
                        name={measurement.name}
                        label={measurement.label}
                        unit={measurement.unit}
                        categoryIndex={categoryIndex}
                        measurementIndex={index}
                        editable={measurement.editable}
                      />
                    ))}
                  </View>
                </Card>
              </Animated.View>
            ))}

            <Animated.View entering={FadeInDown.delay(300)}>
              <View className='flex flex-col gap-1'>
                <Text className='font-inter-semibold'>Our Estimation</Text>
                <Text className='text-muted-foreground text-xs'>
                  This is an estimation of your measurements based on your pregnancy status.
                </Text>
              </View>
            </Animated.View>

            {calculatedData.map((category, categoryIndex) => (
              <Animated.View
                key={category.title}
                entering={FadeInDown.delay(400 + categoryIndex * 100)}
                className='rounded-2xl'
              >
                <Card className='p-2'>
                  <View className='flex flex-row items-center gap-2 mb-4'>
                    <View
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'
                      )}
                    >
                      {category.icon}
                    </View>
                    <View>
                      <Text className='font-inter-semibold text-sm uppercase'>{category.title}</Text>
                      <Text className='text-xs text-muted-foreground'>{category.description}</Text>
                    </View>
                  </View>
                  <View className='flex flex-col gap-2'>
                    {category.measurements.map((measurement, index) => (
                      <MeasurementField
                        key={measurement.name}
                        name={measurement.name}
                        label={measurement.label}
                        unit={measurement.unit}
                        categoryIndex={categoryIndex}
                        measurementIndex={index}
                        editable={measurement.editable}
                      />
                    ))}
                  </View>
                </Card>
              </Animated.View>
            ))}
            {isEditable && (
              <Button onPress={methods.handleSubmit(onSubmit)} disabled={editMeasurementDetailMutation.isPending}>
                <Text className='font-inter-medium'>
                  {editMeasurementDetailMutation.isPending ? 'Saving...' : 'Save'}
                </Text>
              </Button>
            )}
          </View>
        </FormProvider>
      </ScrollView>
    </SafeAreaView>
  )
}
