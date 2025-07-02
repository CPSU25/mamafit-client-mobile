import React from 'react'
import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { Category } from '~/types/category.type'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <View>
      <Text>{category.name}</Text>
    </View>
  )
}
