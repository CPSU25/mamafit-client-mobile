import { Feather, MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { useGetDiaryDetail } from '~/features/diary/hooks/use-get-diary-detail'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function DiarySettingScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }

  const { data: diaryDetail } = useGetDiaryDetail({ diaryId: id })

  const handleGoBack = () => {
    router.back()
  }

  const sections = [
    {
      title: 'Basic Information',
      description: 'Personal details and measurements',
      icon: 'person' as keyof typeof MaterialIcons.glyphMap,
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
      icon: 'straighten' as keyof typeof MaterialIcons.glyphMap,
      data: [
        { label: 'Bust', value: diaryDetail?.bust, suffix: ' cm', icon: 'straighten' },
        { label: 'Waist', value: diaryDetail?.waist, suffix: ' cm', icon: 'straighten' },
        { label: 'Hip', value: diaryDetail?.hip, suffix: ' cm', icon: 'straighten' }
      ]
    },
    {
      title: 'Pregnancy Details',
      description: 'Pregnancy-related information',
      icon: 'pregnant-woman' as keyof typeof MaterialIcons.glyphMap,
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
          value: diaryDetail?.ultrasoundDate ? format(new Date(diaryDetail?.ultrasoundDate), 'MMM dd, yyyy') : null,
          icon: 'medical-services'
        },
        { label: 'Weeks from Ultrasound', value: diaryDetail?.weeksFromUltrasound, suffix: ' weeks', icon: 'timeline' }
      ]
    },
    {
      title: 'Record Details',
      description: 'Creation and modification dates',
      icon: 'history' as keyof typeof MaterialIcons.glyphMap,
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
    <SafeAreaView className='flex-1 bg-background'>
      <View className='flex flex-row items-center justify-between p-4'>
        <View className='flex flex-row items-center gap-4'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-semibold text-xl'>Diary Settings</Text>
        </View>
      </View>
      <View className='bg-muted h-2' />

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}></ScrollView>
    </SafeAreaView>
  )
}
