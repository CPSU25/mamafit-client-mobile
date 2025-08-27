import { FlatList, Image, View } from 'react-native'
import Ratings from '~/components/ratings'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Text } from '~/components/ui/text'
import { placeholderImage } from '~/lib/constants/constants'
import { Feedback } from '~/types/feedback.type'

interface FeedbackItemProps {
  feedback: Feedback
  isExpandDescription?: boolean
  className?: string
}

export default function FeedbackItem({ feedback, isExpandDescription = false, className }: FeedbackItemProps) {
  return (
    <View className={className}>
      <View className='flex-row items-center gap-2 pb-2'>
        <Avatar alt={feedback.user.userName ?? ''} className='size-6'>
          <AvatarImage source={{ uri: feedback.user.profilePicture ?? placeholderImage }} />
          <AvatarFallback>
            <Text>{feedback.user.userEmail.charAt(0)}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className='font-inter-medium text-xs'>{feedback.user.fullName}</Text>
      </View>

      <View className='gap-1'>
        <Ratings rating={feedback.rated} displayCount={false} />
        <Text className='text-muted-foreground text-xs'>
          Phân loại: {feedback.dressDetail.color}, {feedback.dressDetail.size}
        </Text>
      </View>

      <View className='gap-1 pt-1'>
        <Text numberOfLines={isExpandDescription ? undefined : 2} className='text-xs'>
          {feedback.description}
        </Text>

        {feedback.images && feedback.images.length ? (
          <FlatList
            data={feedback.images}
            renderItem={({ item }) => (
              <Image
                source={{
                  uri: item
                }}
                className='size-24 rounded-2xl'
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName='gap-2'
          />
        ) : null}
      </View>
    </View>
  )
}
