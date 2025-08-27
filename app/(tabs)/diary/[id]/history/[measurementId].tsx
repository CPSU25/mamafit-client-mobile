import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { InfoCard, WarningCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Icon } from '~/components/ui/icon'
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
      title: 'Thông tin thai kỳ',
      description: 'Chạm để cập nhật số đo',
      icon: SvgIcon.calendarOne({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'weekOfPregnancy' as const, label: 'Tuổi thai', unit: 'tuần', editable: false },
        { name: 'bust' as const, label: 'Vòng ngực', unit: 'cm', editable: false },
        { name: 'waist' as const, label: 'Vòng eo', unit: 'cm', editable: false },
        { name: 'hip' as const, label: 'Vòng hông', unit: 'cm', editable: false }
      ]
    }
  ]

  const calculatedData = [
    {
      title: 'Số đo thân trên',
      description: 'Nhấn vào số đo để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'neck' as const, label: 'Vòng cổ', unit: 'cm', editable: true },
        { name: 'coat' as const, label: 'Vòng áo', unit: 'cm', editable: true },
        { name: 'chestAround' as const, label: 'Vòng ngực', unit: 'cm', editable: true },
        { name: 'shoulderWidth' as const, label: 'Vòng vai', unit: 'cm', editable: true }
      ]
    },
    {
      title: 'Số đo thân giữa & vòng eo',
      description: 'Nhấn vào số đo để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'stomach' as const, label: 'Vòng bụng', unit: 'cm', editable: true },
        { name: 'pantsWaist' as const, label: 'Vòng eo quần', unit: 'cm', editable: true }
      ]
    },
    {
      title: 'Số đo thân dưới',
      description: 'Nhấn vào số đo để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'thigh' as const, label: 'Vòng đùi', unit: 'cm', editable: true },
        { name: 'legLength' as const, label: 'Chiều dài chân', unit: 'cm', editable: true }
      ]
    },
    {
      title: 'Số đo khác',
      description: 'Nhấn vào số đo để chỉnh sửa',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'dressLength' as const, label: 'Chiều dài váy', unit: 'cm', editable: true },
        { name: 'sleeveLength' as const, label: 'Chiều dài tay áo', unit: 'cm', editable: true }
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
            <View className='flex flex-row items-center gap-3'>
              <TouchableOpacity onPress={handleGoBack}>
                <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
              </TouchableOpacity>
              <Text className='text-xl font-inter-medium flex-1'>
                Số đo tuần thứ {measurementDetail?.weekOfPregnancy}
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
                title={Boolean(measurementDetail?.isLocked) ? 'Thông tin đã khóa' : 'Chỉ đọc'}
                delay={100}
                description={
                  Boolean(measurementDetail?.isLocked)
                    ? 'Thông tin đã khóa, không thể chỉnh sửa vì hiện tại số đo này đang được sử dụng cho đơn hàng.'
                    : 'Thông tin chỉ đọc, không phải tuần thai hiện tại. Bạn chỉ có thể chỉnh sửa số đo trong tuần thai hiện tại.'
                }
              />
            )}

            {mainData.map((category, categoryIndex) => (
              <Animated.View
                key={category.title}
                entering={FadeInDown.delay(200 + categoryIndex * 50)}
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
                      <Text className='font-inter-medium text-sm'>{category.title}</Text>
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

            {calculatedData.map((category, categoryIndex) => (
              <Animated.View
                key={category.title}
                entering={FadeInDown.delay(300 + categoryIndex * 50)}
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
                      <Text className='font-inter-medium text-sm'>{category.title}</Text>
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
