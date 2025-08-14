import { useEffect } from 'react'
import { Control, Controller, FieldValues, Path, UseFormSetValue } from 'react-hook-form'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { useGetCategoryDetail } from '~/features/category/hooks/use-get-category-detail'
import { cn } from '~/lib/utils'

interface StyleSectionProps<T extends FieldValues> {
  categoryId: string
  control: Control<T>
  setValue: UseFormSetValue<T>
  name: Path<T>
}

export default function StyleSection<T extends FieldValues>({
  categoryId,
  control,
  setValue,
  name
}: StyleSectionProps<T>) {
  const { data: stylesByCategory } = useGetCategoryDetail(categoryId)

  useEffect(() => {
    if (stylesByCategory) {
      setValue(name, stylesByCategory.styles?.[0]?.id as T[Path<T>])
    }
  }, [stylesByCategory, setValue, name])

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <View className='flex-row gap-6 px-4 pb-8 pt-2'>
            {stylesByCategory?.styles?.map((style) => (
              <TouchableOpacity
                key={style.id}
                className={cn('gap-2 w-20', value === style.id ? 'opacity-100' : 'opacity-40')}
                onPress={() => onChange(style.id)}
              >
                <Image source={{ uri: style.images[0] }} className='w-full h-40' />
                <Text className={cn('text-center text-sm font-inter-medium')}>{style.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </ScrollView>
  )
}
