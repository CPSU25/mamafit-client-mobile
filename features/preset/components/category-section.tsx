import { useEffect, useRef, useState } from 'react'
import { Control, Controller, FieldValues, Path, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { useGetCategories } from '~/features/category/hooks/use-get-categories'
import { cn } from '~/lib/utils'

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

  const scrollViewRef = useRef<ScrollView>(null)
  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [categoryLayouts, setCategoryLayouts] = useState<{ [key: string]: { x: number; width: number } }>({})

  useEffect(() => {
    if (categories) {
      const category = watch(name)
      setValue(name, (category ? category : (categories?.[0]?.id ?? '')) as T[Path<T>])
    }
  }, [categories, setValue, watch, name])

  // Auto-scroll to center the selected category
  const selectedCategoryId = watch(name)
  useEffect(() => {
    const selectedCategoryLayout = categoryLayouts[selectedCategoryId]
    if (selectedCategoryLayout && scrollViewRef.current && scrollViewWidth > 0) {
      const centerPosition = selectedCategoryLayout.x + selectedCategoryLayout.width / 2 - scrollViewWidth / 2
      const scrollPosition = Math.max(0, centerPosition)

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollPosition,
          animated: true
        })
      }, 100)
    }
  }, [selectedCategoryId, categoryLayouts, scrollViewWidth])

  const handleCategoryLayout = (categoryId: string, event: any) => {
    const { x, width } = event.nativeEvent.layout
    setCategoryLayouts((prev) => ({
      ...prev,
      [categoryId]: { x, width }
    }))
  }

  const handleScrollViewLayout = (event: any) => {
    const { width } = event.nativeEvent.layout
    setScrollViewWidth(width)
  }

  return (
    <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} onLayout={handleScrollViewLayout}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <View className='flex-row gap-4 items-center p-4'>
            {categories?.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={cn(
                  'justify-center items-center gap-2 relative rounded-2xl',
                  category.id === value ? 'bg-purple-50' : ''
                )}
                onPress={() => onChange(category.id)}
                onLayout={(event) => handleCategoryLayout(category.id, event)}
                style={{
                  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Image source={{ uri: category.images[0] }} className='w-72 h-40 rounded-t-2xl' resizeMode='cover' />
                <View className='flex-row items-center gap-2 mb-2'>
                  {category.id === value ? (
                    <View className='w-5 h-5 border border-primary rounded-full justify-center items-center'>
                      <View className='w-3 h-3 bg-primary rounded-full' />
                    </View>
                  ) : (
                    <View className='w-5 h-5 border border-border rounded-full' />
                  )}
                  <Text
                    className={cn('text-center text-sm font-inter-medium', category.id === value ? 'text-primary' : '')}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </ScrollView>
  )
}
