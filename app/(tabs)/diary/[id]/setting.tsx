import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import { useGetDiaryDetail } from '~/features/diary/hooks/use-get-diary-detail'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

export default function DiarySettingScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }
  const { isDarkColorScheme } = useColorScheme()
  const { data: diaryDetail } = useGetDiaryDetail({ diaryId: id })

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/diary')
    }
  }

  const sections = [
    {
      title: 'Basic Information',
      description: 'Personal details and measurements',
      icon: SvgIcon.personalCard({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      data: [
        { label: 'Name', value: diaryDetail?.name, icon: 'badge' },
        { label: 'Age', value: diaryDetail?.age, suffix: ' years', icon: 'cake' },
        { label: 'Height', value: diaryDetail?.height, suffix: ' cm', icon: 'height' },
        { label: 'Weight', value: diaryDetail?.weight, suffix: ' kg', icon: 'monitor-weight' }
      ]
    },
    {
      title: 'Body Measurements',
      description: 'Current body measurements',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      data: [
        { label: 'Bust', value: diaryDetail?.bust, suffix: ' cm', icon: 'straighten' },
        { label: 'Waist', value: diaryDetail?.waist, suffix: ' cm', icon: 'straighten' },
        { label: 'Hip', value: diaryDetail?.hip, suffix: ' cm', icon: 'straighten' }
      ]
    },
    {
      title: 'Pregnancy Details',
      description: 'Pregnancy-related information',
      icon: SvgIcon.folderFavorite({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      data: [
        { label: 'Number of Pregnancies', value: diaryDetail?.numberOfPregnancy, icon: 'format-list-numbered' },
        { label: 'Menstrual Cycle', value: diaryDetail?.averageMenstrualCycle, suffix: ' days', icon: 'schedule' },
        {
          label: 'Last Period Date',
          value: diaryDetail?.firstDateOfLastPeriod
            ? format(new Date(diaryDetail?.firstDateOfLastPeriod), 'MMM dd, yyyy')
            : null,
          icon: 'calendar-today'
        },
        {
          label: 'Ultrasound Date',
          value: diaryDetail?.ultrasoundDate
            ? format(new Date(diaryDetail?.ultrasoundDate), 'MMM dd, yyyy')
            : 'Not set',
          icon: 'medical-services'
        },
        {
          label: 'Weeks from Ultrasound',
          value: diaryDetail?.weeksFromUltrasound ? `${diaryDetail?.weeksFromUltrasound} weeks` : 'Not set',
          suffix: ' weeks',
          icon: 'timeline'
        }
      ]
    },
    {
      title: 'Record Details',
      description: 'Creation and modification dates',
      icon: SvgIcon.timeStart({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      data: [
        {
          label: 'Created',
          value: diaryDetail?.createdAt ? format(new Date(diaryDetail?.createdAt), 'MMM dd, yyyy') : null,
          icon: 'add-circle'
        },
        {
          label: 'Last Updated',
          value: diaryDetail?.updatedAt ? format(new Date(diaryDetail?.updatedAt), 'MMM dd, yyyy') : null,
          icon: 'update'
        }
      ]
    }
  ]

  return (
    <SafeView className='bg-background'>
      <View className='flex flex-row items-center justify-between p-4'>
        <View className='flex flex-row items-center gap-4'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-semibold text-xl'>Diary Settings</Text>
        </View>
      </View>
      <View className='bg-muted h-2' />

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {sections.map((section, index) => (
          <React.Fragment key={section.title}>
            <View className='p-4'>
              <View className='flex flex-row items-center gap-2'>
                <View
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'
                  )}
                >
                  {section.icon}
                </View>
                <View className='flex-1'>
                  <Text className='font-inter-semibold text-sm'>{section.title}</Text>
                  <Text className='text-xs text-muted-foreground'>{section.description}</Text>
                </View>
              </View>
              <View className='flex flex-col gap-2 mt-4'>
                {section.data.map((item) => (
                  <View key={item.label} className='flex-row items-center justify-between'>
                    <Text className='text-sm'>{item.label}</Text>
                    <Text className='text-sm text-muted-foreground'>
                      {item.value}
                      {item.suffix}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            {index !== sections.length - 1 && <View className='bg-muted h-2' />}
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeView>
  )
}
