import { View } from 'react-native'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { measurementCategories } from '~/lib/constants/constants'
import { Measurement } from '~/types/diary.type'

interface PreviewLatestMeasurementProps {
  measurement: Measurement | undefined
}

export default function PreviewLatestMeasurement({ measurement }: PreviewLatestMeasurementProps) {
  if (!measurement) return null

  return (
    <View className='gap-2'>
      <Text className='font-inter-semibold mb-2'>Xem Số Đo Gần Nhất ({measurement.weekOfPregnancy} tuần)</Text>
      {measurementCategories.map((category, categoryIndex) => (
        <View key={category.title} className='flex flex-col gap-2'>
          {category.measurements.map((key, index) => (
            <View key={key.name}>
              <View className='flex-row items-center justify-between gap-2'>
                <Text className='flex-1 text-sm'>{key.label}</Text>
                <Text className='text-sm text-primary font-inter-semibold'>
                  {measurement[key.name]} <Text className='text-xs text-muted-foreground'>{key.unit}</Text>
                </Text>
              </View>
              {index === category.measurements.length - 1 && categoryIndex !== measurementCategories.length - 1 && (
                <Separator className='mt-2' />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
