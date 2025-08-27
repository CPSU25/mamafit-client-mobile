import { usePathname, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { memo } from 'react'
import { Dimensions, ImageBackground, TouchableOpacity, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { CarouselRenderItem } from 'react-native-reanimated-carousel'
import Ratings from '~/components/ratings'
import SafeView from '~/components/safe-view'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { getShadowStyles, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

const feedbacks = [
  {
    id: 1,
    author: 'Nguyễn Thị Mai',
    content:
      'Thiết kế rất đẹp và chất lượng tuyệt vời! Từng đường may được chăm chút tỉ mỉ, màu sắc hài hòa và kiểu dáng hiện đại. Tôi đã đặt thêm 2 bộ nữa cho các dịp đặc biệt và cảm thấy cực kỳ hài lòng khi diện chúng trong các buổi tiệc. Đây chắc chắn sẽ là lựa chọn lâu dài của tôi.',
    profilePicture: 'https://github.com/mrzachnugent.png',
    createdAt: '2 ngày trước',
    rated: 5
  },
  {
    id: 2,
    author: 'Trần Văn Hùng',
    content:
      'Dịch vụ tư vấn nhiệt tình, nhân viên luôn lắng nghe nhu cầu và đưa ra gợi ý phù hợp. Sản phẩm nhận được đúng như mong đợi, form vừa vặn và chất liệu cao cấp. Tôi hoàn toàn yên tâm và sẽ giới thiệu cho bạn bè, đồng nghiệp cùng trải nghiệm dịch vụ này.',
    profilePicture: 'https://github.com/shadcn.png',
    createdAt: '1 tuần trước',
    rated: 4
  },
  {
    id: 3,
    author: 'Lê Thị Hoa',
    content:
      'Chất liệu vải mềm mại, form dáng vừa vặn, thoải mái khi mặc trong suốt thai kỳ. Tôi đặc biệt ấn tượng với cách thiết kế linh hoạt giúp dễ dàng di chuyển mà vẫn tôn dáng. Đây là bộ trang phục tôi cảm thấy tự tin nhất từ khi mang thai đến giờ.',
    profilePicture: 'https://github.com/vercel.png',
    createdAt: '3 ngày trước',
    rated: 5
  },
  {
    id: 4,
    author: 'Phạm Minh Tuấn',
    content:
      'Giao hàng nhanh chóng, đóng gói cẩn thận với hộp và túi bảo vệ chắc chắn. Vợ tôi rất thích món quà này, đặc biệt là khi nó vừa vặn hoàn hảo và mang lại sự thoải mái khi mặc. Tôi sẽ tiếp tục mua thêm để làm quà cho các dịp sắp tới.',
    profilePicture: 'https://github.com/facebook.png',
    createdAt: '5 ngày trước',
    rated: 4
  }
]

interface FeedbackCardProps {
  feedback: {
    id: number
    author: string
    content: string
    profilePicture: string
    createdAt: string
    rated: number
  }
}

const FeedbackCard = memo(({ feedback }: FeedbackCardProps) => {
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
        {feedback.content}
      </Text>

      <View className='flex-row items-center gap-3'>
        <Avatar className='w-10 h-10' alt={feedback.author}>
          <AvatarImage source={{ uri: feedback.profilePicture }} />
          <AvatarFallback>
            <Text className='text-sm font-inter-medium'>{feedback.author.charAt(0).toUpperCase()}</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text className='text-sm font-inter-semibold text-white'>{feedback.author}</Text>
          <Text className='text-xs text-white/80'>{feedback.createdAt}</Text>
        </View>
      </View>
    </Card>
  )
})

FeedbackCard.displayName = 'FeedbackCard'

const renderFeedbackItem: CarouselRenderItem<(typeof feedbacks)[0]> = ({ item }) => {
  return <FeedbackCard feedback={item} />
}

export default function DesignLandingScreen() {
  const router = useRouter()
  const progress = useSharedValue<number>(0)
  const windowWidth = Dimensions.get('window').width

  const pathname = usePathname()

  return (
    <ImageBackground source={require('~/assets/images/design-landing.jpg')} className='flex-1'>
      {pathname === '/design' && <StatusBar style='light' />}
      <SafeView>
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
            data={feedbacks}
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
                  Tạo chiếc váy bầu độc đáo theo ý tưởng hoặc hình ảnh của bạn. Designer sẽ tư vấn và thiết kế riêng từ
                  đầu, mang đến mẫu váy đúng phong cách mong muốn.
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
                  Tự thiết kế chiếc váy của bạn với các tùy chọn có sẵn, điều chỉnh từng chi tiết theo ý muốn. Xem ngay
                  bản mẫu trực quan và hoàn tất đặt hàng chỉ trong vài phút.
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
      </SafeView>
    </ImageBackground>
  )
}
