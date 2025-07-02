import React from 'react'
import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { Style } from '~/types/style.type'

interface StyleCardProps {
  style: Style
}

export default function StyleCard({ style }: StyleCardProps) {
  return (
    <View>
      <Text>{style.name}</Text>
    </View>
  )
}
