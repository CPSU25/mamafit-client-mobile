import { useEffect } from 'react'
import { Control, Controller, FieldValues, Path, UseFormSetValue } from 'react-hook-form'
import { View } from 'react-native'
import RadioWrapper from '~/components/radio-wrapper'
import { Text } from '~/components/ui/text'
import { useGetCategoryDetail } from '~/features/category/hooks/use-get-category-detail'
import StyleCard from './style-card'

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
    <View className='gap-2 px-4 py-2'>
      <Text className='font-inter-semibold text-xl'>Choose Style</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <View className='flex-row gap-2 flex-wrap'>
            {stylesByCategory?.styles?.map((style) => (
              <RadioWrapper
                key={style.id}
                currentItem={style}
                selectedValue={value}
                onChange={() => onChange(style.id)}
                name='id'
              >
                <StyleCard style={style} />
              </RadioWrapper>
            ))}
          </View>
        )}
      />
    </View>
  )
}
