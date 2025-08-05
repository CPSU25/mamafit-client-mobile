import { useFormContext } from 'react-hook-form'
import { ScrollView, View } from 'react-native'
import { DressBuilderFormSchema } from '../validations'
import CategorySection from './category-section'
import ComponentSection from './component-section'
import StyleSection from './style-section'

export default function DressBuilderForm() {
  const { control, watch, setValue } = useFormContext<DressBuilderFormSchema>()

  return (
    <View className='flex-1 bg-background'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1' nestedScrollEnabled>
        <View className='flex-1'>
          {/* Category */}
          <CategorySection control={control} watch={watch} setValue={setValue} name='categoryId' />
          {/* Style */}
          <StyleSection categoryId={watch('categoryId')} control={control} setValue={setValue} name='styleId' />

          {/* Component */}
          <ComponentSection control={control} setValue={setValue} styleId={watch('styleId')} />
        </View>
      </ScrollView>
    </View>
  )
}
