import { AntDesign, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ratings from '~/components/ratings'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { cn } from '~/lib/utils'

const variations = Array(10)
  .fill(null)
  .map((_, index) => ({
    id: index.toString()
  }))

export default function ProductDetailScreen() {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const { bottom } = useSafeAreaInsets()

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev)
  }

  return (
    <View className='relative flex-1'>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/928220s.jpg?im=Resize,width=750'
          }}
          className='w-full'
          height={320}
        />
        <TouchableOpacity onPress={handleGoBack} className='absolute top-10 left-4 bg-black/50 rounded-full p-1.5'>
          <Feather name='arrow-left' size={24} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/cart')}
          className='absolute top-10 right-4 bg-black/50 rounded-full p-1.5'
        >
          <Feather name='shopping-bag' size={24} color='white' />
        </TouchableOpacity>
        <View className='flex flex-col gap-2'>
          <Text className='text-xs text-muted-foreground px-4 pt-2'>{variations.length} phân loại</Text>
          <FlatList
            data={variations}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Image
                  source={{
                    uri: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/928220s.jpg?im=Resize,width=750'
                  }}
                  className='size-16 rounded-lg'
                />
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName='gap-2 px-4'
          />
          <View className='flex flex-row items-center justify-between px-4'>
            <Text className='text-primary font-inter-semibold text-2xl'>
              <Text className='text-primary underline font-inter-semibold text-lg'>đ</Text>139.400
            </Text>
            <View className='flex flex-row items-center gap-2'>
              <Text className='font-inter-semibold text-[10px]'>26,6k Đã Bán</Text>
              <Feather name='heart' size={16} color='lightgray' />
            </View>
          </View>
          <Text className='font-inter-medium my-1 px-4' numberOfLines={2}>
            Late Night Blush Pink Maternity Ruched One Shoulder Midi Dress
          </Text>
          <View className='bg-muted h-2' />
          <TouchableOpacity className='flex flex-row items-center gap-1 px-4'>
            <Text className='font-inter-medium text-lg'>5.0</Text>
            <AntDesign name='star' size={16} color='orange' />
            <Text className='ml-2 font-inter-medium text-xs flex-1'>
              Đánh giá sản phẩm <Text className='text-muted-foreground text-[8px]'>(100)</Text>
            </Text>
            <Text className='text-muted-foreground text-xs'>Xem tất cả</Text>
            <Feather name='chevron-right' size={16} color='lightgray' />
          </TouchableOpacity>
          <Separator />
          <Feedback />
          <Separator />
          <Feedback />
          <View className='bg-muted h-2' />
          <View className='px-4'>
            <Text className='font-inter-medium text-sm'>Mô tả</Text>
            <Text className='text-muted-foreground text-sm my-2' numberOfLines={isDescriptionExpanded ? undefined : 3}>
              THÔNG TIN SẢN PHẨM: Chất liệu: 100% Cotton Màu sắc: Đen Size áo: S/ M Video HƯỚNG DẪN BẢO QUẢN SẢN PHẨM: -
              Khuyển khích giặt bằng tay để giữ được form - Không giặt chung với quần áo sáng màu Không sử dụng nước tẩy
              lên sản phẩm Phơi mặt trong của sản phẩm để giữ được độ bển màu CHÍNH SÁCH ĐỔI SẢN PHẨM: 1. Thời hạn đổi
              sản phẩm: - Victim hỗ trợ đổi sản phẩm trong vòng 7 ngày kể từ khi nhận hàng (bao gồm thời gian thông báo
              đổi với shop và thời gian gửi lại sản phẩm) - Mỗi hóa đơn chỉ được áp dụng tối đa 1 lần đổi sản phẩm 2.
              Điều kiện đổi sản phẩm: Chỉ áp dụng đổi hàng đối với sản phẩm nguyên giá - Sản phẩm phải chưa qua sử dụng,
              còn nguyên tag, bao bì và hóa đơn
            </Text>
          </View>
          <Separator />
          <TouchableOpacity
            onPress={toggleDescription}
            className='flex flex-row justify-center items-end gap-1 w-full mb-28'
          >
            <Text className='text-sm'>{isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
            <Feather name={isDescriptionExpanded ? 'chevron-up' : 'chevron-down'} size={20} color='gray' />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View
        className='absolute bottom-0 bg-background w-full flex flex-row items-center'
        style={{
          paddingBottom: bottom,
          boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <TouchableOpacity className='flex flex-col items-center gap-1 w-1/4'>
          <Feather name='message-circle' size={20} color={isDarkColorScheme ? 'white' : 'black'} />
          <Text className={cn('text-xs', isDarkColorScheme && 'text-white')}>Trò chuyện</Text>
        </TouchableOpacity>
        <Separator orientation='vertical' className='h-2/3' />
        <TouchableOpacity className='flex flex-col items-center gap-1 w-1/4 py-2'>
          <Feather name='shopping-bag' size={20} color={isDarkColorScheme ? 'white' : 'black'} />
          <Text className={cn('text-xs', isDarkColorScheme && 'text-white')}>Thêm giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex flex-col items-center gap-1 w-2/4 bg-primary py-2'>
          <Text className='text-white text-sm font-inter-medium'>Mua ngay</Text>
          <Text className='text-white font-inter-semibold text-xl'>
            <Text className='text-white underline font-inter-medium'>đ</Text>139.400
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function Feedback() {
  return (
    <View className='flex flex-col gap-1.5 px-4'>
      <View className='flex flex-row items-center gap-2'>
        <Avatar alt="Zach Nugent's Avatar" className='size-6'>
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>
        <Text className='font-inter-medium text-xs'>9u4aclg24u</Text>
      </View>
      <Ratings rating={5} displayCount={false} />
      <Text className='text-muted-foreground text-xs'>Phân loại: Trắng, S</Text>
      <Text numberOfLines={2} className='text-xs'>
        Áo mềm chất ổn, form rộng nha, phù hợp với các bạn cao to mặc vừa che khuyết điểm tốt vừa có gu
      </Text>
      <FlatList
        data={variations}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Image
              source={{
                uri: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDRydmdvZ2ltbHUycTQwc21lODh1anVmY2Exb3VmMXhrbDE1bGZ4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Dg4TxjYikCpiGd7tYs/giphy.gif'
              }}
              className='size-32 rounded-xl'
            />
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName='gap-2'
      />
    </View>
  )
}
