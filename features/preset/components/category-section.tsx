import { useEffect } from 'react'
import { Control, Controller, FieldValues, Path, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { View } from 'react-native'
import RadioWrapper from '~/components/radio-wrapper'
import { Text } from '~/components/ui/text'
import { useGetCategories } from '~/features/category/hooks/use-get-categories'
import CategoryCard from './category-card'

interface CategorySectionProps<T extends FieldValues> {
  control: Control<T>
  watch: UseFormWatch<T>
  setValue: UseFormSetValue<T>
  name: Path<T>
}

export default function CategorySection<T extends FieldValues>({
  control,
  watch,
  setValue,
  name
}: CategorySectionProps<T>) {
  const { data: categories } = useGetCategories()

  useEffect(() => {
    if (categories) {
      const category = watch(name)
      setValue(name, (category ? category : (categories?.[0]?.id ?? '')) as T[Path<T>])
    }
  }, [categories, setValue, watch, name])

  return (
    <View className='gap-2 px-4 py-2'>
      <Text className='font-inter-semibold text-xl'>Choose Occasion</Text>
      <Controller
        control={control}
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
