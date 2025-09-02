import { formatDistanceToNow } from 'date-fns'
import { usePathname, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { memo } from 'react'
import { Dimensions, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { CarouselRenderItem } from 'react-native-reanimated-carousel'
import Loading from '~/components/loading'
import Ratings from '~/components/ratings'
import SafeView from '~/components/safe-view'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useGetFeedbacksByType } from '~/features/dress/hooks/use-get-feedbacks-by-type'
import { useRefreshs } from '~/hooks/use-refresh'
import { getShadowStyles, placeholderImage, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Feedback } from '~/types/feedback.type'
import { OrderItemType } from '~/types/order.type'

const FeedbackCard = memo(({ feedback }: { feedback: Feedback }) => {
  return (
    <Card
      className='rounded-3xl p-4 mx-1 gap-4 bg-card/10 border border-border/20'
      style={[styles.container, getShadowStyles('rgba(255, 255, 255, 0.35)')]}
    >
      <View className='flex-row items-center justify-between'>
        {SvgIcon.quoteUp({ size: 26, color: 'WHITE' })}
        <Ratings rating={feedback.rated} displayCount={false} size={14} />
      </View>
      <Text className='text-sm text-justify text-white/80' numberOfLines={5}>
        {feedback?.description}
      </Text>

      <View className='flex-row items-center gap-3'>
        <Avatar className='w-10 h-10' alt={feedback?.userId}>
          <AvatarImage source={{ uri: feedback?.user?.profilePicture ?? placeholderImage }} />
          <AvatarFallback>
            <Text className='text-sm font-inter-medium'>{feedback?.user?.fullName?.charAt(0).toUpperCase()}</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text className='text-sm font-inter-semibold text-white'>
            {feedback?.user?.fullName || feedback?.user?.userEmail?.split('@')[0]}
          </Text>
          <Text className='text-xs text-white/80'>
            {feedback?.createdAt ? formatDistanceToNow(new Date(feedback?.createdAt), { addSuffix: true }) : ''}
          </Text>
        </View>
      </View>
    </Card>
  )
})

FeedbackCard.displayName = 'FeedbackCard'

const renderFeedbackItem: CarouselRenderItem<Feedback> = ({ item }) => {
  return <FeedbackCard feedback={item} />
}

export default function DesignLandingScreen() {
  const router = useRouter()
  const progress = useSharedValue<number>(0)
  const windowWidth = Dimensions.get('window').width

  const pathname = usePathname()
  const {
    data: feedbacks,
    isLoading: isLoadingFeedbacks,
    refetch: refetchFeedbacks
  } = useGetFeedbacksByType(OrderItemType.DesignRequest)

  const { refreshControl } = useRefreshs([refetchFeedbacks])

  if (isLoadingFeedbacks) {
    return <Loading />
  }

  return (
    <ImageBackground source={require('~/assets/images/design-landing.jpg')} className='flex-1'>
      {pathname === '/design' && <StatusBar style='light' />}
      <SafeView>
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
          <View className='flex-1'>
            <View className='px-4 mt-12 mb-4 gap-0.5'>
              <Text className='text-2xl font-inter-bold text-white text-center'>Khách Hàng Nói Gì</Text>
              <Text className='text-xs text-white/80 text-center mx-8'>
                Những đánh giá thực tế và khách quan từ khách hàng đã trực tiếp trải nghiệm dịch vụ của MamaFit
              </Text>
            </View>

            <Carousel
              autoPlayInterval={10 * 1000}
              autoPlay={true}
              data={feedbacks ?? []}
              height={220}
              loop={true}
              pagingEnabled={true}
              snapEnabled={true}
              width={windowWidth}
              style={{
                width: windowWidth
              }}
              mode='parallax'
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50
              }}
              onProgressChange={progress}
              renderItem={renderFeedbackItem}
            />

            <View className='px-4 mt-6 mb-8 gap-0.5'>
              <Text className='text-2xl font-inter-bold text-white text-center'>Hãy Bắt Đầu Ngay!</Text>
              <Text className='text-xs text-white/80 text-center mx-16'>
                Chọn cách để tạo nên chiếc váy bầu hoàn hảo nhất trong suốt hành trình.
              </Text>
            </View>

            <View className='px-4 pb-4 gap-4 flex-1'>
              <TouchableOpacity className='flex-1' onPress={() => router.push('/design/request')}>
                <Card
                  className='p-4 flex-1 bg-pink-600/20 border border-pink-400/40'
                  style={{
                    boxShadow: '0 0 10px 0 rgba(236, 72, 153, 0.3)'
                  }}
                >
                  <View className='flex-row items-center gap-3 mb-3'>
                    {SvgIcon.penTool({ size: 24, color: 'WHITE' })}
                    <Text className='text-lg font-inter-semibold text-white'>Yêu Cầu Thiết Kế Mới</Text>
                  </View>
                  <Text className='text-xs text-white/80 flex-1'>
                    Tạo chiếc váy bầu độc đáo theo ý tưởng hoặc hình ảnh của bạn. Designer sẽ tư vấn và thiết kế riêng
                    từ đầu, mang đến mẫu váy đúng phong cách mong muốn.
                  </Text>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                      {SvgIcon.timeStart({ size: 16, color: 'WHITE' })}
                      <Text className='text-xs text-white/70 font-inter-medium'>1 - 3 ngày thiết kế</Text>
                    </View>
                    <View className='bg-white/10 px-3 py-1 rounded-lg'>
                      <Text className='text-xs text-white font-inter-semibold'>Độc quyền</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              {/* Quick Design Builder Card */}
              <TouchableOpacity className='flex-1' onPress={() => router.push('/design/builder')}>
                <Card
                  className='p-4 flex-1 bg-blue-600/20 border border-blue-400/40'
                  style={{
                    boxShadow: '0 0 10px 0 rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <View className='flex-row items-center gap-3 mb-3'>
                    {SvgIcon.colorSwatch({ size: 24, color: 'WHITE' })}
                    <Text className='text-lg font-inter-semibold text-white'>Thiết Kế Ngay</Text>
                  </View>
                  <Text className='text-xs text-white/80 flex-1'>
                    Tự thiết kế chiếc váy của bạn với các tùy chọn có sẵn, điều chỉnh từng chi tiết theo ý muốn. Xem
                    ngay bản mẫu trực quan và hoàn tất đặt hàng chỉ trong vài phút.
                  </Text>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                      {SvgIcon.scan({ size: 16, color: 'WHITE' })}
                      <Text className='text-xs text-white/70 font-inter-medium'>Thiết kế tức thì</Text>
                    </View>
                    <View className='bg-white/10 px-3 py-1 rounded-lg'>
                      <Text className='text-xs text-white font-inter-semibold'>Nhanh chóng</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeView>
    </ImageBackground>
  )
}
