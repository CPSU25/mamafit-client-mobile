import { ScrollView, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { InfoCard } from '~/components/ui/alert-card'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { MeasurementField } from '~/features/diary/components/measurement-field'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { measurementCategories } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

export default function ReviewMeasurementsForm() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <ScrollView showsVerticalScrollIndicator={false} className='p-4 mb-4'>
      <View className='flex flex-col gap-4 mb-4'>
        <InfoCard
          title='Số Đo Của Bạn Đã Sẵn Sàng!'
          delay={100}
          description='Hãy nhớ, các số đo này là ước tính. Vui lòng kiểm tra và cập nhật nếu cần.'
        />

        {measurementCategories.map((category, categoryIndex) => (
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
      </View>
    </ScrollView>
  )
}
