import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { InfoCard, WarningCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { MeasurementField } from '~/features/diary/components/measurement-field'
import { useEditMeasurementDetail } from '~/features/diary/hooks/use-edit-measurement-detail'
import { useGetMeasurementDetail } from '~/features/diary/hooks/use-get-measurement-detail'
import { useGetWeekOfPregnancy } from '~/features/diary/hooks/use-get-week-of-pregnancy'
import { MeasurementsFormOutput } from '~/features/diary/validations'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

export default function DiaryHistoryDetailScreen() {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()
  const { measurementId, id } = useLocalSearchParams() as { measurementId: string; id: string }
  const { methods, initForm, editMeasurementDetailMutation } = useEditMeasurementDetail()

  const {
    data: measurementDetail,
    isLoading: isMeasurementDetailLoading,
    refetch: refetchMeasurementDetail
  } = useGetMeasurementDetail(measurementId)
  const {
    data: currentWeekData,
    isLoading: isWeekOfPregnancyLoading,
    refetch: refetchWeekOfPregnancy
  } = useGetWeekOfPregnancy(id)

  const { refreshControl } = useRefreshs([refetchMeasurementDetail, refetchWeekOfPregnancy])

  useEffect(() => {
    if (measurementDetail) {
      initForm(measurementDetail)
    }
  }, [measurementDetail, initForm])

  const isEditable =
    currentWeekData?.weekOfPregnancy === measurementDetail?.weekOfPregnancy && !Boolean(measurementDetail?.isLocked)

  const mainData = [
    {
      title: 'Trạng Thái Thai Kỳ',
      description: 'Chạm để cập nhật số đo',
      icon: SvgIcon.calendarOne({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'weekOfPregnancy' as const, label: 'Tuần Thai', unit: 'tuần', editable: false },
        { name: 'weight' as const, label: 'Cân Nặng', unit: 'kg', editable: isEditable },
        { name: 'bust' as const, label: 'Vòng Ngực', unit: 'cm', editable: isEditable },
        { name: 'waist' as const, label: 'Vòng Eo', unit: 'cm', editable: isEditable },
        { name: 'hip' as const, label: 'Vòng Hông', unit: 'cm', editable: isEditable }
      ]
    }
  ]

  const calculatedData = [
    {
      title: 'Thân Trên',
      description: 'Chạm để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'neck' as const, label: 'Cổ', unit: 'cm', editable: isEditable },
        { name: 'coat' as const, label: 'Áo', unit: 'cm', editable: isEditable },
        { name: 'chestAround' as const, label: 'Ngực', unit: 'cm', editable: isEditable },
        { name: 'shoulderWidth' as const, label: 'Vai', unit: 'cm', editable: isEditable }
      ]
    },
    {
      title: 'Thân & Eo',
      description: 'Chạm để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'stomach' as const, label: 'Bụng', unit: 'cm', editable: isEditable },
        { name: 'pantsWaist' as const, label: 'Eo Quần', unit: 'cm', editable: isEditable }
      ]
    },
    {
      title: 'Thân Dưới',
      description: 'Chạm để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'thigh' as const, label: 'Đùi', unit: 'cm', editable: isEditable },
        { name: 'legLength' as const, label: 'Dài Chân', unit: 'cm', editable: isEditable }
      ]
    },
    {
      title: 'Trang Phục',
      description: 'Chạm để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'dressLength' as const, label: 'Dài Váy', unit: 'cm', editable: isEditable },
        { name: 'sleeveLength' as const, label: 'Dài Tay', unit: 'cm', editable: isEditable }
      ]
    }
  ]

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace({
        pathname: '/diary/[id]/history',
        params: { id }
      })
    }
  }

  const onSubmit: SubmitHandler<MeasurementsFormOutput> = (data) => {
    const { weekOfPregnancy, ...rest } = data

    editMeasurementDetailMutation.mutate({
      measurementId,
      inputs: rest
    })
  }

  if (isMeasurementDetailLoading || isWeekOfPregnancyLoading) {
    return <Loading />
  }

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1' refreshControl={refreshControl}>
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
            {isEditable ? (
              <WarningCard
                title='Thông Tin Quan Trọng'
                delay={100}
                description='Giúp chúng tôi dự đoán số đo chính xác hơn.'
              />
            ) : (
              <InfoCard
                title={Boolean(measurementDetail?.isLocked) ? 'Thông Tin Đã Khóa' : 'Chỉ Đọc'}
                delay={100}
                description={
                  Boolean(measurementDetail?.isLocked)
                    ? 'Thông tin đã khóa, không thể chỉnh sửa.'
                    : 'Thông tin chỉ đọc, không phải tuần thai hiện tại.'
                }
              />
            )}

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
                <Text className='font-inter-semibold'>Ước Tính</Text>
                <Text className='text-muted-foreground text-xs'>Dựa trên tình trạng thai kỳ hiện tại.</Text>
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

            {isEditable ? (
              <Button
                onPress={methods.handleSubmit(onSubmit)}
                disabled={!methods.formState.isDirty || editMeasurementDetailMutation.isPending}
              >
                <Text className='font-inter-medium'>
                  {editMeasurementDetailMutation.isPending ? 'Đang Lưu...' : 'Lưu'}
                </Text>
              </Button>
            ) : null}
          </View>
        </FormProvider>
      </ScrollView>
    </SafeView>
  )
}
