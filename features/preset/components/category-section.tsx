import { useEffect } from 'react'
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { useGetCategories } from '~/features/category/hooks/use-get-categories'
import CategoryCard from './category-card'

import RadioWrapper from '~/components/radio-wrapper'
interface CategorySectionProps<T extends FieldValues> {
  methods: UseFormReturn<T>
  name: Path<T>
}

export default function CategorySection<T extends FieldValues>({ methods, name }: CategorySectionProps<T>) {
  const { data: categories } = useGetCategories()

  useEffect(() => {
    if (categories) {
      const category = methods.watch(name)
      methods.setValue(name, (category ? category : (categories?.[0]?.id ?? '')) as T[Path<T>], {
        shouldDirty: false,
        shouldTouch: false
      })
    }
  }, [categories, methods, name])

  return (
    <View className='gap-2 px-4 py-2'>
      <Text className='font-inter-semibold text-xl'>Choose Occasion</Text>
      <Controller
        control={methods.control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <View className='flex-row gap-2 flex-wrap'>
            {categories?.map((category) => (
              <RadioWrapper
                key={category.id}
                currentItem={category}
                selectedValue={value}
                onChange={() => onChange(category.id)}
                name='id'
              >
                <CategoryCard category={category} />
              </RadioWrapper>
            ))}
          </View>
        )}
      />
    </View>
  )
}
