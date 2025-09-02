import { useFormContext } from 'react-hook-form'
import { ScrollView, View } from 'react-native'
import { useGetComponentsByStyleId } from '~/features/component/hooks/use-get-components'
import { useRefreshs } from '~/hooks/use-refresh'
import { useGetCategories } from '../hooks/use-get-categories'
import { useGetCategoryDetail } from '../hooks/use-get-category-detail'
import { useGetDefaultPreset } from '../hooks/use-get-default-preset'
import { DressBuilderFormSchema } from '../validations'
import CategorySection from './category-section'
import ComponentSection from './component-section'
import StyleSection from './style-section'

export default function DressBuilderForm() {
  const { control, watch, setValue } = useFormContext<DressBuilderFormSchema>()

  const { data: categories, refetch: refetchCategories } = useGetCategories()
  const { data: stylesByCategory, refetch: refetchStyles } = useGetCategoryDetail(watch('categoryId'))
  const { data: defaultPreset, refetch: refetchDefaultPreset } = useGetDefaultPreset(watch('styleId'))
  const { data: componentsByStyle, refetch: refetchComponents } = useGetComponentsByStyleId(watch('styleId'))

  const { refreshControl } = useRefreshs([refetchCategories, refetchStyles, refetchDefaultPreset, refetchComponents])

  return (
    <View className='flex-1 bg-background'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1'
        nestedScrollEnabled
        refreshControl={refreshControl}
      >
        <View className='flex-1'>
          {/* Category */}
          <CategorySection
            categories={categories}
            control={control}
            watch={watch}
            setValue={setValue}
            name='categoryId'
          />
          {/* Style */}
          <StyleSection stylesByCategory={stylesByCategory} control={control} setValue={setValue} name='styleId' />

          {/* Component */}
          <ComponentSection
            control={control}
            setValue={setValue}
            defaultPreset={defaultPreset}
            componentsByStyle={componentsByStyle}
          />
        </View>
      </ScrollView>
    </View>
  )
}
